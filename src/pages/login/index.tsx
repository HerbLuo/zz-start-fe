import styles from "./index.module.css";
import { Button, Checkbox, Input } from "antd";
import { useEffect, useState, useCallback } from "react";
import { siteBasePath } from "../../utils/site";
import { useInput } from "../../utils/hooks";
import { sysAccountApi } from "../../api/sys-account-api";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

function forwardToLoggedPage() {
  const forward_to = new URL(window.location.href).searchParams.get("forward_to");
  window.history.replaceState(null, "", forward_to || (siteBasePath + "/"));
  window.location.reload();
}

function whenLoggedIn() {
  sessionStorage.setItem("logged_in", "yes");
}

export default function LoginPage() {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [rememberMe, setRememberMe] = useState<boolean>(true);

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
    await sysAccountApi.loginByPwd({
      username: "admin",
      password: "123456",
      rememberMe,
    });
    localStorage.setItem("remember_me", "yes");
    whenLoggedIn();
    forwardToLoggedPage();
  }, [username, password, rememberMe]);

  return (
    <div className={styles.page}>
      <div className={styles.login_box}>
        <h1>ZZ CMS Pro Max</h1>
        <Input placeholder="用户名" defaultValue={username} onBlur={e => setUsername(e.target.value)}/>
        <Input type="password" placeholder="密码" defaultValue={password} onBlur={e => setPassword(e.target.value)}/>
        <Checkbox checked={rememberMe} onChange={onRememberMeClick}>记住我</Checkbox>
        <div className={styles.button_group}>
          <Button>注册</Button>
          <Button type="primary" onClick={onLogin}>登录</Button>
        </div>
      </div>
    </div>
  );
}

