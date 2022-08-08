import SyncOutlined from "@ant-design/icons/SyncOutlined"; 
import ExportOutlined from "@ant-design/icons/DeliveredProcedureOutlined";
import { useQuery } from "../../utils/query";
import { useTable } from "../../utils/table";
import { Mergers, useColumns } from "../../utils/table/use-columns";
import { Button, Table } from "antd";
import { useTableSelection } from "../../utils/table/use-table-selection";
import { I18n } from "../../i18n/use-i18n";
import { i18n } from "../../i18n/core";
import { useParams } from "react-router-dom";
import { PlanNotFound } from "../../api/constants";
import NotFoundPage from "../not-found";
import { useCallback, useMemo } from "react";
import { useData } from "../../utils/hooks/use-data";
import { sysSelectApi } from "../../api/sys-select-api";

type T = {};

export default function TaggedPage() {
  const tag = useParams<"page">().page;
  // pageTag = tag + ':' + 子界面名称
  // 其中tag为sys_select表中的tag，由后端提供。子界面名称为前端定义的任意字符
  const pageTag = `${tag}:page`;

  // 从服务器获取数据
  const [serverPlan, error] = useData(
    sysSelectApi.getPlan, pageTag, { alert: false }
  );
  // 使用多选框
  const { rowSelection } = useTableSelection<number, T>();
  // 使用查询方案
  const { el, fetchData } = useQuery(serverPlan);
  // 额外的列
  const columnMergers: Mergers<T> = useMemo<Mergers<T>>(() => [
    { title: "操作", fixed: "right" },
  ], []);
  // 获取表格列配置
  const { el: colCfgEl, columns } = useColumns<T>(pageTag, serverPlan, columnMergers);
  // 生成表格数据及操作方法
  const { rows, loading, pagination, refresh } = useTable(pageTag, fetchData); 

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
