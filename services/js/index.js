import { Connector } from "../../lib/node/index.js";

const connector = new Connector(
  process.cwd(),
  "random-token-1209128" // exact
);

const token = process.argv[2]?.replace("--token=", "");
connector.createService("form-validation", token, function (data) {
  return Promise.resolve(["Test-1"]);
});

connector.createService("form-validation-2", token, function (data) {
  throw new Error("Error or message from node");
  return "Test-2";
});