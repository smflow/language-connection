import * as path from "node:path";
import { exec } from "node:child_process";

export const languageTypes = {
  PHP: "PHP-lang",
  NODEJS: "NODEJS-lang",
  PYTHON: "PYTHON-lang"
};

export class Connector {
  #cwd;
  #token;
  constructor(servicesDir, token) {
    this.#cwd = servicesDir;
    this.#token = token;
  }
  static getPath(_path, file) {
    let s = _path + "";
    let realPath = path.dirname(new URL(file).pathname);

    while (s.startsWith("../") || s.startsWith("./")) {

      if (s.startsWith("../")) {
        s = s.slice(3);
        realPath = path.dirname(realPath);
      } else if (s.startsWith("./")) {
        s = s.slice(2);
      }

    }

    return path.join(realPath, s);
  }

  getLang(lang) {
    if (Object.values(languageTypes).find(l => l === lang) == null) { throw new Error("Unsupported language"); };
  }
  validator(args, e) {
    if (Array.isArray(args)) {
      if (!args.every((a) => (!!a))) throw new Error(e);
    } else if (!!args) {
      throw new Error(e);
    } else throw new Error(e);
  }
  generateToken({
    type,
    data,
    token
  }) {
    return `--token=${Buffer.from(JSON.stringify({ data, type, token }), "utf8").toString("base64")}`;
  }
  connectToService({ langType, programPath, type, data, command }) {
    this.getLang(langType);
    this.validator([(type + "").length > 0], "Validation failed");
    const token = this.generateToken({
      type,
      data,
      token: this.#token
    });

    let executable;
    switch (langType) {
      case languageTypes.PHP:
        executable = command || "php $?";
        break;
      case languageTypes.NODEJS:
        executable = command || "node $?";
        break;
      case languageTypes.PYTHON:
        executable = command || "python $?";
        break;
    }

    const cmd = (executable + "").replace("$?", `${path.join(this.#cwd, programPath)} ${token}`);

    return new Promise((res, _rej) => {
      const _cwd = path.dirname(path.join(this.#cwd, programPath));
      exec(cmd, { cwd: _cwd }, (err, stdout, stderr) => {
        const response = err ? ({
          data: null,
          error: "Command execution failed."
        }) : (this.validateRes(stdout, type) ?
          ({
            data: this.parseJSON(stdout)?.data || null,
            error: this.parseJSON(stdout)?.error || null
          }) : ({
            error: stdout || stderr || "Invalid data sent",
            data: null
          }));
        res(response);
        if (err?.message != null) return void console.log(err?.message);
        else return;

      });
    });
  }
  validateRes(stdout, type) {
    const parsed = this.parseJSON(stdout) || {};
    return (parsed.token === this.#token && parsed.type === type) ? true : false;
  }
  parseJSON(json) {
    try {
      return JSON.parse(json);
    } catch (error) {
      return null;
    }
  }
  decodeToken(token, type) {
    const t = this.parseJSON(Buffer.from(token, "base64").toString("utf8"));

    if (t == null || t.type !== type || t.token !== this.#token) return false;

    return t;
  }
  async createService(type, token, cb = () => { }) {
    try {

      const res = async (data) => cb(data);
      const decodedToken = this.decodeToken(token, type);

      if (decodedToken === false) return;

      process.stdout.write(JSON.stringify({
        token: this.#token,
        data: await res(decodedToken.data),
        type: type
      }));
    } catch (error) {
      process.stdout.write((error.message ?? null));
    }
  }
}