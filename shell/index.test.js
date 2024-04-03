import * as path from "node:path";
import { Connector, languageTypes } from "./lib/node/index.js";

const connector = new Connector(
  path.join(process.cwd(), "/services"),
  "random-token-1209128"
);

connector.connectToService({
  langType: languageTypes.PHP,
  programPath: "/index.php",
  type: "form-validation",
  data: { email: "marufmunna800@gmail.com" },
  command: "php $?"
})
  .then((data) => console.log(data));

connector.connectToService({
  langType: languageTypes.PHP,
  programPath: "/index.php",
  type: "form-validation-2",
  data: null,
  command: "php $?"
})
  .then((data) => console.log(data));

connector.connectToService({
  langType: languageTypes.NODEJS,
  programPath: "/index.js",
  type: "form-validation",
  data: { email: "marufmunna800@gmail.com" },
  command: "node $?"
})
  .then((data) => console.log(data));

connector.connectToService({
  langType: languageTypes.NODEJS,
  programPath: "/index.js",
  type: "form-validation-2",
  data: null,
  command: "node $?"
})
  .then((data) => console.log(data));
