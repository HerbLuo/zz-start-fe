import { CSSProperties } from "react";
import {createStyle} from "../create-style";

export const styles = createStyle({
  userPlans: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
  },
  userPlanLabel: {
    height: "32px",
    lineHeight: "32px",
  },
  planButton: {
    border: 0,
    width: "100%",
    height: "100%",
    padding: "0 10px",
    backgroundColor: "#FFFFFF00",
    cursor: "pointer",
  },
  userPlan: (current: boolean) => ({
    border: current ? undefined : "1px solid #c9c9c9",
    marginRight: "8px",
    minWidth: "68px",
    height: "32px",
    fontSize: "12px",
    borderRadius: "2px",
    color: current ? "#FFF" : "#333",
    backgroundColor: current ? "#007ACC" : "#FFF",
    position: "relative",
  }),
  deleteIcon: {
    position: "absolute",
    right: "-12px",
    zIndex: 9999,

    top: "-12px",
    borderRadius: "12px",
    fontSize: "24px",
    color: "#FFF",
    backgroundColor: "#2e8ded",
  } as CSSProperties,
  point: {
    position: "absolute",
    right: "-3px",
    top: "-3px",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#333",
  } as CSSProperties,
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
