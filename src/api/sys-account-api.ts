// 自动生成的代码块，首行
// 禁止修改 #HASH<198ac5f1da0494ef4a2532b5ad3b6fd7771b5f0f6d41cf6911d7d381f413b3f5>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。
import { post } from "./http";
import { UsernamePassword } from "../types/UsernamePassword";
import { Token } from "../types/Token";

/** 使用用户名密码登陆 */
async function loginByPwd(body: UsernamePassword): Promise<Token> {
  return await post(`/account/login`, body);
}

/** 使用RememberMeToken登陆 */
async function loginByRememberMeToken(): Promise<boolean> {
  return await post(`/account/login/remember-me-token`);
}

export const sysAccountApi = {
  loginByPwd,
  loginByRememberMeToken,
};
// 自动生成的代码块，尾行
