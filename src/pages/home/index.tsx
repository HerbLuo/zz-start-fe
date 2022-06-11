import { useEffect } from "react";
import { sysSearchPlanApi } from "../../api/sys-search-plan-api";
import { sysAccountApi } from "../../api/sys-account-api";

export default function HomePage() {
  useEffect(() => {
    sysAccountApi.loginByPwd({
      username: "admin",
      password: "123456",
      rememberMe: true
    })
      .then(() => sysSearchPlanApi.getPlan(""))
      .then((d) => {
        console.log(d);
      });
  });

  return <div>home page</div>
}
