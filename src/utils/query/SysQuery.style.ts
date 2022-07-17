import { CSSProperties } from "react";
import {createStyle} from "../create-style";

export const styles = createStyle({
  sysQuery: {
    background: "#FFF",
    padding: "18px",
  },
  userPlans: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
  },
  userPlanLabel: {
    height: "32px",
    lineHeight: "32px",
  },
  planButtonBox: {
    marginRight: "8px",
    position: "relative",
  },
  planButton: (active: boolean, editing: boolean) => ({
    minWidth: "68px",
    height: "32px",
    ...(editing ? { cursor: "text" } : {}),
    ...(active ? { pointerEvents: "none" } : {}),
  }),
  deleteIcon: {
    position: "absolute",
    top: "-16px",
    right: "-16px",
    zIndex: 9999,

    padding: "7px",
    fontSize: "18px",
  },
  point: {
    position: "absolute",
    right: "-3px",
    top: "-3px",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#333",
  },
  filters: {
    display: "flex",
    marginBottom: "12px",
  } as CSSProperties,
  filtersLabel: {
    padding: "4px 0",
  } as CSSProperties,
  filterConditions: (more: boolean) => ({
    overflow: more ? undefined : "hidden",
    height: more ? undefined : "36px",
  } as CSSProperties),
  showMore: {
    marginLeft: "40px",
  } as CSSProperties,
  showMoreIcon: (more: boolean) => ({
    transformOrigin: "50% 40%",
    transform: more ? "rotate(180deg)" : undefined,
    transition: "all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s",
  } as CSSProperties),
  createItem: {
    marginLeft: "8px",
    // color: "white",
    // borderColor: "#33ab9f",
    // backgroundColor: "#33ab9f",
  } as CSSProperties,
  query: {
    marginLeft: "8px",
    // color: "white",
    // borderColor: "#33ab9f",
    // backgroundColor: "#33ab9f",
  } as CSSProperties,
});
