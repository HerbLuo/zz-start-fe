import { dashcase2camelCase } from "../utils/camelCase";
import { trim_margin } from "../utils/trim_margin";
import { ZzApiPath } from "./types";

export function apiTemplate(group: string, pathAndInfos: ZzApiPath[]) {
  const apiVariableName = dashcase2camelCase(group);
  const methods = [...new Set(pathAndInfos.map(({ method }) => method))].join(", ");

  return trim_margin(`
    import { ${methods} } from "./http";
${pathAndInfos.map(({method, path, pathConfig}) => {
  const param = pathConfig.parameters
    .sort((p1, p2) => p1.in > p2.in ? -1 : 1)
    .map(({name, required, schema}) => `${name}${required ? "" : "?"}: ${schema}`)
    .join(", ");
  return `
    async function ${pathConfig.operationId}(${param}) {
      return ${method}(\`${path}\`);
    }`
}).join(`
    `)}

    export const ${apiVariableName} = {
      ${pathAndInfos.map(({pathConfig}) => pathConfig.operationId).join(`,
      `)}
    };
  `) + "\n";
};
