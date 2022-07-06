import vm from 'node:vm'
import { resolve, extname } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { promises as fsp, type PathLike } from 'node:fs'
import jsyaml from 'js-yaml'

interface PlainObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type fnLike = (...args: any[]) => any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DefaultModule = any | fnLike
type Module = {
  default?: DefaultModule
  module?: DefaultModule
}

/**
 * Turn a PathLike into a `path` string.
 */
function pathLikeToPath(pathlike: PathLike, cwd: string): string {
  if (Buffer.isBuffer(pathlike)) pathlike = String(pathlike)

  if (typeof pathlike === 'string') {
    return isFileUrlLike(pathlike)
      ? fileURLToPath(pathlike)
      : resolve(cwd, pathlike)
  }

  return fileURLToPath(pathlike)
}

/**
 * Returns true if the given `pathlike` is a file URL like.
 */
function isFileUrlLike(pathlike: string): boolean {
  return pathlike.startsWith('file:') || pathlike.startsWith('data:')
}

/**
 * Returns `true` if the given `value` is a promise.
 */
function isPromise(value: unknown): boolean {
  return (
    !!value &&
    (typeof value === 'object' || typeof value === 'function') &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (value as any).then === 'function'
  )
}

/**
 * Loads YAML file and returns the parsed object.
 *
 * ```js
 * const obj = await fromYaml('.config.yaml')
 * // => { ... }
 * ```
 */
async function fromYAML(filepath: string): Promise<PlainObject> {
  try {
    return <PlainObject>jsyaml.load(await fsp.readFile(filepath, 'utf8'))
  } catch (error) {
    throw error
  }
}

/**
 * Loads JSON file and returns the parsed object.
 *
 * ```js
 * const obj = await fromJSON('.config.json')
 * // => { ... }
 * ```
 */
async function fromJSON(filepath: string): Promise<PlainObject> {
  try {
    return JSON.parse(await fsp.readFile(filepath, 'utf8'))
  } catch (error) {
    throw error
  }
}

function isCjs(code: string): boolean {
  return /exports.module/.test(code)
}

function isEsm(code: string): boolean {
  return /export default/.test(code)
}

/**
 * Loads JS file and returns the `default` exported value.
 *
 * ```js
 * const module = await fromJS('.config.js')
 * // => can be a function, object, string, number, etc.
 * ```
 */
async function fromJS(filepath: string): Promise<Function> {
  try {
    const ext = extname(filepath)
    // const url = pathToFileURL(filepath).toString()
    const content = await fsp.readFile(filepath, 'utf8')
    const namespace = isCjs(content)
      ? 'module'
      : isEsm(content)
      ? 'default'
      : 'foo'

    const code = content
      .replace('export default', 'return')
      .replace('exports.module =', 'return')
    // @ts-ignore
    const _module = new vm.SyntheticModule([namespace], () => {
      _module.setExport(namespace, vm.compileFunction(code, ['foo']))
    })
    await _module.link(() => {})
    await _module.evaluate()

    // const _module: Module = await import(url)
    if (
      (/^\.(m?js)$/.test(ext) && !('default' in _module.namespace)) ||
      (/^\.(cjs)$/.test(ext) && !('module' in _module.namespace))
    ) {
      throw new SyntaxError(
        'Expected module file to be exported as default export'
      )
    }

    return _module.namespace[namespace]()
  } catch (error) {
    throw error
  }
}

/**
 * Resolves data from `yaml`, `json`, or `js` files.
 *
 * The `js` module will be normalize to either a plain object, string, number,
 * boolean, null or undefined.
 *
 * ```js
 * import { loadFile } from 'loadee'
 *
 * const fromJson = await loadFile('data.json')
 * // => { ... }
 * const fromYaml = await loadFile('data.yaml')
 * // => { ... }
 * const fromJs = await loadFile('data.js')
 * // => { ... } or unknown
 * const fromCjs = await loadFile('data.cjs')
 * // => { ... } or unknown
 * ```
 */
export async function loadFile(
  pathlike: PathLike,
  cwd: string = process.cwd(),
  ...args: unknown[]
): Promise<PlainObject | unknown> {
  const filepath = pathLikeToPath(pathlike, cwd)

  switch (extname(filepath)) {
    case '.yml':
    case '.yaml':
      return await fromYAML(filepath)
    case '.json':
    case '':
      return await fromJSON(filepath)
    case '.js':
    case '.cjs':
    case '.mjs':
      const mod = await fromJS(filepath)

      // handle promise, if any
      if (isPromise(mod)) {
        try {
          return await mod(...args)
        } catch {
          return await mod
        }
      } else {
        return typeof mod === 'function' ? mod(...args) : mod
      }
    default:
      throw new TypeError(
        `Failed to resolve ${filepath}, the file is not supported`
      )
  }
}
