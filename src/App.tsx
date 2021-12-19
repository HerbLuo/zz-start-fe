import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import Loading from "./pages/loading";

function LazyPage({ page }: { page?: string }) {
  const params = useParams();
  const Page = lazy(() => import(`./pages/${page || params.page}/index.tsx`));

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

export default App;
