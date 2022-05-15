import { AnyConfig } from './types.js';
/**
 * Finds runtime-configuration file synchronously.
 *
 * ```js
 * import { findConfigSync } from 'rcfy'
 *
 * const rcFile = findConfigSync('myproject', './config')
 * // will finds:
 * // - `.myprojectrc` file in the `./config` directory.
 * // - `.myprojectrc.json` file in the `./config` directory.
 * // - `.myprojectrc.{yaml,yml}` file in the `./config` directory.
 * // - `.myproject.{cjs,js}` file in the `./config` directory.
 * // - `myproject.config.{cjs,js}` file in the `./config` directory.
 * ```
 */
export declare function findConfigSync(name: string, cwd?: string): string | undefined;
/**
 * Loads runtime-configuration file synchronously, with precedence.
 *
 * ```js
 * import { loadConfigSync } from 'rcfy'
 *
 * const rc = loadConfigSync('myproject')
 * // will try to loads config from:
 * // - `myproject` field in the `package.json` file.
 * // - `.myprojectrc` file in the `cwd`.
 * // - `.myprojectrc.json` file in the `cwd`.
 * // - `.myprojectrc.{yaml,yml}` file in the `cwd`.
 * // - `.myproject.{cjs,js}` file in the `cwd`.
 * // - `myproject.config.{cjs,js}` file in the `cwd`.
 * ```
 *
 * **Note:** Config that found in the `package.json` will be merged with
 * higher precedence.
 */
export declare function loadConfigSync(name: string, cwd?: string, ...args: any[]): AnyConfig | Promise<AnyConfig>;
