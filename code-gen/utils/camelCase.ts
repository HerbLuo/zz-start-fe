export function dashcase2camelCase(str: string) {
  return str.replace(/[-_](\w)/g, (match) => match[1].toUpperCase());
}
