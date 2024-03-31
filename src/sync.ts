/* eslint-disable @typescript-eslint/no-explicit-any */
import { resolve } from 'node:path'
import { loadFileSync } from 'loadee'
import { isExistsSync } from './utils.js'

/**
 * Returns config object from `package.json` file, if it exists.
 *
 * @internal
 */
function readPkgSync<T = any>(prop: string, cwd: string): T {
  try {
    return loadFileSync<T>('package.json', cwd)[prop as never]
  } catch {
    return <T>{}
  }
}

/**
 * Finds runtime-configuration file synchronously.
 *
 * ```js
 * import { findRcSync } from 'rcfy'
 *
 * const rcFile = findRcSync('myproject', './config')
 * // will finds:
 * // - `.myprojectrc` file in the `./config` directory.
 * // - `.myprojectrc.json` file in the `./config` directory.
 * // - `.myprojectrc.{yaml,yml}` file in the `./config` directory.
 * // - `.myproject.{cjs,js}` file in the `./config` directory.
 * // - `myproject.config.{cjs,js}` file in the `./config` directory.
 * ```
 */
export function findRcSync(
  name: string,
  cwd = process.cwd()
): string | undefined {
  const paths = [
    `.${name}rc`,
    `.${name}rc.json`,
    `.${name}rc.yaml`,
    `.${name}rc.yml`,
    `.${name}.cjs`,
    `.${name}.js`,
    `${name}.config.cjs`,
    `${name}.config.js`
  ]
    .map(fp => resolve(cwd, fp))
    .filter(fp => isExistsSync(fp))

  return paths[0]
}

/**
 * Loads runtime-configuration file synchronously, with precedence.
 *
 * ```js
 * import { loadRcSync } from 'rcfy'
 *
 * const rc = loadRcSync('myproject')
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
export function loadRcSync<T = any>(
  name: string,
  cwd = process.cwd(),
  ...args: unknown[]
): T | Promise<T> {
  const pkgConfig = readPkgSync<T>(name, cwd)
  const configFile = findRcSync(name, cwd)
  const config = configFile ? loadFileSync(configFile, cwd, ...args) : {}

  if (
    typeof config !== 'object' ||
    (typeof config === 'object' && Array.isArray(config))
  )
    throw new TypeError('Config must be a plain object')

  if (config instanceof Promise) {
    return Promise.resolve(config).then(c => {
      if (typeof c !== 'object' || (typeof c === 'object' && Array.isArray(c)))
        throw new TypeError('Config must be a plain object')

      return { ...c, ...pkgConfig }
    })
  }

  return { ...config, ...pkgConfig }
}
