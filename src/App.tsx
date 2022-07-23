import "./theme/antd.css";
import "./index.css"
import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import Loading from "./pages/loading";
import zhCN from "antd/es/locale/zh_CN";
import { ConfigProvider } from "antd";
import { currentLang } from "./i18n/core.lang";

function LazyPage({ page }: { page?: string }) {
  const params = useParams();
  /* webpackChunkName: "[request]" */
  const Page = lazy(() => import(
    `./pages/${page || params.page}/index.tsx`
  ));

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
    }
  }, [areZhCN])

  if (!antdLang && !areZhCN) {
    return null;
  }
  return (
    <ConfigProvider locale={areZhCN ? zhCN : antdLang}>
      <App/>
    </ConfigProvider>
  );
}

export default WithI18nApp;
