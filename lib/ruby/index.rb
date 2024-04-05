require 'pathname'
require "base64"
require "json"
require "open3"

LANGUAGE_TYPES = {
  PHP: "PHP-lang",
  NODEJS: "NODEJS-lang",
  PYTHON: "PYTHON-lang",
  RUBY: "RUBY-lang",
}.freeze

class Connector
  def initialize(services_dir, token)
    @cwd = services_dir
    @token = token
  end

  def self.get_path(_path, file)
    s = _path.to_s
    pn = ::Pathname.new(file)
    real_path = pn.dirname

    while s.start_with?("../") || s.start_with?("./")
      if s.start_with?("../")
        s = s[3..-1]
        real_path = real_path.dirname
      elsif s.start_with?("./")
        s = s[2..-1]
      end
    end

    return File.join(real_path, s)
  end

  def get_lang(lang)
    unless LANGUAGE_TYPES.values.include?(lang)
      raise ArgumentError, "Unsupported language"
    end
  end

  def validator(args, e)
    if args.is_a?(Array)
      unless args.all? { |a| !!a }
        raise ArgumentError, e
      end
    else
      raise  ArgumentError, e unless !!args
    end
  end

  def connect_to_service(lang_type, program_path, type, data, command=nil)
    get_lang(lang_type)
    validator((type.to_s.length > 0), "Validation failed")
    token = generate_token(@token, type, data,)

    executable = case lang_type
                 when LANGUAGE_TYPES[:PHP]
                   command || "php $?"
                 when LANGUAGE_TYPES[:NODEJS]
                   command || "node $?"
                 when LANGUAGE_TYPES[:PYTHON]
                   command || "python $?"
                 when LANGUAGE_TYPES[:RUBY]
                   command || "ruby $?"
                 end

    cmd = executable.to_s.gsub("$?", "#{File.join(@cwd, program_path)} #{token}")

    _cwd = File.dirname(File.join(@cwd, program_path))

    begin
      stdout, stderr, status = Open3.capture3(cmd, chdir: _cwd)
    rescue StandardError => e
      puts e.message + "\n"
    end

    response = if status&.success?
      validate_res(stdout, type) && (stderr == nil || stderr == '') ? {
        data: parse_json(stdout)["data"] || nil,
        error: parse_json(stdout)["error"] || nil
      } : {
        error: stdout || stderr || 'Invalid data sent',
        data: nil
      }
    else
      {
        data: nil,
        error: 'Command execution failed.'
      }
    end


    puts response
  end


  def generate_token(token, type, data=nil)
    encoded_data = Base64.strict_encode64({ data: data, type: type, token: token }.to_json)
    return "--token=#{encoded_data}"
  end


  def validate_res(stdout, type)
    parsed = parse_json(stdout) || {}
    (parsed["token"] == @token && parsed["type"] == type)
  end

  def parse_json(json)
    begin
      return JSON.parse(json)
    rescue JSON::ParserError => error
      return nil
    end
  end

  def decode_token(token, type)
    decoded_token = JSON.parse(Base64.decode64(token))

    return false if decoded_token.nil? || decoded_token["type"] != type || decoded_token["token"] != @token

    decoded_token
  end

  def create_service(type, token, cb = Proc.new {})
  begin
    res = ->(data) { return cb.call(data) }
    begin
      decoded_token = decode_token(token, type)
    rescue JSON::ParserError => e
      return puts e
    end


    return if decoded_token == false

    STDOUT.write({
      token: @token,
      data: res.call(decoded_token[:data]),
      type: type,
      error: nil
    }.to_json)
  rescue StandardError => error
    STDOUT.write({
      token: @token,
      data: nil,
      error: (error.message || "Something went wrong"),
      type: type
    }.to_json)
  end
end
end
