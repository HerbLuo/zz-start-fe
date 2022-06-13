export function stringTemplate(str: string, ...args: any[]): string {
  let times = 0;
  return str.replace(/{}/g, () => args[times++]);
}
