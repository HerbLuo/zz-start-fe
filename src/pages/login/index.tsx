import { Button, Input } from "antd";
import { useEffect } from "react";
import { sysAccountApi } from "../../api/sys-account-api";
import { siteBasePath } from "../../utils/site";

function forward() {
  const forward_to = new URL(window.location.href).searchParams.get("forward_to");
  window.history.replaceState(null, "", forward_to || (siteBasePath + "/"));
  window.location.reload();
}

function whenLoggedIn() {
  sessionStorage.setItem("logged_in", "yes");
}

export default function LoginPage() {
  useEffect(() => {
    localStorage.setItem("remember_me", "yes");

    // sysAccountApi.loginByPwd({
    //   username: "admin",
    //   password: "123456",
    //   rememberMe: true,
    // }).then(() => {
    //   whenLoggedIn();
    //   forward();
    // });
  });


  return (
    <div >
      <Input placeholder="用户名"/>
      <Input placeholder="密码"/>
      <Button>登陆</Button>
    </div>
  );
}

