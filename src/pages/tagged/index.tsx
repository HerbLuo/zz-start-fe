import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSpTable } from "../../utils/search-plan/use-sp-table";
import { Mergers } from "../../utils/table/use-columns";

export default function TaggedPage() {
  const tag = useParams<"page">().page as string;

  const columnMergers = useMemo<Mergers<{}>>(() => [
    { title: "操作", fixed: "right" },
  ], []);

  const { el } = useSpTable(tag, { columnMergers });

  return el;
}
