import { useCallback, useState } from "react";
import { sysQueryApi } from "../../api/sys-query-api";
import { SysQueryDataReq } from "../../types/SysQueryDataReq";
import { SysQueryDataRes } from "../../types/SysQueryDataRes";
import { SysQueryUserPlan } from "../../types/SysQueryUserPlan";
import { useData } from "../hooks/use-data";
import { UnPromised } from "../ts";
import { SysQuery } from "./SysQuery";

type FetchDataResult = Promise<SysQueryDataRes> & {
  awaitAll: Promise<UnPromised<SysQueryDataRes, "total">>;
};
type ReplaceReq = (sysQueryDataReq: SysQueryDataReq) => SysQueryDataReq;

export type FetchData = () => (
  page: number, 
  pagesize: number, 
  replaceReq?: ReplaceReq,
) => FetchDataResult;

export function useQuery(tag: string): {el: JSX.Element, fetchData:FetchData} {
  const serverUserPlan = useData(sysQueryApi.getPlan, tag);
  const [planForFetch, setPlanForFetch] = useState<SysQueryUserPlan>();
 
  const fetchData: FetchData = useCallback(() => {
    return (
      page: number, 
      pageSize: number, 
      replaceReq?: ReplaceReq
    ): FetchDataResult => {
      const req: SysQueryDataReq = {
        tag,
        page,
        pageSize,
        conditions: [],
        orderBys: [],
      };
      const resultNoAwaitAll: Omit<FetchDataResult, "awaitAll"> = 
        sysQueryApi.getData(replaceReq ? replaceReq(req) : req);
      const result = resultNoAwaitAll as FetchDataResult;
      result.awaitAll = result.then(res => 
        res.total.then(total => ({...res, total}))
      );
      return result;
    };
  }, [planForFetch]);

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
