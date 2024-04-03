import json
import base64
import os

language_types = {
    'PHP': 'PHP-lang',
    'NODEJS': 'NODEJS-lang',
    'PYTHON': 'PYTHON-lang'
}

class Connector():
  def __init__(self, servicesDir, token) -> None:
    self.cwd = servicesDir
    self.token = token

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

      cmd = str(executable).replace("$?", os.path.join(self.cwd, program_path) + " " + token)
      
      return [cmd]
