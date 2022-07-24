import { useMemo, useRef, useState } from "react";
import { sysQueryApi } from "../../api/sys-query-api";
import { SysQueryDataReq } from "../../types/SysQueryDataReq";
import { SysQueryDataRes } from "../../types/SysQueryDataRes";
import { SysQueryUserPlan } from "../../types/SysQueryUserPlan";
import { useData } from "../hooks/use-data";
import { _logger } from "../logger";
import { SysQuery } from "./SysQuery";

const logger = _logger(import.meta.url);

type ReplaceReq = (sysQueryDataReq: SysQueryDataReq) => SysQueryDataReq;

export type FetchData = (
  page: number, 
  pagesize: number, 
  replaceReq?: ReplaceReq,
  uSeeUGet?: boolean,
) => Promise<SysQueryDataRes>;

export interface UseQueryResult {
  el: JSX.Element; 
  /** 
   * 控件内触发查询等操作后，
   * fetchData的值会自动更新，
   * 需使用useEffect将其返回结果捕获并展示到界面中
   */
  fetchData?: FetchData;
  /**
   * 初始化过程中的error
   * undefined 初始化未完毕
   * false 没有已知错误
   * unknown 在一般情况下为 {ok: -1, code: number, message: string}
   */
  error: undefined | false | unknown;
}

export function useQuery(tag: string): UseQueryResult {
  const [serverUserPlan, error] = useData(
    sysQueryApi.getPlan, tag, { alert: false }
  );
  const activePlanRef = useRef<SysQueryUserPlan>();
  const [planForFetch, setPlanForFetch] = useState<SysQueryUserPlan>();

  const fetchData: FetchData | undefined = useMemo(() => planForFetch ? async (
    page: number, 
    pageSize: number, 
    replaceReq?: ReplaceReq,
    uSeeUGet: boolean = false
  ): Promise<SysQueryDataRes> => {
    logger.debug("fetching", {page, pageSize}, "mode:", {uSeeUGet});
    const plan = uSeeUGet ? activePlanRef.current : planForFetch;
    if (!plan) {
      logger.warn("未知的查询计划");
      return { hasNext: false, rows: [], total: Promise.reject("unknown"), };
    }

    logger.debug(plan);

    const req: SysQueryDataReq = {
      tag,
      page,
      pageSize,
      conditions: [],
      orderBys: [],
    };
    return sysQueryApi.getData(replaceReq ? replaceReq(req) : req);
  } : undefined, [tag, planForFetch]);

  return {
    el: (
      <SysQuery
        tag={tag}
        serverUserPlan={serverUserPlan}
        activePlanRef={activePlanRef}
        setActivePlanForFetch={setPlanForFetch}
      />
    ),
    fetchData,
    error,
  };
};
