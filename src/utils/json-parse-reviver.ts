export const javaBeanReviver = (_: unknown, v: unknown) => 
  typeof v === "string" && v.match(/^\d{4}-\d{2}-\d{2}T?\d{2}:\d{2}:\d{2}$/) 
    ? new Date(v)
    : v;
