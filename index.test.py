from lib.python.main import Connector, language_types

path = Connector.get_path("./services", __file__)

connector = Connector(
  path,
  "random-token-1209128"
)

res_1 = connector.connect_to_service(language_types["NODEJS"], "/js/index.js", "form-validation", {"email":"marufmunna800@gmail.com"}, "node $?")

print(res_1)

res_2 = connector.connect_to_service(language_types["NODEJS"], "/js/index.js", "form-validation-2", None, "node $?")

print(res_2)

res_3 = connector.connect_to_service(language_types["PHP"], "/php/index.php", "form-validation", {"email":"marufmunna800@gmail.com"}, "php $?")

print(res_3)

res_4 = connector.connect_to_service(language_types["PHP"], "/php/index.php", "form-validation-2", None, "php $?")

print(res_4)

res_5 = connector.connect_to_service(language_types["PYTHON"], "/python/index.py", "form-validation", {"email":"marufmunna800@gmail.com"}, "python $?")

print(res_5)

res_6 = connector.connect_to_service(language_types["PYTHON"], "/python/index.py", "form-validation-2", None, "python $?")

print(res_6)