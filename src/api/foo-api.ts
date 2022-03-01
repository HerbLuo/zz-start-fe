import { post } from "./http";

async function fooUsingPOST(path: undefined, test: [object Object]) {
  return post(`/foo/foo/path/{path}`);
}

export const fooApi = {
  fooUsingPOST
};
