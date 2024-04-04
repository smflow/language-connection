import json
import base64
import os
import subprocess

language_types = {
    'PHP': 'PHP-lang',
    'NODEJS': 'NODEJS-lang',
    'PYTHON': 'PYTHON-lang'
}

path_types = {
  "relative":"relative",
  "absolute":"absolute"
}

class Connector():
  def __init__(self, servicesDir, token) -> None:
    self.cwd = servicesDir
    self.token = token

  @staticmethod
  def getPath(pathType, args):
    if pathType == path_types["relative"]:
      return os.path.abspath(os.path.dirname(os.path.abspath(args["file"])) + "".join(args.get("paths", [])));
    elif pathType == path_types["absolute"]:
      return os.path.abspath("".join(args or []));
    else:
      raise ValueError("Path type is invalid");

  def get_lang(self, lang: str):
    if lang not in language_types.values():
        raise ValueError("Unsupported language")

  def validator(self, args: list | str, e: str):
    if isinstance(args, list):
        if not all(args):
            raise ValueError(e)
    elif args:
       pass
    else:
        raise ValueError(e)

  def generate_token(self, type: str, data: str, token: str):
    encoded_data = json.dumps({ "data": data, "type": type, "token": token }).encode("utf8")

    token_base64 = base64.b64encode(encoded_data).decode('utf-8')

    return f'--token={token_base64}'

  def validate_res(self, stdout, type):
    parsed = self.parse_json(stdout) or {}

    if isinstance(parsed, dict) == False:
      return False

    return (parsed.get('token', None) == self.token and parsed.get('type', None) == type)


  def connect_to_service(self, lang_type, program_path, type, data, command=None):
      self.get_lang(lang_type)
      self.validator(len(str(type)) > 0, "Validation failed")
      token = self.generate_token(type, data, self.token)
      
      executable = None
      if lang_type == language_types['PHP']:
          executable = command or "php $?"
      elif lang_type == language_types["NODEJS"]:
          executable = command or "node $?"
      elif lang_type == language_types["PYTHON"]:
          executable = command or "python $?"

      cmd = str(executable).replace("$?", os.path.abspath(self.cwd+ program_path) + f" {token}")

      output = subprocess.run(cmd, shell=True, capture_output=True, text=True,cwd=self.cwd)

      if output.returncode == 0:
        res_data = None
        res_error = None
        if self.validate_res(output.stdout, type):
          parsed = self.parse_json(output.stdout) or {}
          if isinstance(parsed, dict):
            res_data = parsed.get("data", None)
            res_error = parsed.get("error", None)
        else:
          res_data = None
          res_error = None
          
          res_error = output.stdout or output.stderr or "Invalid data sent"

        return {
          "data": res_data,
          "error": res_error
        }
      else:
        error = output.stderr;
        while error.endswith("\n"):
          error = error[:-1];
        print(error)
        return {
          "data": None,
          "error": "Command execution failed."
        }
  def parse_json(self, text: str):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return None
    
  def decode_token(self, token: str, type: str):
    t = json.loads(base64.b64decode(token).decode("utf-8"))


    if isinstance(t, dict):
        if (t.get("type", None) != type or t.get("token", None) != self.token):
          return False
    else:
      return False


    return t

  def create_service(self, type, token, cb=lambda data: None):
    def res(data):
      return cb(data)

    decoded_token = self.decode_token(token, type)

    if decoded_token is False:
      return

    try:
      print(json.dumps({
        "token": self.token,
        "data": res(decoded_token['data']),
        "error": None,
        "type": type
      }), end="")
    except Exception as error:
      print(json.dumps({
        "token": self.token,
        "data": None,
        "error": str(error),
        "type": type
      }), end="")