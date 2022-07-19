/**
 * function test() {
 *   trim_margin(`
 *     space will auto remove.
 *     space will auto remove.
 *   `) === "space will auto remove.\nspace will auto remove.";
 * }
 */
export function trim_margin(str: string) {
  const spaces_matched = str.match(/^[\n]*( +)/);
  if (!spaces_matched) {
    return str;
  }
  const spaces = spaces_matched[1];
  return str
    .split("\n")
    .map(line => line.replace(new RegExp(`^${spaces}`), ""))
    .join("\n")
    .trim();
}
