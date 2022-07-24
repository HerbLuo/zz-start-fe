import { ColumnType } from "antd/lib/table";

export function useColumns(pageTag: string) {
  const columns: ColumnType<{}>[] = [
    { title: "字典编号", dataIndex: "id" },
    { title: "字典名称", dataIndex: "name" },
    { title: "字典类型", dataIndex: "type" },
    { title: "状态", dataIndex: "status" },
    { title: "创建时间", dataIndex: "create_time" },
  ];

  return { columns };
}
