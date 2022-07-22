import { useQuery } from "../../utils/query";
import { useTable } from "../../utils/table";
import { Table } from "antd";
import { ColumnType } from "antd/lib/table";
import { useSelection } from "../../utils/hooks/use-selection";

export default function HomePage() {
  const tag = "zi_dian_guan_li";
  const { el, fetchData } = useQuery(tag);
  const { 
    rows, loading, pagination 
  } = useTable(`page:${tag}`, fetchData);

  const columns: ColumnType<{}>[] = [
    { title: "字典编号", dataIndex: "id" },
    { title: "字典名称", dataIndex: "name" },
    { title: "字典类型", dataIndex: "type" },
    { title: "状态", dataIndex: "status" },
    { title: "创建时间", dataIndex: "create_time" },
  ];

  const [rowSelection] = useSelection<number, {}>();

  return (
    <div className="zz-wrapper">
      {el}
      <div className="zz-wrapper-content">
        <div className="zz-wrapper-title">
          <b>列表</b>
          <div>
            {/* <Button style={marginLeft8} onClick={newItem}>新增</Button> */}
            {/* <Button style={marginLeft8} onClick={}>重置</Button> */}
            {/* <Button style={marginLeft8} icon={<SyncOutlined />} onClick={refreshDataByCurrentSetting}/> */}
            {/* <Button style={marginLeft8} icon={<DeliveredProcedureOutlined />} onClick={exportData}/> */}
            {/* {columnConfigurationEl} */}
          </div>
        </div>
        <Table
          bordered={true}
          columns={columns}
          dataSource={rows}
          loading={loading}
          pagination={pagination}
          // onChange={onTableChange}
          rowKey="id"
          rowSelection={rowSelection}
          size="middle"
          scroll={{x: "max-content"}}
        />
      </div>
    </div>
  );
}
