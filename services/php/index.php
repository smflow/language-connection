<?php

require_once "../../lib/php/index.php";

$connector = new Connector(
  getcwd(),
  "random-token-1209128" // exact
);

$token = Connector::getServiceToken($argv[1]);

$connector->createService("form-validation", $token, function ($data) {
  return [
    "errors" => [
      "email" => isset($data["email"]) ? (str_ends_with($data["email"], "@gmail.com") ? [
        "status" => true,
        "message" => null
      ] : [
        "status" => false,
        "message" => "Invalid email formate"
      ]) : [
        "status" => false,
        "message" => "Email is required"
      ]
    ]
  ];
});

$connector->createService("form-validation-2", $token, function ($data) {
  throw new Exception("Error or message from php");
});
