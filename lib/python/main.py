import json
import base64
import os
import subprocess

language_types = {
    'PHP': 'PHP-lang',
    'NODEJS': 'NODEJS-lang',
    'PYTHON': 'PYTHON-lang',
    'RUBY': 'RUBY-lang'
}

class Connector():
  def __init__(self, servicesDir, token) -> None:
    self.cwd = servicesDir
    self.token = token

  @staticmethod
  def get_service_token(argv):
    token=None
    if argv is None:
      return None
    else:
      try:
        if argv[1]:
          token = argv[1].replace("--token=", "")
      except IndexError as _:
        return None
    return token

  @staticmethod
  def get_path(_path, file) -> str:
    s = str(_path)
    real_path = os.path.dirname(os.path.abspath(file))

    while s.startswith("../") or s.startswith("./"):
        if s.startswith("../"):
            s = s[3:]
            real_path = os.path.dirname(real_path)
        elif s.startswith("./"):
            s = s[2:]

    return os.path.abspath(os.path.join(real_path, s))

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
      elif lang_type == language_types["RUBY"]:
          executable = command or "ruby $?"

      cmd = str(executable).replace("$?", os.path.abspath(self.cwd+ program_path) + f" {token}")

      _path = os.path.dirname(os.path.abspath("".join([self.cwd, program_path])))
      output = subprocess.run(cmd, shell=True, capture_output=True, text=True,cwd=_path)

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
        "error": str(error or "Something want wrong"),
        "type": type
      }), end="")