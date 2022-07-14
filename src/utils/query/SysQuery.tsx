import { Button } from "antd";
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import DownOutlined from "@ant-design/icons/DownOutlined";
import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import { SysQueryElementEntity } from "../../types/SysQueryElementEntity";
import { SysQueryUserPlan } from "../../types/SysQueryUserPlan";
import { useStorageState } from "../hooks/use-storage-state";
import isEqual from "lodash.isequal";
import { styles } from "./SysQuery.style";
import { showConfirm, showSuccess } from "../dialog";

import { _logger } from "../logger";
import { i18n as i18nGlobal } from "../../i18n/core";

const logger = _logger(import.meta.url);
const i18n = i18nGlobal.module("query");

interface SysQueryProps {
  tag: string;
  plans?: SysQueryUserPlan[];
  elements?: SysQueryElementEntity[];
}

export function SysQuery(props: SysQueryProps) {
  const { tag, plans: plansServer, elements } = props;

  const [plans, setPlans] = useState<SysQueryUserPlan[]>();
  const [editing, setEditing] = useState(false);
  const [more, setMore] = useStorageState(tag + ":more", false);
  const [activePlanId, setActivePlanId] = useStorageState<number | null>(
    tag + ":active-plan", 
    null,
  );
  
  const activePlan = plans?.find(plan => plan.plan.id === activePlanId);

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
    console.log(planId);
  }

  const deletePlan = (planId: number) => () => {

  }

  const edit = useCallback(() => {

  }, []);

  const showMore = useCallback(() => {
    setMore(!more);
  }, [more, setMore]);

  const reset = async () => {
    await showConfirm(i18n("确定重置该方案?"));
    // const resetUserSettings = userSettings.map(setting => {
    //   if (setting.id !== currentSettingId) {
    //     return setting;
    //   }
    //   return settingsFromServerRef.current.find(setting => setting.id === currentSettingId)!;
    // });
    // setUserSettings(resetUserSettings);
    // // setCurrentSetting({
    // //   items: [{id: nextStr()} as UserSettingItem<keyof T>],
    // // });
    // message.success("重置成功");
  }

  const clear = async () => {
    // await showConfirm("确定清空该方案");
    // setCurrentSetting({
    //   items: [{id: nextStr()} as UserSettingItem<keyof T>],
    // });
    // message.success("清空成功");
  }

  const save = useCallback(() => {

  }, []);

  const saveAs = useCallback(() => {

  }, []);

  return (
    <div className="sys-query">
      <div style={styles.userPlans}>
        <span style={styles.userPlanLabel}>我的方案：</span>
        {!plans ? null : (<>
          {plans.map(({plan, items}) => (
            <PlanBtn
              key={plan.id}
              text={plan.name}
              active={plan.id === activePlanId}
              edited={!isEqual({plan, items}, plansServer?.find(p => p.plan.id === plan.id))}
              showDelete={editing && !plan.readonly}
              onClick={onPlanClick(plan.id)}
              onDelete={deletePlan(plan.id)}
            />
          ))}
          <Button type="link" onClick={edit}>{editing ? "确定" : "编辑"}</Button>
        </>)}
      </div>
      <div style={styles.filters}>
        <span style={styles.filtersLabel}>快捷筛选：</span> 
        <div style={styles.filterConditions(more)}>
          {/* {quickFilters} */}
        </div>
        <Button style={styles.showMore} icon={<DownOutlined style={styles.showMoreIcon(more)} />} onClick={showMore}/>
        {/* <Button style={styles.createItem} icon={<PlusOutlined />} onClick={createItem} type="primary"/> */}
        {/* <Button style={styles.query} onClick={query} type="primary">查询</Button> */}
        <Button style={{marginLeft: 8}} onClick={reset}>重置</Button>
        <Button style={{marginLeft: 8}} onClick={clear}>清空</Button>
        {activePlan?.plan.readonly 
          ? null
          : <Button type="link" onClick={save}>保存方案</Button>
        }
        <Button type="link" onClick={saveAs}>另存为方案</Button>
      </div>
    </div>
  );
}

interface PlanProps {
  text: string;
  active: boolean;
  edited: boolean;
  showDelete: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onDelete?: MouseEventHandler<HTMLDivElement>;
}

function PlanBtn(props: PlanProps) {
  return (
    <div style={styles.userPlan(props.active)} onClick={props.onClick}>
      {props.edited ? <div style={styles.point}/> : null}
      {props.showDelete
        ? (
          <CloseCircleOutlined 
            style={styles.deleteIcon} 
            onClick={props.onDelete} 
          /> 
        )
        : null
      }
      <button style={styles.planButton}>{props.text}</button>
    </div>
  );
}
