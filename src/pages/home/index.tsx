import { useQuery } from "../../utils/query";
import { logger } from "../../utils/logger";

export default function HomePage() {
  const { el, fetchData } = useQuery("zi_dian_guan_li");

  fetchData(1, 10).then(d => logger.await.info(d));

  return (
    <div style={{padding: "10px", opacity: 0.05}}>
      {el}
    </div>
  );
}
