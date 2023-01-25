import styles from "./index.module.css";
import { Button, Checkbox, Input } from "antd";
import { useState, useCallback, useEffect } from "react";
import { siteBasePath } from "../../utils/site";
import { useInput } from "../../utils/hooks/dom";
import { sysAccountApi } from "../../api/sys-account-api";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { warnDialog } from "../../utils/notification";
import { useI18n as useI18nGlobal } from "../../i18n/use-i18n";
import { i18n as i18nGlobal } from "../../i18n/core";
import { TippedError } from "../../utils/errors";
import { _logger } from "../../utils/logger";

const LOGGED_IN = "logged_in";

const i18n = i18nGlobal.module("login");
const useI18n = useI18nGlobal.module("login");
const logger = _logger(import.meta.url);

async function forwardToLoggedPage() {
  // await Promise.race([
  //   confirm(i18n("已登陆，{}秒后自动跳转", 1)),
  //   delay(1000),
  // ]);
  const forward_to = new URL(window.location.href).searchParams.get("forward_to");
  window.history.replaceState(null, "", forward_to || (siteBasePath + "/"));
  window.location.reload();
}

function whenLoggedIn() {
  sessionStorage.setItem(LOGGED_IN, "yes");
}

export default function LoginPage() {
  const [username, setUsername] = useInput<string>();
  const [password, setPassword] = useInput<string>();
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  useEffect(() => {
    if (sessionStorage.getItem(LOGGED_IN) === "yes") {
      logger.debug("sessionStorage <", LOGGED_IN, ": yes>");
      forwardToLoggedPage();
    }
  }, [])

  const onRememberMeClick = useCallback((e: CheckboxChangeEvent) => {
    const checked = e.target.checked;
    if (checked) {
      localStorage.setItem("remember_me", "yes");
    } else {
      localStorage.removeItem("remember_me");
    }
    setRememberMe(checked);
  }, []);

  const onLogin = useCallback(async () => {
    if (!username) {
      throw await warnDialog(i18n("用户名不能为空"));
    }
    if (!password) {
      throw await warnDialog(i18n("密码不能为空"));
    }

    await sysAccountApi.loginByPwd({
      username,
      password,
      rememberMe,
    }).catch(async e => {
      if (e !== TippedError) {
        await warnDialog(i18n("登陆失败，尝试联系技术人员。"), e)
      }
      throw e;
    });
    localStorage.setItem("remember_me", "yes");
    whenLoggedIn();
    forwardToLoggedPage();
  }, [username, password, rememberMe]);

  return (
    <div className={styles.page}>
      <div className={styles.login_box}>
        <h1>ZZ CMS Pro Max</h1>
        <Input placeholder={useI18n("用户名")} onChange={setUsername} />
        <Input placeholder={useI18n("密码")} onChange={setPassword} type="password" />
        <Checkbox checked={rememberMe} onChange={onRememberMeClick}>{useI18n("记住我")}</Checkbox>
        <div className={styles.button_group}>
          <Button>{useI18n("注册")}</Button>
          <Button type="primary" onClick={onLogin}>{useI18n("登录")}</Button>
        </div>
      </div>
    </div>
  );
}

