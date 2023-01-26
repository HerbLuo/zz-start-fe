import { ColumnType } from "antd/lib/table";
import { SysSpUsrTblColEntity } from "../../types/SysSpUsrTblColEntity";
import { renderDate, renderText } from "../antd-pro/renders";
import { CouldMerge } from "./use-columns";

// eslint-disable-next-line
const _eval = eval;

export function serverColumnToAntColumn<T>(
  serverColumns: SysSpUsrTblColEntity[]
): CouldMerge<T>[] {
  const sortedServerCols = serverColumns.sort((a, b) => a.sort - b.sort);
  const formattedColumns: ColumnType<T>[] = [];
  for (const column of sortedServerCols) {
    const { 
      render: serverRender, 
      datetimeFormat, 

      title,
      fixed, 
      type, 
      sort, 
      ...others
    } = column;

    if (!title) {
      continue;
    }

    let render: ColumnType<T>["render"] | undefined = undefined;
    if (serverRender) {
      render = (value: unknown) => {
        const k = "_obj_key_for_render_eval";
        (window as any)[k] = value;
        const el = renderText(_eval(`const value=window.${k};${serverRender}`));
        (window as any)[k] = null;
        return el;
      }
    } else if (
      type === "datetime" || type === "date" || type === "time" || 
      type === "year" || type === "month"
    ) {
      render = renderDate(datetimeFormat, type);
    } else {

    }

    formattedColumns.push({
      title,
      ...(fixed ? { fixed: fixed as "left" | "right" } : {}),
      render,
      ...others,
    });
  }
  return formattedColumns;
}
