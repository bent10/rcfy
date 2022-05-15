/**
 * Finds and loads runtime-configuration file for the current project, with precedence.
 *
 * ## Install
 *
 * ```bash
 * npm i rcfy
 * ```
 *
 * ## Usage
 *
 * This package is pure ESM, please read the
 * [esm-package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
 *
 * ```js
 * import { findRc, loadRc } from 'rcfy'
 *
 * const rcFile = await findRc('myproject')
 * // => root/to/project/.myproject.js
 *
 * const rc = await loadRc('myproject')
 * // => { ... }
 * ```
 *
 * <details>
 * <summary>`AnyConfig` interface</summary>
 *
 * ```ts
 * interface AnyConfig {
 *   // eslint-disable-next-line @typescript-eslint/no-explicit-any
 *   [key: string]: any
 * }
 * ```
 *
 * </details>
 *
 * @module
 */

export * from './types.js'
export * from './async.js'
export * from './sync.js'

// expose loadee apis for flexibility
export { loadFile, loadFileSync } from 'loadee'
