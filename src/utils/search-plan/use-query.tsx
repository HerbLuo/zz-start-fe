import { useMemo, useRef, useState } from "react";
import { sysSearchPlanApi } from "../../api/sys-search-plan-api";
import { SysSpDataReq } from "../../types/SysSpDataReq";
import { SysSpDataRes } from "../../types/SysSpDataRes";
import { SysSpUsrPlan } from "../../types/SysSpUsrPlan";
import { SysSpUsrPlanRes } from "../../types/SysSpUsrPlanRes";
import { _logger } from "../logger";
import { SysQuery } from "./SysQuery";

const logger = _logger(import.meta.url);

type ReplaceReq = (sysQueryDataReq: SysSpDataReq) => SysSpDataReq;

export type FetchData = (
  page: number, 
  pagesize: number, 
  replaceReq?: ReplaceReq,
  uSeeUGet?: boolean,
) => Promise<SysSpDataRes>;

export interface UseQueryResult {
  el: JSX.Element; 
  /** 
   * 控件内触发查询等操作后，
   * fetchData的值会自动更新，
   * 需使用useEffect将其返回结果捕获并展示到界面中
   */
  fetchData?: FetchData;
}

export function useQuery(serverUserPlan?: SysSpUsrPlanRes): UseQueryResult {
  const pageTag = serverUserPlan?.pageTag;
  
  const activePlanRef = useRef<SysSpUsrPlan>();
  const [planForFetch, setPlanForFetch] = useState<SysSpUsrPlan>();

  const fetchData: FetchData | undefined = useMemo(() => planForFetch ? async (
    page: number, 
    pageSize: number, 
    replaceReq?: ReplaceReq,
    uSeeUGet: boolean = false
  ): Promise<SysSpDataRes> => {
    logger.debug("fetching", {page, pageSize}, "mode:", {uSeeUGet});
    const plan = uSeeUGet ? activePlanRef.current : planForFetch;
    if (!plan || !pageTag) {
      logger.warn("未知的查询计划");
      return { hasNext: false, rows: [], total: Promise.reject("unknown"), };
    }

    logger.debug(plan);

    const req: SysSpDataReq = {
      pageTag,
      page,
      pageSize,
      columns: [],
      conditions: [],
      orderBys: [],
    };
    return sysSearchPlanApi.getData(replaceReq ? replaceReq(req) : req);
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
