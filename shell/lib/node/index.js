import * as path from "node:path";
import { exec } from "node:child_process";

export const languageTypes = {
  PHP: "PHP-lang",
  NODEJS: "NODEJS-lang",
  PYTHON: "PYTHON-lang"
};

export const pathTypes = { "relative": "relative", "absolute": "absolute" };

export class Connector {
  #cwd;
  #token;
  constructor(servicesDir, token) {
    this.#cwd = servicesDir;
    this.#token = token;
  }
  static getPath(pathType, args) {
    if (pathType === pathTypes.relative) {
      const currentFilePath = new URL(args.file).pathname;
      const currentFolder = path.dirname(currentFilePath);
      const servicesFolderPath = path.join(currentFolder, ...(args.paths || []));
      const $path = path.resolve(servicesFolderPath);
      return $path;
    } else if (pathType === pathTypes.absolute) {
      return path.join.apply(null, args);
    } else throw new Error("Path type is invalid");
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
      exec(cmd, { cwd: this.#cwd }, (err, stdout, stderr) => {
        const response = err ? ({
          data: null,
          error: "Command execution failed."
        }) : (this.validateRes(stdout, type) ?
          ({
            data: this.parseJSON(stdout)?.data || null,
            error: null
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