import os

from lib.python.main import Connector, language_types

path = os.path.join(os.getcwd(), "services")

connector = Connector(
  path,
  "random-token-1209128"
)

res = connector.connect_to_service(language_types["PHP"], "index.php", "form-validation", {"email":"marufmunna800@gmail.com"}, "php $?")

print(res)