<?php
function d(string $path)
{
  return dirname($path);
}

require_once implode("", [d(d(d(__FILE__))), "/lib/php/index.php"]);

$path = Connector::getPath("../../services", __FILE__);

$connector = new Connector($path, "random-token-1209128");

$res = $connector->connectToService($languageTypes["PHP"], "/php/index.php", "form-validation", ["email" => "marufmunna800@gmail.com"], "php $?");

echo json_encode($res);
echo "\n";

$res_2 = $connector->connectToService($languageTypes["PHP"], "/php/index.php", "form-validation-2", null);

echo json_encode($res_2);
echo "\n";

$nodejs_res = $connector->connectToService($languageTypes["NODEJS"], "/js/index.js", "form-validation", ["email" => "marufmunna800@gmail.com"], "node $?");

echo json_encode($nodejs_res);
echo "\n";

$nodejs_res_2 = $connector->connectToService($languageTypes["NODEJS"], "/js/index.js", "form-validation-2", null, "node $?");

echo json_encode($nodejs_res_2);
echo "\n";

$py_res = $connector->connectToService($languageTypes["PYTHON"], "/python/index.py", "form-validation", ["email" => "marufmunna800@gmail.com"], "python $?");

echo json_encode($py_res);
echo "\n";

$py_res_2 = $connector->connectToService($languageTypes["PYTHON"], "/python/index.py", "form-validation-2", null, "python $?");

echo json_encode($py_res_2);
echo "\n";

$rb_res = $connector->connectToService($languageTypes["RUBY"], "/ruby/index.rb", "form-validation", ["email" => "marufmunna800@gmail.com"], "ruby $?");

echo json_encode($rb_res);
echo "\n";

$rb_res_2 = $connector->connectToService($languageTypes["RUBY"], "/ruby/index.rb", "form-validation-2", null, "ruby $?");

echo json_encode($rb_res_2);
echo "\n";
