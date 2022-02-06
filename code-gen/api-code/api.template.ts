import { dashcase2camelCase } from "../utils/camelCase";
import { trim_margin } from "../utils/trim_margin";
import { ApiPathWithInfo } from "./types";

export function apiTemplate(group: string, pathAndInfos: ApiPathWithInfo[]) {
  const apiVariableName = dashcase2camelCase(group);
  const methods = [...new Set(pathAndInfos.map(({ method }) => method))].join(", ");

  return trim_margin(`
    import { ${methods} } from "./http";
${pathAndInfos.map(({method, path, info}) => {
  const param = info.parameters
    .sort((p1, p2) => p1.in > p2.in ? 1 : -1)
    .map(({name, required, schema}) => `${name}${required ? "" : "?"}: ${schema}`)
    .join(", ");
  return `
    async function ${info.operationId}(${param}) {
      return ${method}(\`${path}\`);
    }`
}).join(`
    `)}

    export const ${apiVariableName} = {
      ${pathAndInfos.map(({info}) => info.operationId).join(`,
      `)}
    };
  `) + "\n";
};
