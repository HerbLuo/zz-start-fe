import { post } from "./http";

async function loginByPwdUsingPOST(login: [object Object]) {
  return post(`/account/login`);
}

export const sysAccountApi = {
  loginByPwdUsingPOST
};
