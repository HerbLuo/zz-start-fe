import SyncOutlined from "@ant-design/icons/SyncOutlined";
import { useQuery } from "../../utils/query";
import { useTable } from "../../utils/table";
import { useColumns } from "../../utils/table/use-columns";
import { Button, Table } from "antd";
import { useTableSelection } from "../../utils/table/use-table-selection";
import { I18n } from "../../i18n/use-i18n";
import { i18n } from "../../i18n/core";
import { useParams } from "react-router-dom";
import { PlanNotFound } from "../../api/constants";
import NotFoundPage from "../not-found";

export default function TaggedPage() {
  const params = useParams();
  const tag = params.page || "unknown";
  const pageTag = `page:${tag}`;
  const { el, fetchData, error } = useQuery(tag);
  const { columns } = useColumns(pageTag);
  const { rows, loading, pagination, refresh } = useTable(pageTag, fetchData); 
  const [rowSelection] = useTableSelection<number, {}>();

  if (error === undefined) {
    return null;
  }
  if (error && (error as {code?: unknown}).code === PlanNotFound) {
    return <NotFoundPage/>
  }

  return (
    <div className="zz-wrapper">
      {el}
      <div className="zz-wrapper-content">
        <div className="zz-wrapper-title">
          <b><I18n text={i18n("列表")}/></b>
          <div className="zz-wrapper-operators">
            {/* <Button style={marginLeft8} onClick={newItem}>新增</Button> */}
            {/* <Button style={marginLeft8} onClick={}>重置</Button> */}
            <Button icon={<SyncOutlined/>} onClick={refresh}/>
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
