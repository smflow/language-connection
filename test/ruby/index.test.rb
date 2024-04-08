require "pathname";
pn = ::Pathname.new(File.expand_path(__FILE__))
dir = pn.dirname
dir = dir.dirname
dir = dir.dirname
require dir + "lib/ruby/index.rb"

path = Connector.get_path("../../services", File.expand_path(__FILE__))

connector = Connector.new(path, "random-token-1209128")

connector.connect_to_service(LANGUAGE_TYPES[:NODEJS], "/js/index.js", "form-validation", { email: "marufmunna800@gmail.com" })

connector.connect_to_service(LANGUAGE_TYPES[:NODEJS], "/js/index.js", "form-validation-2", nil)

connector.connect_to_service(LANGUAGE_TYPES[:PHP], "/php/index.php", "form-validation", { email: "marufmunna800@gmail.com" })

connector.connect_to_service(LANGUAGE_TYPES[:PHP], "/php/index.php", "form-validation-2", nil)

connector.connect_to_service(LANGUAGE_TYPES[:PYTHON], "/python/index.py", "form-validation", { email: "marufmunna800@gmail.com" })

connector.connect_to_service(LANGUAGE_TYPES[:PYTHON], "/python/index.py", "form-validation-2", nil)

connector.connect_to_service(LANGUAGE_TYPES[:RUBY], "/ruby/index.rb", "form-validation", { email: "marufmunna800@gmail.com" })

connector.connect_to_service(LANGUAGE_TYPES[:RUBY], "/ruby/index.rb", "form-validation-2", nil)
