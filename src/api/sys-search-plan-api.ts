import { post, get } from "./http";

async function getDataUsingPOST(query: [object Object]) {
  return post(`/search-plan/query`);
}

async function getPlanUsingGET(planName: undefined) {
  return get(`/search-plan/{planName}`);
}

export const sysSearchPlanApi = {
  getDataUsingPOST,
  getPlanUsingGET
};
