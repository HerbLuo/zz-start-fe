import SettingOutlined from "@ant-design/icons/SettingOutlined";
import { Button } from "antd";
import { useCallback, useMemo } from "react";
import { ColumnType } from "antd/lib/table";
import { _logger } from "../logger";

const logger = _logger(import.meta.url);

type MergeColumn<T> = (
  mergers: ColumnType<T>[]
) => ColumnType<T>[];

export interface UseColumnsResult<T> {
  el: JSX.Element;
  columns: ColumnType<T>[]; 
  /**
   * 覆盖服务器中的列配置。
   * mergers: 列配置数组，会与服务器中的配置合并。
   */
  mergeColumn: MergeColumn<T>;
}

export function useColumns<T extends {}>(pageTag: string): UseColumnsResult<T> {
  const columns: ColumnType<T>[] = useMemo(() => [
    { title: "字典编号", dataIndex: "id" },
    { title: "字典名称", dataIndex: "name" },
    { title: "字典类型", dataIndex: "type" },
    { title: "状态", dataIndex: "status" },
    { title: "创建时间", dataIndex: "create_time" },
  ], []);

  const mergeColumn = useCallback((merges: ColumnType<T>[]) => {
    const mergedColumns = [...columns];
    if (merges.length > 0) {
      logger.debug("column is merging.");
    }
    for (const merger of merges) {
      const { title, dataIndex } = merger;
      if (!title && !dataIndex) {
        logger.warn("mergeColumn的参数必须存在title或者dataIndex才能合并。");
        continue;
      }
      const oldColumnIndex = columns
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
  }, [columns]);

  const el = (
    <Button icon={<SettingOutlined />} title="列设置"/>
  );

  return { el, columns, mergeColumn };
}
