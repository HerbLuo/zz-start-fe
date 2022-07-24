import { TablePaginationConfig, TableProps } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [refresh, setRefresh] = useState(0);
  const refreshRef = useRef(refresh);
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

  // 负责获取数据以及自动刷新界面
  useEffect(() => {
    if (!fetchData) {
      return;
    }
    let cancel = false;
    setLoading(true);
    logger.debug(tag + " loading.");
    if (refreshRef.current !== refresh) {
      logger.debug(tag + " refreshing.");
      refreshRef.current = refresh;
    }

    const fetchResult = optionPagination 
      ? fetchData(page, pagesize)
      : fetchData(1, 100000);

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
    return () => { cancel = true };
  }, [tag, page, pagesize, fetchData, refresh, optionPagination]);

  // 刷新表格
  const doRefresh: Refresh<T> = useCallback(async (
    data?: PromiseOr<Partial<T>>,
    finder = (a: T, b: Partial<T>) => (a as any).id === (b as any).id,
  ) => {
    if (!data) {
      logger.log(tag + " is refreshing, full mode.");
      setRefresh(refresh + 1);
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
  }, [tag, refresh, rows]);


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
    refresh: doRefresh,
    pagination,
  };
}
