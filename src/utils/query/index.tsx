import { useCallback } from "react";
import { sysQueryApi } from "../../api/sys-query-api";
import { useData } from "../hooks/use-data";
import { SysQuery } from "./SysQuery";

export function useQuery(tag: string) {
  const userPlan = useData(sysQueryApi.getPlan, tag);
  const { plans, elements } = userPlan || {};

  const fetchData = useCallback(() => {

  }, []);

  return {
    el: <SysQuery tag={tag} plans={plans} elements={elements}/>,
    fetchData,
  }
};
