import { Button } from "antd";
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import { CSSProperties, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { sysQueryApi } from "../api/sys-query-api";
import { SysQueryElementEntity } from "../types/SysQueryElementEntity";
import { SysQueryUserPlan } from "../types/SysQueryUserPlan";
import { createStyle } from "./create-style";
import { useData } from "./hooks/use-data";
import { useStorageState } from "./hooks/use-storage-state";
import isEqual from "lodash.isequal";

const styles = createStyle({
  userPlans: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
  },
  userPlanLabel: {
    height: "32px",
    lineHeight: "32px",
  },
  userPlan: (current: boolean) => ({
    border: current ? undefined : "1px solid #c9c9c9",
    marginRight: "8px",
    padding: "0 10px",
    minWidth: "68px",
    textAlign: "center",
    height: "32px",
    lineHeight: "32px",
    cursor: "pointer",
    fontSize: "12px",
    borderRadius: "2px",
    color: current ? "#FFF" : "#333",
    backgroundColor: current ? "#1890ff" : "#FFF",
    position: "relative",
  }),
  deleteIcon: {
    position: "absolute",
    right: "-12px",
    zIndex: 9999,

    top: "-12px",
    borderRadius: "12px",
    fontSize: "24px",
    color: "#FFF",
    backgroundColor: "#2e8ded",
  } as CSSProperties,
  point: {
    position: "absolute",
    right: "-3px",
    top: "-3px",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#333",
  } as CSSProperties,
});

interface SysQueryProps {
  tag: string;
  plans?: SysQueryUserPlan[];
  elements?: SysQueryElementEntity[];
}

export function SysQuery(props: SysQueryProps) {
  const { tag, plans: plansServer, elements } = props;

  const [plans, setPlans] = useState<SysQueryUserPlan[]>();
  const [editing, setEditing] = useState(false);
  const [activePlanId, setActivePlanId] = useStorageState<number | null>(
    tag + ":active-plan", 
    null,
  );

  useEffect(() => {
    setPlans(plansServer);
  }, [plansServer]);

  useEffect(() => {
    const defaultPlanId = plansServer?.find(({plan}) => plan.default)?.plan.id;
    if (!activePlanId && defaultPlanId) {
      setActivePlanId(defaultPlanId);
    } 
  }, [activePlanId, plansServer, setActivePlanId]);

  const onPlanClick = (planId: number) => () => {

  }

  const deletePlan = (planId: number) => () => {

  }

  const edit = useCallback(() => {

  }, []);

  return (
    <div className="sys-query">
      <div style={styles.userPlans}>
        <span style={styles.userPlanLabel}>我的方案：</span>
        {!plans ? null : (<>
          {plans.map(({plan, items}) => (
            <div 
              key={plan.id} 
              style={styles.userPlan(plan.id === activePlanId)}
              onClick={onPlanClick(plan.id)}
            >
              {/* 是否存在修改 */}
              {isEqual({plan, items}, plansServer?.find(p => p.plan.id === plan.id)) 
                ? null
                : <div style={styles.point}/>
              }
              {/* 删除按钮 */}
              {editing && !plan.readonly 
                ? (
                  <CloseCircleOutlined 
                    style={styles.deleteIcon} 
                    onClick={deletePlan(plan.id)} 
                  /> 
                )
                : null
              }
              {plan.name}
            </div>
          ))}
          <Button type="link" onClick={edit}>{editing ? "确定" : "编辑"}</Button>
        </>)}
      </div>
    </div>
  );
}

export function useQuery(tag: string) {
  const userPlan = useData(sysQueryApi.getPlan, tag);
  const { plans, elements } = userPlan || {};

  const fetchData = useMemo(() => {

  }, []);

  return {
    el: <SysQuery tag={tag} plans={plans} elements={elements}/>,
    fetchData,
  }
};
