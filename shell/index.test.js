import { dirname, join, resolve } from 'path';
import { Connector, languageTypes } from "./lib/node/index.js";

const currentFilePath = new URL(import.meta.url).pathname;
const currentFolder = dirname(currentFilePath);
const servicesFolderPath = join(currentFolder, 'services');
const path = resolve(servicesFolderPath);

const connector = new Connector(
  path,
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

connector.connectToService({
  langType: languageTypes.PYTHON,
  programPath: "/index.py",
  type: "form-validation",
  data: { email: "marufmunna800@gmail.com" },
  command: "python $?"
})
  .then((data) => console.log(data));

connector.connectToService({
  langType: languageTypes.PYTHON,
  programPath: "/index.py",
  type: "form-validation-2",
  data: null,
  command: "python $?"
})
  .then((data) => console.log(data));