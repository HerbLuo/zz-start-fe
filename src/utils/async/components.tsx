import { createAsync } from "./create-async";

/**
 * <span children={Promise.resolve("resolved text")}/>
 */
export const AsyncText = createAsync("span", ["children"]);
