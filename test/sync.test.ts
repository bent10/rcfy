import { resolve } from 'node:path'
import { findRcSync, loadRcSync } from '../src/index.js'
import { fooRcData, Foo, context } from './utils.js'

beforeEach(() => {
  // this is resolves the error (on ci) below for wtf reason.
  // ReferenceError: You are trying to `import` a file after the Jest environment has been torn down.
  vitest.useFakeTimers()
})

describe('#findRc()', () => {
  it('found rc file', () => {
    const rcFile = findRcSync('foo', 'test/fixtures')

    expect(rcFile).toBe(resolve(process.cwd(), 'test/fixtures/foo.config.cjs'))
  })

  it('should not looks for package.json', () => {
    // as we have `foo` field in package.json
    const rcFile = findRcSync('foo')

    expect(rcFile).toBeUndefined()
  })

  it('returns undefined if no rc files', () => {
    const rcFile = findRcSync('bar')

    expect(rcFile).toBeUndefined()
  })

  test('allows custom cwd', () => {
    const rcFile = findRcSync('foo', context.p1)

    expect(rcFile).toBe(resolve(context.p1, '.foorc'))
  })

  it('should find with precedence', () => {
    const p1 = findRcSync('foo', context.p1)
    const p2 = findRcSync('foo', context.p2)
    const p3 = findRcSync('foo', context.p3)
    const p4 = findRcSync('foo', context.p4)
    const p5 = findRcSync('foo', context.p5)
    const p6 = findRcSync('foo', context.p6)
    const p7 = findRcSync('foo', context.p7)
    const p8 = findRcSync('foo', context.p8)
    const p9 = findRcSync('foo', context.p9)
    const pRoot = findRcSync('foo', 'test/fixtures')

    expect(p1).toBe(resolve(context.p1, '.foorc'))
    expect(p2).toBe(resolve(context.p2, '.foorc.json'))
    expect(p3).toBe(resolve(context.p3, '.foorc.yaml'))
    expect(p4).toBe(resolve(context.p4, '.foorc.yml'))
    expect(p5).toBe(resolve(context.p5, '.foo.cjs'))
    expect(p6).toBe(resolve(context.p6, '.foo.cjs'))
    expect(p7).toBe(resolve(context.p7, '.foo.js'))
    expect(p8).toBe(resolve(context.p8, 'foo.config.cjs'))
    expect(p9).toBe(resolve(context.p9, 'foo.config.cjs'))
    expect(pRoot).toBe(resolve('test/fixtures', 'foo.config.cjs'))
  })
})

describe('#loadRc()', () => {
  it('from package.json', () => {
    const rc = loadRcSync('eslintConfig')

    expect(rc).toEqual({ extends: './node_modules/doogu/eslint' })
  })

  it('dont throws missing package.json', () => {
    const rc = loadRcSync('foo', 'test/fixtures')

    expect(rc).toEqual({
      bar: 'lorem ipsum',
      baz: 87,
      qux: true
    })
  })

  it('returns empty object if no rc', () => {
    const rc = loadRcSync('bar')

    expect(rc).toEqual({})
  })

  it('allows rc ...args', () => {
    const foo = Foo.fromJSON(fooRcData)
    const rc = loadRcSync('withargs', 'test/fixtures', foo)

    expect(rc).toEqual(fooRcData)
  })

  it('allows custom cwd', () => {
    const rc = loadRcSync('foo', context.p1)

    expect(rc).toEqual(fooRcData)
  })

  it('should load with precedence', () => {
    const p1 = loadRcSync('foo', context.p1)
    const p2 = loadRcSync('foo', context.p2)
    const p3 = loadRcSync('foo', context.p3)
    const p4 = loadRcSync('foo', context.p4)
    const p5 = loadRcSync('foo', context.p5)
    const p6 = loadRcSync('foo', context.p6)
    // const p7 = error
    const p8 = loadRcSync('foo', context.p8)
    const p9 = loadRcSync('foo', context.p9)
    const pRoot = loadRcSync('foo', 'test/fixtures')

    expect(p1).toEqual(fooRcData)
    expect(p2).toEqual(fooRcData)
    expect(p3).toEqual(fooRcData)
    expect(p4).toEqual(fooRcData)
    expect(p5).resolves.toEqual(fooRcData)
    expect(p6).resolves.toEqual(fooRcData)
    // Error: code: ERR_REQUIRE_ESM
    expect(() => loadRcSync('foo', context.p7)).toThrowError()
    expect(p8).toEqual(fooRcData)
    expect(p9).toEqual(fooRcData)
    expect(pRoot).toEqual(fooRcData)
  })

  it('throws invalid values', () => {
    // TypeError: Config must be a plain object...
    expect(() => loadRcSync('invalid', 'test/fixtures')).toThrowError(
      /Config must be a plain object/
    )

    // TypeError: Config must be a plain object...
    expect(() =>
      loadRcSync('invalidasync', 'test/fixtures')
    ).rejects.toThrowError(/Config must be a plain object/)
  })
})
