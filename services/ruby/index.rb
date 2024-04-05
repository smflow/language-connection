require "../../lib/ruby/index.rb";

connector = Connector.new(Dir.pwd, "random-token-1209128")

token = Connector.get_service_token(ARGV[0])

if token
  cb_1 = ->(data) {
    return {"imp":"data from ruby"}
  }
  connector.create_service("form-validation", token, cb_1)

  cb_2 = ->(data) {
    raise "Error from ruby services"
  }
  connector.create_service("form-validation-2", token, cb_2)

end
