// 自动生成的代码块，首行
// 禁止修改 #HASH<772f54590cfe6fbfe04c17f37b257c5bb26254669ba96539a8e6411db30c3cb4>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。
import { basePath } from "./config";
import { post, RequestOptions } from "./http";
import { UsernamePassword } from "../types/UsernamePassword";
import { Token } from "../types/Token";

/** 使用用户名密码登陆 */
async function loginByPwd(body: UsernamePassword, options?: RequestOptions): Promise<Token> {
  return await post(`${basePath}/account/login`, body, options);
}

/** 使用RememberMeToken登陆 */
async function loginByRememberMeToken(options?: RequestOptions): Promise<boolean> {
  return await post(`${basePath}/account/login/remember-me-token`, undefined, options);
}

export const sysAccountApi = {
  loginByPwd,
  loginByRememberMeToken,
};
// 自动生成的代码块，尾行
