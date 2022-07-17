import { useQuery } from "../../utils/query";

export default function HomePage() {
  const { el, fetchData } = useQuery("zi_dian_guan_li");

  fetchData();

  return (
    <div style={{padding: "10px"}}>
      {el}
    </div>
  );
}
