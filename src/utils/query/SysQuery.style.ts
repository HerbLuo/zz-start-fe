import { createStyle } from "../create-style";

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
  planButton: (active: boolean, editing: boolean, editable: boolean) => ({
    minWidth: "68px",
    height: "32px",
    ...((editing && editable) ? { cursor: "text" } : {}),
    ...((editing ? !editable : active) ? { pointerEvents: "none" } : {}),
  }),
  planButtonText: (active: boolean) => ({
    background: "#0000",
    padding: 0,
    border: 0,
    margin: 0,
    ...(active ? { color: "#FFF" } : {})
  }),
  deleteIcon: {
    position: "absolute",
    top: "-15px",
    right: "-15px",
    zIndex: 9999,

    padding: "6px",
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
  },
  filtersLabel: {
    padding: "4px 0",
  },
  filterConditions: (more: boolean) => ({
    overflow: more ? undefined : "hidden",
    height: more ? undefined : "36px",
  }),
  showMore: {
    marginLeft: "40px",
  },
  showMoreIcon: (more: boolean) => ({
    transformOrigin: "50% 40%",
    transform: more ? "rotate(180deg)" : undefined,
    transition: "all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s",
  }),
  createItem: {
    marginLeft: "8px",
  },
  query: {
    marginLeft: "8px",
  },
  marginRight8: {
    marginRight: "8px",
  },
  quickFilter: {
    display: "flex",
  },
  filter: {
    position: "relative",
    display: "flex",
    marginBottom: "10px",
  },
  deleteItem: {
    position: "absolute",
    right: "-22px",
    top: 0,
    color: "#fff",
    borderColor: "#ff4d4f",
    backgroundColor: "#ff4d4f",
  },
});
