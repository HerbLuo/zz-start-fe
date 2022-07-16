import { areDebug, areVite } from "../utils/env";

export const basePath = areDebug 
  ? areVite ? "/api-server" : ""
  : "https://api.localhost.cloudself.cn";

export const withCredentials = basePath.startsWith("http") && 
  new URL(basePath).hostname !== window.location.hostname
