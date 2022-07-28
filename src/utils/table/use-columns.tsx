import SettingOutlined from "@ant-design/icons/SettingOutlined";
import { Button, Popover } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ColumnType } from "antd/lib/table";
import { _logger } from "../logger";
import { SortableCheckboxGroup, SortableCheckboxOption } from "../antd-pro/sortable-checkbox-group";
import { SysSelectUserPlanRes } from "../../types/SysSelectUserPlanRes";

const logger = _logger(import.meta.url);

type CouldMerge<T> = ColumnType<T> & {
  before?: string;
  after?: string;
};
export type Mergers<T> = Array<ColumnType<T> & CouldMerge<T>>;

export interface UseColumnsResult<T> {
  el: JSX.Element;
  columns: ColumnType<T>[]; 
}

export function useColumns<T extends {}>(
  serverPlan: SysSelectUserPlanRes | undefined,
  /** 会根据title 或 dataIndex与服务器中的列配置合并。 */
  mergers?: Mergers<T>,
  /** 指定字段的默认排序 */
  reorder?: string,
): UseColumnsResult<T> {
  const serverColumns = useMemo<ColumnType<T>[]>(() => [
    { title: "字典编号", dataIndex: "id" },
    { title: "字典名称", dataIndex: "name" },
    { title: "字典类型", dataIndex: "type" },
    { title: "状态", dataIndex: "status" },
    { title: "创建时间", dataIndex: "create_time" },
  ], []);
  const columns = useMemo(() => {
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
        console.log("index-", oldColumnIndex);
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
    return columns?.map(col => {
      return {
        label: col.title?.toString() || "t",
        value: col.dataIndex + "",
        checked: true,
        sortable: true,
        checkable: true,
      };
    }) || [];
  }, [columns]);
  const onChange = useCallback((options: SortableCheckboxOption[]) => {
    // setColumns();
  }, []);

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

  return { el, columns: serverColumns };
}
