import { useCallback, useState } from "react";
import { sysQueryApi } from "../../api/sys-query-api";
import { SysQueryDataReq } from "../../types/SysQueryDataReq";
import { SysQueryDataRes } from "../../types/SysQueryDataRes";
import { SysQueryUserPlan } from "../../types/SysQueryUserPlan";
import { useData } from "../hooks/use-data";
import { SysQuery } from "./SysQuery";

type ReplaceReq = (sysQueryDataReq: SysQueryDataReq) => SysQueryDataReq;

export type FetchData = (
  page: number, 
  pagesize: number, 
  replaceReq?: ReplaceReq,
) => Promise<SysQueryDataRes>;

export function useQuery(tag: string): {el: JSX.Element, fetchData: FetchData} {
  const serverUserPlan = useData(sysQueryApi.getPlan, tag);
  const [planForFetch, setPlanForFetch] = useState<SysQueryUserPlan>();
 
  const fetchData: FetchData = useCallback(async (
    page: number, 
    pageSize: number, 
    replaceReq?: ReplaceReq
  ): Promise<SysQueryDataRes> => {
    if (!planForFetch) {
      return {
        hasNext: false,
        rows: [],
        total: Promise.resolve(0),
      };
    }

    const req: SysQueryDataReq = {
      tag,
      page,
      pageSize,
      conditions: [],
      orderBys: [],
    };
    return sysQueryApi.getData(replaceReq ? replaceReq(req) : req);
  }, [tag, planForFetch]);

  return {
    el: (
      <SysQuery
        tag={tag}
        serverUserPlan={serverUserPlan}
        setActivePlanForFetch={setPlanForFetch}
      />
    ),
    fetchData,
  };
};
