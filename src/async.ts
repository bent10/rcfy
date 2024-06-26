/* eslint-disable @typescript-eslint/no-explicit-any */
import { resolve } from 'node:path'
import { loadFile } from 'loadee'
import { isExists } from './utils.js'

/**
 * Returns config object from `package.json` file, if it exists.
 *
 * @internal
 */
async function readPkg<T = any>(prop: string, cwd: string): Promise<T> {
  try {
    return (await loadFile('package.json', cwd))[prop as never]
  } catch {
    return <T>{}
  }
}

/**
 * Finds runtime-configuration file.
 *
 * ```js
 * import { findRc } from 'rcfy'
 *
 * const rcFile = await findRc('myproject', './config')
 * // will finds:
 * // - `.myprojectrc` file in the `./config` directory.
 * // - `.myprojectrc.json` file in the `./config` directory.
 * // - `.myprojectrc.{yaml,yml}` file in the `./config` directory.
 * // - `.myproject.{mjs,cjs,js}` file in the `./config` directory.
 * // - `myproject.config.{mjs,cjs,js}` file in the `./config` directory.
 * ```
 */
export async function findRc(
  name: string,
  cwd = process.cwd()
): Promise<string | undefined> {
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
  ].map(fp => resolve(cwd, fp))

  // filter out non-existing files
  const matches = await Promise.all(
    paths.map(async p => {
      if (await isExists(p)) {
        return p
      }
    })
    // filter out undefined
  ).then(m => m.filter(Boolean))

  return matches[0]
}

/**
 * Loads runtime-configuration file, with precedence.
 *
 * ```js
 * import { loadRc } from 'rcfy'
 *
 * const rc = await loadRc('myproject')
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
export async function loadRc<T = any>(
  name: string,
  cwd = process.cwd(),
  ...args: unknown[]
): Promise<T> {
  const pkgConfig = await readPkg<T>(name, cwd)
  const configFile = await findRc(name, cwd)
  const config = configFile ? await loadFile(configFile, cwd, ...args) : {}

  if (
    typeof config !== 'object' ||
    (typeof config === 'object' && Array.isArray(config))
  )
    throw new TypeError('Config must be a plain object')

  return { ...config, ...pkgConfig }
}
