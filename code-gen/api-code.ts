import fetch from "node-fetch";
import { SwaggerDoc } from "./types";

const url = "http://127.0.0.1:8880/v2/api-docs";

async function main() {
  const swagger: SwaggerDoc = await fetch(url).then(r => r.json());
  console.log(swagger);
}

main().catch(console.error);
