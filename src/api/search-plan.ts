import { basePath } from "./config";
import { post } from "./http";

const urlPathPrefix = basePath + "/search-plan"

async function query() {
  return post(`${urlPathPrefix}/query`);
}

export const searchPlanApi = {
  query,
};
