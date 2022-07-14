import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./theme/antd.css";
import "./index.css"
import App from "./App";
import { colorfulConsole, onLog } from "./utils/logger";

onLog(colorfulConsole);

const root = createRoot(document.getElementById("root")!!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
