import { useMemo } from "react";

export function QueryPro() {
  return (
    <div></div>
  );
}

export function useQueryPro() {
  const fetchData = useMemo(() => {

  }, []);

  return {
    el: <QueryPro/>,
    fetchData,
  };
}
