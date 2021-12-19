import { useEffect, useState } from "react";

type State = "none" | "loading" | "error";

export default function Loading() {
  const [state, setState] = useState<State>("none");

  useEffect(() => {
    const timeoutLoading = setTimeout(() => {
      setState("loading");
    }, 1000);
    const timeoutError = setTimeout(() => {
      setState("error");
    }, 6000);

    return () => {
      clearTimeout(timeoutLoading);
      clearTimeout(timeoutError);
    };
  });

  if (state === "none") {
    return null;
  }
  if (state === "error") {
    return <div>界面加载不出来了，尝试刷新一下。</div>
  }
  return <div>努力加载中</div>;
}
