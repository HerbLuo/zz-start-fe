import SyncOutlined from "@ant-design/icons/SyncOutlined"; 
import ExportOutlined from "@ant-design/icons/DeliveredProcedureOutlined";
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
import { useCallback, useMemo } from "react";

type T = {};

export default function TaggedPage() {
  const params = useParams();
  const tag = params.page || "unknown";
  const pageTag = `page:${tag}`;
  const { el, fetchData, error } = useQuery(tag);
  const { el: colCfgEl, mergeColumn } = useColumns<T>(pageTag);
  const { rowSelection } = useTableSelection<number, T>();
  const { rows, loading, pagination, refresh } = useTable(pageTag, fetchData); 

  const columns = useMemo(() => mergeColumn([
    { title: "操作" },
  ]), [mergeColumn]);

  const exportData = useCallback(() => {
  }, []);

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
            <Button type="primary">新增</Button>
            <Button title="刷新" icon={<SyncOutlined/>} onClick={refresh}/>
            <Button title="导出" icon={<ExportOutlined/>} onClick={exportData}/>
            {colCfgEl}
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
