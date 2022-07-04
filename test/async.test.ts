import { resolve } from 'node:path'
import { jest } from '@jest/globals'
import { findRc, loadRc } from '../dist/index.js'
import { swcData, fooRcData, Foo, context } from './helper.js'

beforeEach(() => {
  // this is resolves the error (on ci) below for wtf reason.
  // ReferenceError: You are trying to `import` a file after the Jest environment has been torn down.
  jest.useFakeTimers()
})

describe('#findRc()', () => {
  it('found rc file', async () => {
    const rcFile = await findRc('swc')

    expect(rcFile).toBe(resolve(process.cwd(), '.swcrc'))
  })

  it('should not looks for package.json', async () => {
    // as we have `foo` field in package.json
    const rcFile = await findRc('foo')

    expect(rcFile).toBeUndefined()
  })

  it('returns undefined if no rc files', async () => {
    const rcFile = await findRc('bar')

    expect(rcFile).toBeUndefined()
  })

  test('allows custom cwd', async () => {
    const rcFile = await findRc('foo', context.p1)

    expect(rcFile).toBe(resolve(context.p1, '.foorc'))
  })

  it('should find with precedence', async () => {
    const p1 = await findRc('foo', context.p1)
    const p2 = await findRc('foo', context.p2)
    const p3 = await findRc('foo', context.p3)
    const p4 = await findRc('foo', context.p4)
    const p5 = await findRc('foo', context.p5)
    const p6 = await findRc('foo', context.p6)
    const p7 = await findRc('foo', context.p7)
    const p8 = await findRc('foo', context.p8)
    const p9 = await findRc('foo', context.p9)
    const pRoot = await findRc('foo', 'test/fixtures')

    expect(p1).toBe(resolve(context.p1, '.foorc'))
    expect(p2).toBe(resolve(context.p2, '.foorc.json'))
    expect(p3).toBe(resolve(context.p3, '.foorc.yaml'))
    expect(p4).toBe(resolve(context.p4, '.foorc.yml'))
    expect(p5).toBe(resolve(context.p5, '.foo.mjs'))
    expect(p6).toBe(resolve(context.p6, '.foo.js'))
    expect(p7).toBe(resolve(context.p7, '.foo.js'))
    expect(p8).toBe(resolve(context.p8, 'foo.config.mjs'))
    expect(p9).toBe(resolve(context.p9, 'foo.config.js'))
    expect(pRoot).toBe(resolve('test/fixtures', 'foo.config.js'))
  })
})

describe('#loadRc()', () => {
  it('from package.json', async () => {
    const rc = await loadRc('foo')

    expect(rc).toEqual({ bar: 'bar', corge: { xyz: 123 } })
  })

  it('dont throws missing package.json', async () => {
    const rc = await loadRc('foo', 'test/fixtures')

    expect(rc).toEqual({
      bar: 'lorem ipsum',
      baz: 87,
      qux: true
    })
  })

  it('from rc file', async () => {
    const rc = await loadRc('swc')

    expect(rc).toEqual(swcData)
  })

  it('returns empty object if no rc', async () => {
    const rc = await loadRc('bar')

    expect(rc).toEqual({})
  })

  it('allows rc ...args', async () => {
    const foo = Foo.fromJSON(fooRcData)
    const rc = await loadRc('withargs', 'test/fixtures', foo)

    expect(rc).toEqual(fooRcData)
  })

  it('allows custom cwd', async () => {
    const rc = await loadRc('foo', context.p1)

    expect(rc).toEqual(fooRcData)
  })

  it('should load with precedence', async () => {
    const p1 = await loadRc('foo', context.p1)
    const p2 = await loadRc('foo', context.p2)
    const p3 = await loadRc('foo', context.p3)
    const p4 = await loadRc('foo', context.p4)
    const p5 = await loadRc('foo', context.p5)
    const p6 = await loadRc('foo', context.p6)
    const p7 = await loadRc('foo', context.p7)
    const p8 = await loadRc('foo', context.p8)
    const p9 = await loadRc('foo', context.p9)
    const pRoot = await loadRc('foo', 'test/fixtures')

    expect(p1).toEqual(fooRcData)
    expect(p2).toEqual(fooRcData)
    expect(p3).toEqual(fooRcData)
    expect(p4).toEqual(fooRcData)
    expect(p5).toEqual(fooRcData)
    expect(p6).toEqual(fooRcData)
    expect(p7).toEqual(fooRcData)
    expect(p8).toEqual(fooRcData)
    expect(p9).toEqual(fooRcData)
    expect(pRoot).toEqual(fooRcData)
  })

  it('throws invalid values', async () => {
    // TypeError: Config must be a plain object...
    await expect(loadRc('invalid', 'test/fixtures')).rejects.toThrowError(
      /Config must be a plain object/
    )
  })
})
