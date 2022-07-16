export const areVite: boolean = !!((import.meta as any).env?.MODE);

export const areDebug: boolean = areVite
  ? import.meta.env.PROD !== true
  : process.env.NODE_ENV !== "production";
