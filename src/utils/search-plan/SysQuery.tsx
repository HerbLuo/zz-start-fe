import { Button, message } from "antd";
import DownOutlined from "@ant-design/icons/DownOutlined";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useStorageState } from "../hooks/use-storage-state";
import { isEqual } from "lodash-es";
import { styles } from "./SysQuery.style";
import { confirm } from "../notification";
import { i18nGlobal } from "../../i18n/core";
import { freeze } from "../freeze";
import { delay } from "../delay";
import { nextIdNum } from "../random";
import { SysQueryPlanBtn } from "./SysQueryPlanBtn";
import { SysQueryQuickFilters } from "./SysQueryQuickFilters";
import { userId } from "../site";
import { cloneBean } from "../clone";
import { I18n } from "../../i18n/use-i18n";
import { SysSpUsrPlanRes } from "../../types/SysSpUsrPlanRes";
import { SysSpUsrPlan } from "../../types/SysSpUsrPlan";
import { SysSpEleEntity } from "../../types/SysSpEleEntity";
import { SysSpUsrPlanItemEntity } from "../../types/SysSpUsrPlanItemEntity";

const i18n = i18nGlobal.module("query");

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
interface SysQueryProps {
  pageTag: string | undefined;
  serverUserPlan: SysSpUsrPlanRes | undefined;
  activePlanRef: React.MutableRefObject<SysSpUsrPlan | undefined>;
  setActivePlanForFetch: SetState<SysSpUsrPlan | undefined>;
}

export function SysQuery(props: SysQueryProps) {
  const { pageTag, serverUserPlan, activePlanRef, setActivePlanForFetch } = props;
  const tag4db = pageTag || "loading";

  const [plans, setPlans] = useState<SysSpUsrPlan[]>();
  const [elements, setElements] = useState<SysSpEleEntity[]>();
  const [activePlanId, setActivePlanId] = useStorageState<number | null>(
    `${tag4db}:${userId()}:active-plan`,
    null,
  );
  const serverPlanRef = useRef(serverUserPlan?.plans);
  const [editing, setEditing] = useState(false);
  const [more, setMore] = useStorageState(`${tag4db}:${userId()}:more`, false);
  const activePlan = plans?.find(plan => plan.plan.id === activePlanId);
  activePlanRef.current = activePlan;

  useEffect(() => {
    if (!serverUserPlan) {
      return;
    }
    const { plans, elements } = serverUserPlan;
    setPlans(cloneBean(plans));
    setElements(elements);
    serverPlanRef.current = plans;
  }, [serverUserPlan]);

  const setActivePlan = useCallback((
    newPlan: SysSpUsrPlan | ((p: SysSpUsrPlan) => SysSpUsrPlan)
  ) => {
    setPlans(plans => plans?.map(plan => {
      if (plan.plan.id === activePlanId) {
        if (typeof newPlan === "function") {
          return newPlan(plan);
        }
        return newPlan;
      }
      return plan;
    }));
  }, [activePlanId]);

  // 设置默认激活的查询方案
  useEffect(() => {
    const serverPlan = serverPlanRef.current;
    if (!activePlanId) {
      const defaultId = serverPlan?.find(({plan}) => plan.default)?.plan.id;
      if (defaultId) {
        setActivePlanId(defaultId);
      } else if (serverPlan?.length && serverPlan.length > 0) {
        setActivePlanId(serverPlan[0].plan.id);
      }
    }
  }, [activePlanId, setActivePlanId]);

  // 目的是为了在初始化后，自动执行一遍fetch
  const fetched = useRef(false);
  useEffect(() => {
    if (activePlan && !fetched.current) {
      setActivePlanForFetch(activePlan);
      fetched.current = true;
    }
  }, [activePlan, setActivePlanForFetch]);

  const onPlanClick = (planId: number) => () => {
    setActivePlanId(planId);
  }

  const onPlanRename = (planId: number) => (name: string) => {
    setPlans(plans => plans?.map(plan => {
      if (plan.plan.id === planId) {
        return {...plan, plan: {...plan.plan, name}};
      }
      return plan;
    }));
  }

  const deletePlan = (planId: number) => async () => {
    const plan = plans?.find(p => p.plan.id === planId);
    await confirm(i18n("确定删除方案：《{}》?", plan?.plan.name));

    freeze(true);
    await delay(3000);
    freeze(false);
  }

  const edit = useCallback(async () => {
    if (!editing) {
      return setEditing(true);
    }
    freeze(true);
    await delay(1000);

    setEditing(false);
    freeze(false);
  }, [editing]);

  const showMore = useCallback(() => {
    setMore(!more);
  }, [more, setMore]);

  const createItem = useCallback(() => {
    setActivePlan(plan => {
      return {
        ...plan, 
        items: [
          ...plan.items, 
          { id: nextIdNum() } as SysSpUsrPlanItemEntity
        ]
      };
    })
  }, [setActivePlan]);

  const query = useCallback(() => {
    if (activePlan) {
      setActivePlanForFetch(activePlan);
    }
  }, [activePlan, setActivePlanForFetch]);

  const reset = useCallback(async () => {
    await confirm(i18n("确定重置该方案?"));
    const activePlanServer = serverPlanRef.current
      ?.find(({plan}) => plan.id === activePlanId);
      if (activePlanServer) {
        setActivePlan(cloneBean(activePlanServer));
      }
    message.success("重置成功");
  }, [activePlanId, setActivePlan]);

  const clear = async () => {
    await confirm(i18n("确定清空该方案?"));
    setActivePlan(plan => ({ ...plan, items: [] }))
    message.success("清空成功");
  }

  const save = useCallback(() => {

  }, []);

  const saveAs = useCallback(() => {

  }, []);

  return (
    <div className="sys-query" style={styles.sysQuery}>
      <div style={styles.userPlans}>
        <span style={styles.userPlanLabel}><I18n text={i18n("我的方案：")}/></span>
        {!plans ? null : (<>
          {plans.map(({plan, items}) => (
            <SysQueryPlanBtn
              key={plan.id}
              text={plan.name}
              active={plan.id === activePlanId}
              changed={!isEqual(
                {plan, items}, 
                serverPlanRef.current?.find(p => p.plan.id === plan.id)
              )}
              editing={editing}
              editable={!plan.public}
              onClick={onPlanClick(plan.id)}
              onDelete={deletePlan(plan.id)}
              onRename={onPlanRename(plan.id)}
            />
          ))}
          <Button type="link" onClick={edit}>
            {editing ? <I18n text={i18n("确定")}/> : <I18n text={i18n("编辑")}/>}
          </Button>
        </>)}
      </div>
      <div style={styles.filters}>
        <span style={styles.filtersLabel}><I18n text={i18n("快捷筛选：")}/></span>
        {activePlan && elements ? (
          <>
            <div style={styles.filterConditions(more)}>
              <SysQueryQuickFilters
                activePlan={activePlan}
                elements={elements}
              />
            </div>
            <Button 
              style={styles.showMore} 
              icon={<DownOutlined style={styles.showMoreIcon(more)} />} 
              onClick={showMore}
            />
            <Button 
              type="primary"
              style={styles.createItem} 
              icon={<PlusOutlined />}  
              onClick={createItem}
            />
            <Button 
              type="primary" 
              style={styles.query} 
              onClick={query}
            >
              <I18n text={i18n("查询")}/>
            </Button>
            <Button style={{marginLeft: 8}} onClick={reset}>
              <I18n text={i18n("重置")}/>
            </Button>
            <Button style={{marginLeft: 8}} onClick={clear}>
              <I18n text={i18n("清空")}/>
            </Button>
            {activePlan.plan.public 
              ? null 
              : (
                <Button type="link" onClick={save}>
                  <I18n text={i18n("保存方案")}/>
                </Button>
              )
            }
            <Button type="link" onClick={saveAs}>
              <I18n text={i18n("另存为方案")}/>
            </Button>
          </>
        ) : null} 
      </div>
    </div>
  );
}
