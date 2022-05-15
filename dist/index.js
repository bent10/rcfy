var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// src/async.ts
import { resolve } from "node:path";
import { loadFile } from "loadee";

// src/utils.ts
import { promises as fsp, accessSync, constants } from "node:fs";
async function isExists(filepath) {
  try {
    await fsp.access(filepath, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}
function isExistsSync(filepath) {
  try {
    accessSync(filepath, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

// src/async.ts
async function readPkg(prop) {
  try {
    return (await loadFile("package.json"))[prop];
  } catch {
    return;
  }
}
async function findConfig(name, cwd = process.cwd()) {
  const paths = [
    `.${name}rc`,
    `.${name}rc.json`,
    `.${name}rc.yaml`,
    `.${name}rc.yml`,
    `.${name}.mjs`,
    `.${name}.js`,
    `.${name}.cjs`,
    `${name}.config.mjs`,
    `${name}.config.js`,
    `${name}.config.cjs`
  ].map((fp) => resolve(cwd, fp));
  const matches = await Promise.all(paths.map(async (p) => {
    if (await isExists(p)) {
      return p;
    }
  })).then((m) => m.filter(Boolean));
  return matches[0];
}
async function loadConfig(name, cwd = process.cwd(), ...args) {
  const pkgConfig = await readPkg(name);
  const configFile = await findConfig(name, cwd);
  const config = configFile ? await loadFile(configFile, cwd, ...args) : {};
  if (typeof config !== "object" || typeof config === "object" && Array.isArray(config))
    throw new TypeError("Config must be a plain object");
  return __spreadValues(__spreadValues({}, config), pkgConfig);
}

// src/sync.ts
import { resolve as resolve2 } from "node:path";
import { loadFileSync } from "loadee";
function readPkgSync(prop) {
  try {
    return loadFileSync("package.json")[prop];
  } catch {
    return;
  }
}
function findConfigSync(name, cwd = process.cwd()) {
  const paths = [
    `.${name}rc`,
    `.${name}rc.json`,
    `.${name}rc.yaml`,
    `.${name}rc.yml`,
    `.${name}.cjs`,
    `.${name}.js`,
    `${name}.config.cjs`,
    `${name}.config.js`
  ].map((fp) => resolve2(cwd, fp)).filter((fp) => isExistsSync(fp));
  return paths[0];
}
function loadConfigSync(name, cwd = process.cwd(), ...args) {
  const pkgConfig = readPkgSync(name);
  const configFile = findConfigSync(name, cwd);
  let config = configFile ? loadFileSync(configFile, cwd, ...args) : {};
  if (typeof config !== "object" || typeof config === "object" && Array.isArray(config))
    throw new TypeError("Config must be a plain object");
  if (config instanceof Promise) {
    return Promise.resolve(config).then((c) => {
      if (typeof c !== "object" || typeof c === "object" && Array.isArray(c))
        throw new TypeError("Config must be a plain object");
      return __spreadValues(__spreadValues({}, c), pkgConfig);
    });
  }
  return __spreadValues(__spreadValues({}, config), pkgConfig);
}

// src/index.ts
import { loadFile as loadFile2, loadFileSync as loadFileSync2 } from "loadee";
export {
  findConfig,
  findConfigSync,
  loadConfig,
  loadConfigSync,
  loadFile2 as loadFile,
  loadFileSync2 as loadFileSync
};
