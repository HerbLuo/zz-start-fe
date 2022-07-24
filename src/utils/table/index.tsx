import { TablePaginationConfig, TableProps } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { i18n as i18nGlobal } from "../../i18n/core";
import { SysQueryDataReq } from "../../types/SysQueryDataReq";
import { SysQueryDataRes } from "../../types/SysQueryDataRes";
import { I18n } from "../../i18n/use-i18n";
import { useStorageState } from "../hooks/use-storage-state";
import { logger } from "../logger";
import { userId } from "../site";
import { PromiseOr } from "../ts";

const i18n = i18nGlobal.module("table");

type ReplaceReq = (sysQueryDataReq: SysQueryDataReq) => SysQueryDataReq;

export type FetchData = (
  page: number, 
  pagesize: number, 
  replaceReq?: ReplaceReq,
  uSeeUGet?: boolean,
) => Promise<SysQueryDataRes>;

interface UseTableOptions {
  pagesize?: number;
  pagination?: boolean;
  beforePageChange?: (page: number) => void;
}

interface TableView<T> {
  rows: T[];
  total: PromiseOr<number>;
  loading?: boolean;
}
export type SetTable<T> = React.Dispatch<React.SetStateAction<TableView<T>>>;

export type Refresh<T> = (
  data?: PromiseOr<Partial<T>>,
  finder?: (a: T, b: Partial<T>) => boolean,
) => Promise<void>;

export interface UseTableResult<T> {
  rows: T[];
  total: number | undefined;
  loading: boolean;
  pagination: false | TablePaginationConfig;
  setTable: SetTable<T>;
  refresh: Refresh<T>;
  onTableChange: TableProps<T>["onChange"]; // sorter核心方法
}

export function useTable<T extends {}>(
  tag: string, 
  fetchData: FetchData | undefined,
  options: UseTableOptions = {},
) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<number>();
  const [pagesize, setPagesize] = useStorageState(
    `${tag}:${userId()}:table`,
    options.pagesize || 10,
  );

  const optionPagination = options.pagination ?? true;
  const optionPagesize = options.pagesize;

  useEffect(() => {
    if (optionPagesize) {
      setPagesize(optionPagesize);
    }
  }, [optionPagesize, setPagesize]);

  const loadData = useCallback((refreshMode: boolean) => {
    if (!fetchData) {
      return;
    }
    let cancel = false;
    setLoading(true);
    if (refreshMode) {
      logger.debug(tag + " refreshing.");
    } else {
      logger.debug(tag + " loading.");
    }

    const fetchResult = optionPagination 
      ? fetchData(page, pagesize, undefined, refreshMode)
      : fetchData(1, 100000, undefined, refreshMode);

    fetchResult.then(table => {
      if (!cancel) {
        logger.debug(tag + " rows fetched.");
        setRows(table.rows as T[]);
      }
      return table.total;
    }).then(total => {
      if (!cancel) {
        logger.debug(tag + " total count fetched.");
        setTotal(total);
      }
      setLoading(false);
    });
    return () => { 
      cancel = true;
    };
  }, [tag, page, pagesize, fetchData, optionPagination]);

  // 负责获取数据以及自动刷新界面
  useEffect(() => {
    return loadData(false);
  }, [loadData]);

  // 刷新表格
  const refresh: Refresh<T> = useCallback(async (
    data?: PromiseOr<Partial<T>>,
    finder = (a: T, b: Partial<T>) => (a as any).id === (b as any).id,
  ) => {
    if ((data as {nativeEvent?: unknown})?.nativeEvent instanceof Event) {
      data = undefined;
    }
    if ((data as {target?: unknown})?.target instanceof Node) {
      data = undefined;
    }

    if (!data) {
      logger.info(tag + " is refreshing, full mode.");
      loadData(true);
      return;
    }
    const newData = await data;
    const newRows = rows.map(row => {
      if (!finder(row, newData)) {
        return row;
      }
      return {
        ...row,
        ...newData,
      };
    });
    setRows(newRows);
  }, [tag, rows, loadData]);

  const { beforePageChange } = options;
  const onPageChange = useCallback((page: number) => {
    if (beforePageChange) {
      beforePageChange(page);
    }
    setPage(page);
    setLoading(true);
  }, [beforePageChange]);

  const onShowSizeChange = useCallback((page: number, pagesize: number) => {
    setPage(page);
    setPagesize(pagesize);
  }, [setPagesize]);

  const showTotal = useCallback((t: number) => {
    return total === undefined ? "loading" : <I18n text={i18n("共 {} 条", t)}/>;
  }, [total]);

  const pagination: false | TablePaginationConfig = optionPagination === false 
    ? false 
    : {
      total,
      pageSize: pagesize,
      current: page,
      showQuickJumper: true,
      showSizeChanger: true,
      showTotal,
      onChange: onPageChange,
      onShowSizeChange,
    };

  return {
    rows,
    loading,
    refresh,
    pagination,
  };
}
