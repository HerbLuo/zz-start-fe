import CloseOutlined from "@ant-design/icons/CloseOutlined";
import { Button, Input, Select } from "antd";
import { useCallback, useMemo } from "react";
import { SysQueryElementEntity } from "../../types/SysQueryElementEntity";
import { SysQueryUserPlan } from "../../types/SysQueryUserPlan";
import { SysQueryUserPlanItemEntity } from "../../types/SysQueryUserPlanItemEntity";
import { createAsync } from "../async/create-async";
import { useStorageState } from "../hooks/use-storage-state";
import { userId } from "../site";
import { styles } from "./SysQuery.style";

interface QuickFiltersProps {
  activePlan: SysQueryUserPlan;
  elements: SysQueryElementEntity[];
}

const AsyncSelect = createAsync(Select, ["options"]);

export function SysQueryQuickFilters(props: QuickFiltersProps) {
  const { activePlan, elements } = props;
  const items = activePlan?.items;

  if (!items || !items.length) {
    return null;
  }

  const filters = items.map(item => {
    return <SysQueryQuickFilter key={item.id} item={item} elements={elements}/>;
  });

  return <>{filters}</>;
}

interface QuickFilterProps {
  item: SysQueryUserPlanItemEntity;
  elements: SysQueryElementEntity[];
}
function SysQueryQuickFilter(props: QuickFilterProps) {
  const { elements, item } = props;

  const [expand, setExpand] = useStorageState(
    `${item.sysQueryTagCnRedundant}:${userId()}:expand`, 
    false,
  );

  const element = elements?.find(ele => ele.id === item.sysQueryElementId);
  let input: React.ReactNode = "?";
  if (!element) {
    input = null;
  } else {
    input = <Input/>;
  }

  const aliasOptions = useMemo(() => {
    return elements.map(ele => ({label: ele.aliasCn, value: ele.id}));
  }, [elements]);

  const conditionOptions = useMemo(() => {
    const element = elements.find(ele => item.sysQueryElementId === ele.id);
    if (!element) {
      return [];
    }
    const conditionsMap = JSON.parse(element.limitConditions);
    const conditions = Object.entries(conditionsMap).map(([k, v]) => {
      const value = typeof v === "string" ? v : (v as {value: string}).value;
      return {label: k, value};
    });
    return conditions;
  }, [item, elements]);

  // (e) => setUserSettingItem(itemId, { key: e as any, value: null, condition: null as any })
  const onSelectElementAliasChange = useCallback((v: unknown) => {

  }, []);

  // onChange={(e) => setUserSettingItem(itemId, { condition: e as any })}
  const onSelectElementConditionChange = useCallback((v: unknown) => {

  }, []);

  const deletePlanItemId = (planItemId: number) => () => {

  };

  return (
    <div style={styles.quickFilter}>
      <Select
        // autoWidth={true}
        options={aliasOptions}
        style={styles.marginRight8} 
        value={item.sysQueryElementId}
        onChange={onSelectElementAliasChange}
      />
      <AsyncSelect
        options={conditionOptions}
        style={{minWidth: 108, marginRight: 8}}
        value={item.searchCondition}
        onChange={onSelectElementConditionChange}
      />
      {input}
      {expand ? (
        <Button 
          size="small"
          icon={<CloseOutlined/>} 
          style={styles.deleteItem} 
          onClick={deletePlanItemId(item.id)}
        />
      ) : null}
    </div>
  );
}
