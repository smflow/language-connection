<?php

$languageTypes = [
  "PHP" => "PHP-lang",
  "NODEJS" => "NODEJS-lang",
  "PYTHON" => "PYTHON-lang"
];

function path_join(array $paths)
{
  return implode("", $paths);
}

class Connector
{
  private $cwd;
  private $token;

  function __construct($servicesDir, $token)
  {
    $this->cwd = $servicesDir;
    $this->token = $token;
  }
  protected function getLang($lang)
  {
    global $languageTypes;
    $lang;
    $found = in_array($lang, array_values($languageTypes));
    if (!$found) throw new Exception("Unsupported language");
  }
  protected function validator($args, $e)
  {
    if (is_array($args)) {
      foreach ($args as $a) {
        if (!$a) {
          throw new Exception($e);
        }
      }
    } elseif (!$args) {
      throw new Exception($e);
    }
  }
  protected function generateToken($params)
  {
    $type = $params['type'];
    $data = $params['data'];
    $token = $params['token'];

    $tokenString = json_encode(['data' => $data, 'type' => $type, 'token' => $token]);
    $encodedData = base64_encode($tokenString);

    return "--token={$encodedData}";
  }
  public function connectToService($langType, $programPath, $type, $data, $command = null)
  {
    try {
      global $languageTypes;
      $this->getLang($langType);
      $this->validator([(string)$type], "Validation failed");
      $token = $this->generateToken([
        "type" => $type,
        "data" => $data,
        "token" => $this->token
      ]);

      $executable = "";
      switch ($langType) {
        case $languageTypes["PHP"]:
          $executable = $command ?? "php $?";
          break;
        case $languageTypes["NODEJS"]:
          $executable = $command ?? "node $?";
          break;
        case $languageTypes["PYTHON"]:
          $executable = $command ?? "python $?";
          break;
      }

      $cmd = "cd $this->cwd && " . str_replace("$?", path_join([$this->cwd, $programPath]) . " $token", $executable);

      $output = `$cmd`;
      // or -> $output = shell_exec($cmd);

      $res_error = null;
      $res_data = null;

      if ($this->validateRes($output, $type)) {
        $parsed = $this->parseJSON($output);
        $res_data = isset($parsed["data"]) ? $parsed["data"] : null;
        $res_error = isset($parsed["error"]) ? $parsed["error"] : null;
      } else {
        $res_error = $output ?? "Command execution failed.";
      }

      return [
        "data" => $res_data,
        "error" => $res_error
      ];
    } catch (\Exception $error) {
      return [
        "data" => null, "error" => $error->getMessage()
      ];
    }
  }
  protected function validateRes($stdout, $type)
  {
    $parsed = $this->parseJSON($stdout) ?: [];
    $token = isset($parsed['token']) ? $parsed['token'] : null;
    $type = isset($parsed['type']) ? $parsed['type'] : null;

    return ($token === $this->token && $type === $type);
  }
  protected function parseJSON($json)
  {
    try {
      return json_decode($json, true);
    } catch (Exception $error) {
      return null;
    }
  }
  protected function decodeToken($token, $type)
  {
    $decodedToken = $this->parseJSON(base64_decode($token, true));

    if (
      $decodedToken != null &&
      isset($decodedToken["type"]) &&
      $decodedToken["type"] === $type &&
      isset($decodedToken["token"]) &&
      $decodedToken["token"] === $this->token
    ) {
      return $decodedToken;
    }

    return false;
  }
  public function createService($type, $token, $cb = null)
  {
    try {
      if ($cb === null) {
        $cb = function ($data) {
          return null;
        };
      }

      $decodedToken = $this->decodeToken($token, $type);

      if ($decodedToken === false) {
        return;
      }

      echo json_encode([
        'token' => $this->token,
        'data' => call_user_func($cb, $decodedToken["data"] ?? null),
        'type' => $type,
      ]);
    } catch (\Exception $error) {
      echo $error->getMessage();
    }
  }
}
