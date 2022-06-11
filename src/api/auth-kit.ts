import { sysAccountApi } from "./sys-account-api";
const localStorageKeyTokenExpireAt = "token_expire_at";

export async function auth() {
  const tokenExpireAt = localStorage.getItem(localStorageKeyTokenExpireAt);
  if (tokenExpireAt && (new Date().getTime() < Number(tokenExpireAt))) {
    return;
  }
}
