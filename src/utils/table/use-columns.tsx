import SettingOutlined from "@ant-design/icons/SettingOutlined";
import { Button, Popover } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ColumnType } from "antd/lib/table";
import { _logger } from "../logger";
import { 
  SortableCheckboxGroup, 
  SortableCheckboxOption 
} from "../antd-pro/sortable-checkbox-group";
import { SysSpUsrPlanRes } from "../../types/SysSpUsrPlanRes";
import { freeze } from "../freeze";
import { sysSelectApi } from "../../api/sys-select-api";
import { SysSpUsrTblColEntity } from "../../types/SysSpUsrTblColEntity";

const logger = _logger(import.meta.url);

type CouldMerge<T> = ColumnType<T> & {
  before?: string;
  after?: string;
  hidden?: boolean;
  sort?: number;
};
export type Mergers<T> = Array<ColumnType<T> & CouldMerge<T>>;

export interface UseColumnsResult<T> {
  el: JSX.Element;
  columns: ColumnType<T>[]; 
}

export function useColumns<T extends {}>(
  pageTag: string,
  serverPlan: SysSpUsrPlanRes | undefined,
  /** 会根据title 或 dataIndex与服务器中的列配置合并。 */
  mergers?: Mergers<T>,
): UseColumnsResult<T> {
  const [serverColumns, setServerColumns] = useState<CouldMerge<T>[]>([]);
  useEffect(() => {
    if (!serverPlan) {
      return;
    }
    setServerColumns(serverColumnToAntColumn(serverPlan.columns));
  }, [serverPlan]);

  const mergedColumns = useMemo(() => {
    const mergedColumns = [...serverColumns];
    if (!mergers?.length) {
      return mergedColumns;
    }
    if (mergers.length > 0) {
      logger.debug("column is merging.");
    }
    for (const merger of mergers) {
      const { title, dataIndex } = merger;
      if (!title && !dataIndex) {
        logger.warn("mergeColumn的参数必须存在title或者dataIndex才能合并。");
        continue;
      }
      const oldColumnIndex = serverColumns
        .findIndex(col => col.title === title || col.dataIndex === dataIndex);
      if (oldColumnIndex >= 0) {
        const oldColumn = mergedColumns[oldColumnIndex];
        mergedColumns.splice(oldColumnIndex, 1, {...oldColumn, ...merger});
      } else {
        mergedColumns.push(merger);
      }
    }
    return mergedColumns;
  }, [serverColumns, mergers]);
  
  const options: SortableCheckboxOption[] = useMemo(() => {
    return mergedColumns ? antColumnsToCheckboxOptions(mergedColumns) : [];
  }, [mergedColumns]);
  const onChange = useCallback(async (options: SortableCheckboxOption[]) => {
    freeze(true);
    const reorderedColumns = reorderAndReHide(options, mergedColumns);
    const userColumns = checkboxOptionsToUsrCols(pageTag, reorderedColumns);
    await sysSelectApi.saveUserColumns(userColumns);
    console.log(reorderedColumns);
    setServerColumns(reorderedColumns);
    freeze(false);
  }, [pageTag, mergedColumns]);

  const content = (
    <SortableCheckboxGroup
      options={options}
      onChange={onChange}
    />
  );

  const el = (
    <Popover placement="bottomRight" trigger="click" content={content}>
      <Button icon={<SettingOutlined />} title="列设置"/>
    </Popover>
  );

  const columns = useMemo(() => {
    return mergedColumns.filter(col => !col.hidden);
  }, [mergedColumns]);

  return { el, columns };
}

function serverColumnToAntColumn<T>(
  serverColumns: SysSpUsrTblColEntity[]
): CouldMerge<T>[] {
  const sortedServerCols = serverColumns.sort((a, b) => a.sort - b.sort);
  const formattedColumns: ColumnType<T>[] = [];
  for (const column of sortedServerCols) {
    const { render, fixed, type, sort, ...others } = column;
    formattedColumns.push({
      ...(fixed ? { fixed: fixed as "left" | "right" } : {}),
      ...others,
    });
  }
  return formattedColumns;
}

function antColumnsToCheckboxOptions<T>(
  antColumns: CouldMerge<T>[]
): SortableCheckboxOption[] {
  return antColumns.map(col => {
    return {
      label: col.title?.toString() || "?",
      value: col.dataIndex + "",
      checked: !col.hidden,
      sortable: col.fixed ? false : true,
      checkable: true,
    };
  });
}

function checkboxOptionsToUsrCols<T>(
  pageTag: string,
  reorderedColumns: CouldMerge<T>[],
): SysSpUsrTblColEntity[] {
  return reorderedColumns.map(col => {
    const usrCol: Partial<SysSpUsrTblColEntity> = {
      ...col, 
      render: undefined,
      width: undefined,
      title: col.title?.toString(),
      fixed: col.fixed ? (col.fixed === "left" ? "left" : "right") : undefined,
      dataIndex: col.dataIndex?.toString(),
      pageTag,
    };
    return usrCol as SysSpUsrTblColEntity;
  });
}

function reorderAndReHide<T>(
  options: SortableCheckboxOption[],
  columns: CouldMerge<T>[],
): CouldMerge<T>[] {
  for (const column of columns) {
    const optIndex = options.findIndex(opt => 
      opt.label === column.title?.toString()
    );
    const opt = options[optIndex];
    column.sort = (optIndex + 1) * 10000;
    column.hidden = !opt?.checked;
  }
  return columns.sort((a, b) => 
    (a.sort || Number.MAX_VALUE) - (b.sort || Number.MAX_VALUE)
  );
}
