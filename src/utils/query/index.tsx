import { useMemo, useRef, useState } from "react";
import { sysSelectApi } from "../../api/sys-select-api";
import { SysSelectDataReq } from "../../types/SysSelectDataReq";
import { SysSelectDataRes } from "../../types/SysSelectDataRes";
import { SysSelectUserPlan } from "../../types/SysSelectUserPlan";
import { SysSelectUserPlanRes } from "../../types/SysSelectUserPlanRes";
import { _logger } from "../logger";
import { SysQuery } from "./SysQuery";

const logger = _logger(import.meta.url);

type ReplaceReq = (sysQueryDataReq: SysSelectDataReq) => SysSelectDataReq;

export type FetchData = (
  page: number, 
  pagesize: number, 
  replaceReq?: ReplaceReq,
  uSeeUGet?: boolean,
) => Promise<SysSelectDataRes>;

export interface UseQueryResult {
  el: JSX.Element; 
  /** 
   * 控件内触发查询等操作后，
   * fetchData的值会自动更新，
   * 需使用useEffect将其返回结果捕获并展示到界面中
   */
  fetchData?: FetchData;
}

export function useQuery(serverUserPlan?: SysSelectUserPlanRes): UseQueryResult {
  const pageTag = serverUserPlan?.pageTag;
  
  const activePlanRef = useRef<SysSelectUserPlan>();
  const [planForFetch, setPlanForFetch] = useState<SysSelectUserPlan>();

  const fetchData: FetchData | undefined = useMemo(() => planForFetch ? async (
    page: number, 
    pageSize: number, 
    replaceReq?: ReplaceReq,
    uSeeUGet: boolean = false
  ): Promise<SysSelectDataRes> => {
    logger.debug("fetching", {page, pageSize}, "mode:", {uSeeUGet});
    const plan = uSeeUGet ? activePlanRef.current : planForFetch;
    if (!plan || !pageTag) {
      logger.warn("未知的查询计划");
      return { hasNext: false, rows: [], total: Promise.reject("unknown"), };
    }

    logger.debug(plan);

    const req: SysSelectDataReq = {
      pageTag,
      page,
      pageSize,
      columns: [],
      conditions: [],
      orderBys: [],
    };
    return sysSelectApi.getData(replaceReq ? replaceReq(req) : req);
  } : undefined, [pageTag, planForFetch]);

  return {
    el: (
      <SysQuery
        pageTag={pageTag}
        serverUserPlan={serverUserPlan}
        activePlanRef={activePlanRef}
        setActivePlanForFetch={setPlanForFetch}
      />
    ),
    fetchData,
  };
};
