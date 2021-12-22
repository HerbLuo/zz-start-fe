import { useEffect } from "react";
import { searchPlanApi } from "../../api/search-plan"

export default function HomePage() {
  useEffect(() => {
    searchPlanApi.query().then((d) => {
      console.log(d);
    });
  });

  return <div>home page</div>
}
