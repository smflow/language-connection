<?php

require_once implode("", [dirname(__FILE__), "/lib/php/index.php"]);

$path = Connector::getPath($path_types["relative"], [
  "paths" => ["/services"],
  "file" => __FILE__
]);

$connector = new Connector($path, "random-token-1209128");

$res = $connector->connectToService($languageTypes["PHP"], "/index.php", "form-validation", ["email" => "marufmunna800@gmail.com"], "php $?");

echo json_encode($res);
echo "\n";

$res_2 = $connector->connectToService($languageTypes["PHP"], "/index.php", "form-validation-2", null);

echo json_encode($res_2);
echo "\n";

$nodejs_res = $connector->connectToService($languageTypes["NODEJS"], "/index.js", "form-validation", ["email" => "marufmunna800@gmail.com"], "node $?");

echo json_encode($nodejs_res);
echo "\n";

$nodejs_res_2 = $connector->connectToService($languageTypes["NODEJS"], "/index.js", "form-validation-2", null, "node $?");

echo json_encode($nodejs_res_2);
echo "\n";

$py_res = $connector->connectToService($languageTypes["PYTHON"], "/index.py", "form-validation", ["email" => "marufmunna800@gmail.com"], "python $?");

echo json_encode($py_res);
echo "\n";

$py_res_2 = $connector->connectToService($languageTypes["PYTHON"], "/index.py", "form-validation-2", null, "python $?");

echo json_encode($py_res_2);
echo "\n";
