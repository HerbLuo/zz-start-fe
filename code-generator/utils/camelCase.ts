export function dash_case2camelCase(str: string) {
  return str.replace(/[-_](\w)/g, (match) => match[1].toUpperCase());
}
