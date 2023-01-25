import { areDebug, areVite } from "../utils/env";

export const basePath = areDebug 
  ? areVite ? "/api-server" : ""
  : new URL(window.location.href).protocol + "//api.localhost.cloudself.cn";

export const withCredentials = basePath.startsWith("http") && 
  new URL(basePath).hostname !== window.location.hostname
