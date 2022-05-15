import { AnyConfig } from './types.js';
/**
 * Finds runtime-configuration file.
 *
 * ```js
 * import { findConfig } from 'rcfy'
 *
 * const rcFile = await findConfig('myproject', './config')
 * // will finds:
 * // - `.myprojectrc` file in the `./config` directory.
 * // - `.myprojectrc.json` file in the `./config` directory.
 * // - `.myprojectrc.{yaml,yml}` file in the `./config` directory.
 * // - `.myproject.{mjs,cjs,js}` file in the `./config` directory.
 * // - `myproject.config.{mjs,cjs,js}` file in the `./config` directory.
 * ```
 */
export declare function findConfig(name: string, cwd?: string): Promise<string | undefined>;
/**
 * Finds runtime-configuration file, with precedence.
 *
 * ```js
 * import { loadConfig } from 'rcfy'
 *
 * const rc = await loadConfig('myproject')
 * // will try to loads config from:
 * // - `myproject` field in the `package.json` file.
 * // - `.myprojectrc` file in the `cwd`.
 * // - `.myprojectrc.json` file in the `cwd`.
 * // - `.myprojectrc.{yaml,yml}` file in the `cwd`.
 * // - `.myproject.{mjs,cjs,js}` file in the `cwd`.
 * // - `myproject.config.{mjs,cjs,js}` file in the `cwd`.
 * ```
 *
 * **Note:** Config that found in the `package.json` will be merged with
 * higher precedence.
 */
export declare function loadConfig(name: string, cwd?: string, ...args: any[]): Promise<AnyConfig>;
