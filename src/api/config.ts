import { areDebug } from "../utils/env";

export const basePath = areDebug ? "" : "http://10.1.1.12:8880";
