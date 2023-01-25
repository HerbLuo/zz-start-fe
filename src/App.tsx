import "./index.css"
import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import Loading from "./pages/loading";
import zhCN from "antd/es/locale/zh_CN";
import dayjs from 'dayjs';
import { ConfigProvider } from "antd";
import { currentLang } from "./i18n/core.lang";
import { logger } from "./utils/logger";
import { zzTheme } from "./theme/zz-theme";

function LazyPage({ page }: { page?: string }) {
  const params = useParams();
  /* webpackChunkName: "[request]" */
  const Page = lazy(() => import(
    `./pages/${page || params.page}/index.tsx`
  ).catch(e => {
    logger.warn(e);
    return import("./pages/tagged/index");
  }));

  return (
    <Suspense fallback={<Loading/>}>
      <Page/>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/:page" element={<LazyPage/>}/>
          <Route path="/" element={<LazyPage page="home"/>}/>
          <Route path="*" element={<LazyPage page="not-found"/>}/>
        </Routes>
    </BrowserRouter>
  );
}

function WithI18nApp() {
  const areZhCN = currentLang === "zh_CN";
  const [antdLang, setAntdLang] = useState<typeof zhCN>();

  useEffect(() => {
    if (!areZhCN) {
      import(`../node_modules/antd/es/locale/${currentLang}.js`).then(m => {
        setAntdLang(m);
      });
    } else {
      dayjs.locale('zh-cn');
    }
  }, [areZhCN])

  if (!antdLang && !areZhCN) {
    return null;
  }
  return (
    <ConfigProvider locale={areZhCN ? zhCN : antdLang} theme={zzTheme}>
      <App/>
    </ConfigProvider>
  );
}

export default WithI18nApp;
