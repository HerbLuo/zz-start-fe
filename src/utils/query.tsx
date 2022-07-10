import { CSSProperties, useEffect, useMemo, useState } from "react";
import { sysQueryApi } from "../api/sys-query-api";
import { SysQueryUserPlanRes } from "../types/SysQueryUserPlanRes";

const createStyle = <T extends { [name: string]: CSSProperties | ((...args: any[]) => CSSProperties) }>(map: T): T => map;
const styles = createStyle({
  userSettings: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
  },
  userSettingsLabel: {
    padding: "4px 0",
  },
  userSetting: (current: boolean) => ({

  })
});

export function SysQuery() {



  return (
    <div className="sys-query">
      <div style={styles.userSettings}>
        <span style={styles.userSettingsLabel}>我的方案：</span>
        {/* {userSettings.map(setting => (
          <div 
            key={setting.id} 
            style={styles.userSetting(setting.id === currentSettingId)}
            onClick={onSettingClick(setting.id)}
          >
            {isEqual(setting, settingsFromServerRef.current.find(s => s.id === setting.id)) ? null 
              : <div style={styles.point}/>}
            {editing && !setting.public ? <CloseCircleOutlined style={styles.deleteIcon} onClick={deleteSetting(setting.id)} /> : null}
            {setting.name}
          </div>
        ))}
        <Button type="link" onClick={edit}>{editing ? "确定" : "编辑"}</Button> */}
      </div>

    </div>
  );
}

export function useQuery(
  tag: string,
) {
  const [userPlan, setUserPlan] = useState<SysQueryUserPlanRes>();
  useEffect(() => {
    sysQueryApi.getPlan(tag).then(setUserPlan);
  }, [tag]);
  console.log(userPlan);

  const fetchData = useMemo(() => {

  }, []);

  return {
    el: <SysQuery/>,
    fetchData,
  };
}
