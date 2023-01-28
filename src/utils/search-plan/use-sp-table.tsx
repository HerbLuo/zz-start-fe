import SyncOutlined from "@ant-design/icons/SyncOutlined"; 
import ExportOutlined from "@ant-design/icons/DeliveredProcedureOutlined";
import { useQuery } from "../../utils/search-plan/use-query";
import { useTable } from "../../utils/table";
import { Mergers, useColumns } from "../../utils/table/use-columns";
import { Button, Table } from "antd";
import { useTableSelection } from "../../utils/table/use-table-selection";
import { I18n } from "../../i18n/use-i18n";
import { i18n } from "../../i18n/core";
import { PlanNotFound } from "../../api/constants";
import NotFoundPage from "../../pages/not-found";
import { useCallback } from "react";
import { useData } from "../../utils/hooks/use-data";
import { sysSearchPlanApi } from "../../api/sys-search-plan-api";

interface Config<T> {
  columnMergers?: Mergers<T>;
}

interface FragmentConfig {
  type: "fragment"; 
  parentPage: string;
}
type WithTypeConfig<T> = Config<T> & ({ type?: "page" } | FragmentConfig);

export function useSpTable<T extends {}>(
  tag: string, 
  config: WithTypeConfig<T> = {},
) {
  const pageTag = `${tag}:page`;

  // 从服务器获取数据
  const [serverPlan, error] = useData(
    sysSearchPlanApi.getPlan, pageTag
  );
  // 使用多选框
  const { rowSelection } = useTableSelection<number, T>();
  // 使用查询方案
  const { el, fetchData } = useQuery(serverPlan);
  // 生成表格数据及操作方法
  const { rows, loading, pagination, refresh } = useTable<T>(pageTag, fetchData); 
  // 获取表格列配置
  const { el: columnConfigEl, columns } = useColumns<T>(
    pageTag, serverPlan, config.columnMergers
  );

  const exportData = useCallback(() => {
  }, []);

  let withTableEl: JSX.Element | null;
  if (error === undefined) {
    withTableEl = null;
  } else if (error && (error as {code?: unknown}).code === PlanNotFound) {
    withTableEl = <NotFoundPage/>;
  } else {
    withTableEl = (
      <div className="zz-wrapper">
        {el}
        <div className="zz-wrapper-content">
          <div className="zz-wrapper-title">
            <b><I18n text={i18n("列表")}/></b>
            <div className="zz-wrapper-operators">
              <Button type="primary">新增</Button>
              <Button title="刷新" icon={<SyncOutlined/>} onClick={refresh}/>
              <Button title="导出" icon={<ExportOutlined/>} onClick={exportData}/>
              {columnConfigEl}
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
  return { el: withTableEl };
}
