import { Button, message } from "antd";
import CloseCircleTwoTone from "@ant-design/icons/CloseCircleTwoTone";
import DownOutlined from "@ant-design/icons/DownOutlined";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import { SysQueryElementEntity } from "../../types/SysQueryElementEntity";
import { SysQueryUserPlan } from "../../types/SysQueryUserPlan";
import { useStorageState } from "../hooks/use-storage-state";
import isEqual from "lodash.isequal";
import { styles } from "./SysQuery.style";
import { showConfirm } from "../dialog";
import { _logger } from "../logger";
import { i18n as i18nGlobal } from "../../i18n/core";
import { freeze } from "../freeze";
import { FadeIn } from "../transition";
import { delay } from "../delay";

const logger = _logger(import.meta.url);
const i18n = i18nGlobal.module("query");

interface SysQueryProps {
  tag: string;
  plansServer?: SysQueryUserPlan[];
  elements?: SysQueryElementEntity[];
}

export function SysQuery(props: SysQueryProps) {
  const { tag, plansServer, elements } = props;

  const [plans, setPlans] = useState<SysQueryUserPlan[]>();
  const [editing, setEditing] = useState(false);
  const [more, setMore] = useStorageState(tag + ":more", false);
  const [activePlanId, setActivePlanId] = useStorageState<number | null>(
    tag + ":active-plan", 
    null,
  );
  
  const activePlan = plans?.find(plan => plan.plan.id === activePlanId);

  useEffect(() => {
    if (plansServer) {
      setPlans(plans => {
        if (plans) {
          logger.warn("plansServer发生变动", plans, plansServer);
        } else {
          logger.info(plansServer);
        }
        return JSON.parse(JSON.stringify(plansServer))
      });
    }
  }, [plansServer]);

  useEffect(() => {
    if (!activePlanId) {
      const defaultId = plansServer?.find(({plan}) => plan.default)?.plan.id;
      if (defaultId) {
        setActivePlanId(defaultId);
      } else if (plansServer?.length && plansServer.length > 0) {
        setActivePlanId(plansServer[0].plan.id);
      }
    }
  }, [activePlanId, plansServer, setActivePlanId]);

  const onPlanClick = (planId: number) => () => {
    console.log(planId);
  }

  const deletePlan = (planId: number) => async () => {
    const plan = plans?.find(p => p.plan.id === planId);
    await showConfirm(i18n("确定删除方案：《{}》?", plan?.plan.name));

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

  const createItem = () => {
    // setCurrentSetting({
    //   items: [...currentSetting?.items!, {id: nextStr()} as UserSettingItem<keyof T>]
    // });
  }

  const query = useCallback(() => {
    // if (!setQuerySetting) {
    //   return showWarnWithoutSign("未配置userSettingRef, 无法实现查询");
    // }
    // setQuerySetting(currentSetting);
  }, []);

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
    message.success("重置成功");
  }

  const clear = async () => {
    await showConfirm(i18n("确定清空该方案?"));
    // setCurrentSetting({
    //   items: [{id: nextStr()} as UserSettingItem<keyof T>],
    // });
    message.success("清空成功");
  }

  const save = useCallback(() => {

  }, []);

  const saveAs = useCallback(() => {

  }, []);

  return (
    <div className="sys-query" style={styles.sysQuery}>
      <div style={styles.userPlans}>
        <span style={styles.userPlanLabel}>我的方案：</span>
        {!plans ? null : (<>
          {plans.map(({plan, items}) => (
            <PlanBtn
              key={plan.id}
              text={plan.name}
              active={plan.id === activePlanId}
              changed={!isEqual(
                {plan, items}, 
                plansServer?.find(p => p.plan.id === plan.id)
              )}
              editing={editing}
              editable={!plan.public}
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
        <Button type="primary" style={styles.query} onClick={query}>查询</Button>
        <Button style={{marginLeft: 8}} onClick={reset}>重置</Button>
        <Button style={{marginLeft: 8}} onClick={clear}>清空</Button>
        {activePlan?.plan.public 
          ? null
          : <Button type="link" onClick={save}>保存方案</Button>
        }
        <Button type="link" onClick={saveAs}>另存为方案</Button>
      </div>
    </div>
  );
}

interface PlanBtnProps {
  text: string;
  active: boolean;
  changed: boolean;
  editing: boolean;
  editable: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onDelete?: MouseEventHandler<HTMLDivElement>;
}

function PlanBtn(props: PlanBtnProps) {
  const [hover, setHover] = useState(false);
  const onMouseEnter: MouseEventHandler = useCallback((e) => {
    setHover(true);
  }, []);
  const onMouseLeave: MouseEventHandler = useCallback((e) => {
    setHover(false);
  }, []);

  return (
    <div style={styles.planButtonBox}>
      <Button
        type={props.active ? "primary" : "default"}
        style={styles.planButton(props.active, props.editing, props.editable)}
        onClick={props.onClick}
      >
        {props.text}
      </Button>
      {props.changed ? <div style={styles.point}/> : null}
      <FadeIn if={props.editing && props.editable}>
        <CloseCircleTwoTone
          twoToneColor={hover ? "#FF5500" : "#FFA500"}
          style={styles.deleteIcon} 
          onClick={props.onDelete} 
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      </FadeIn>
    </div> 
  );
}
