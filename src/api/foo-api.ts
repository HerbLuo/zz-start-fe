import { post } from "./http";

async function fooUsingPOST(test: [object Object]) {
  return post(`/foo/foo`);
}

export const fooApi = {
  fooUsingPOST
};
