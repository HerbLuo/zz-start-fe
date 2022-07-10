import { useQuery } from "../../utils/query";

export default function HomePage() {
  const { el, fetchData } = useQuery("zi_dian_guan_li");

  console.log("page", typeof fetchData);

  return (
    <div style={{padding: "10px"}}>
      {el}
    </div>
  );
}
