import { useQuery } from "../../utils/query";

export default function HomePage() {
  const { el, fetchData } = useQuery("zi_dian_guan_li");

  return (
    <div>
      {el}
    </div>
  );
}
