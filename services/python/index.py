import sys
from os.path import dirname, abspath
from os import getcwd
SCRIPT_DIR = dirname(abspath(__file__))
ROOT_DIR = dirname(dirname(SCRIPT_DIR))
sys.path.append(ROOT_DIR)
from lib.python.main import Connector

def main():
  token=None
  if sys.argv is None:
    return None
  else:
    try:
      if sys.argv[1]:
        token = sys.argv[1].replace("--token=", "")
    except IndexError as _:
      return

  connector = Connector(getcwd(), "random-token-1209128")

  def cb_1(data):
    return {"fields":[{"email":True}]}
  connector.create_service(
    "form-validation",
    token,
    cb_1
  )

  def cb_2(data):
    raise Exception("A error from python code")
  connector.create_service(
    "form-validation-2",
    token,
    cb_2
  )

main()
