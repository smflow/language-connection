import { Connector, languageTypes } from "./lib/node/index.js";
const path = Connector.getPath("./services", import.meta.url);

const connector = new Connector(
  path,
  "random-token-1209128"
);

connector.connectToService({
  langType: languageTypes.PHP,
  programPath: "/php/index.php",
  type: "form-validation",
  data: { email: "marufmunna800@gmail.com" },
  command: "php $?"
})
  .then((data) => console.log(data));

connector.connectToService({
  langType: languageTypes.PHP,
  programPath: "/php/index.php",
  type: "form-validation-2",
  data: null,
  command: "php $?"
})
  .then((data) => console.log(data));

connector.connectToService({
  langType: languageTypes.NODEJS,
  programPath: "/js/index.js",
  type: "form-validation",
  data: { email: "marufmunna800@gmail.com" },
  command: "node $?"
})
  .then((data) => console.log(data));

connector.connectToService({
  langType: languageTypes.NODEJS,
  programPath: "/js/index.js",
  type: "form-validation-2",
  data: null,
  command: "node $?"
})
  .then((data) => console.log(data));

connector.connectToService({
  langType: languageTypes.PYTHON,
  programPath: "/python/index.py",
  type: "form-validation",
  data: { email: "marufmunna800@gmail.com" },
  command: "python $?"
})
  .then((data) => console.log(data));

connector.connectToService({
  langType: languageTypes.PYTHON,
  programPath: "/python/index.py",
  type: "form-validation-2",
  data: null,
  command: "python $?"
})
  .then((data) => console.log(data));