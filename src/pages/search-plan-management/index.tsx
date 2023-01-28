import { useMemo } from "react";
import { useSpTable } from "../../utils/search-plan/use-sp-table";
import { Mergers } from "../../utils/table/use-columns";

export default function TaggedPage() {
  const columnMergers = useMemo<Mergers<{}>>(() => [
    { title: "操作", fixed: "right" },
  ], []);

  const { el } = useSpTable("yong_hu_guan_li", { columnMergers });

  return el;
}

