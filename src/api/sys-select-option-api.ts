import { get } from "./http";

async function getByTableLabelValueUsingGET(label: undefined, table: undefined, value: undefined) {
  return get(`/select-option/table/{table}/label/{label}/value/{value}`);
}

async function getByKeyUsingGET(key: undefined) {
  return get(`/select-option/{key}`);
}

export const sysSelectOptionApi = {
  getByTableLabelValueUsingGET,
  getByKeyUsingGET
};
