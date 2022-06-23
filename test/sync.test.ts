import { resolve } from 'node:path'
import anyTest, { TestFn } from 'ava'
import { findRcSync, loadRcSync } from '../dist/index.js'
import { mock, mockFoo, Foo, context, type Context } from './utils.js'

const test = anyTest as TestFn<Context>

test.before(t => {
  t.context = context
})

test('findRcSync()', t => {
  const rcFile = findRcSync('swc')

  t.is(rcFile, resolve(process.cwd(), '.swcrc'))
})

test('findRcSync cwd', t => {
  const rcFile = findRcSync('foo', t.context.p1)

  t.is(rcFile, resolve(t.context.p1, '.foorc'))
})

test('findRcSync precedence', t => {
  const p1 = findRcSync('foo', t.context.p1)
  const p2 = findRcSync('foo', t.context.p2)
  const p3 = findRcSync('foo', t.context.p3)
  const p4 = findRcSync('foo', t.context.p4)
  const p5 = findRcSync('foo', t.context.p5)
  const p6 = findRcSync('foo', t.context.p6)
  const p7 = findRcSync('foo', t.context.p7)
  const p8 = findRcSync('foo', t.context.p8)
  const p9 = findRcSync('foo', t.context.p9)
  const pRoot = findRcSync('foo', 'test/fixtures')

  t.is(p1, resolve(t.context.p1, '.foorc'))
  t.is(p2, resolve(t.context.p2, '.foorc.json'))
  t.is(p3, resolve(t.context.p3, '.foorc.yaml'))
  t.is(p4, resolve(t.context.p4, '.foorc.yml'))
  t.is(p5, resolve(t.context.p5, '.foo.cjs'))
  t.is(p6, resolve(t.context.p6, '.foo.cjs'))
  t.is(p7, resolve(t.context.p7, '.foo.js'))
  t.is(p8, resolve(t.context.p8, 'foo.config.cjs'))
  t.is(p9, resolve(t.context.p9, 'foo.config.cjs'))
  t.is(pRoot, resolve('test/fixtures', 'foo.config.cjs'))
})

test('findRcSync not found', t => {
  const rcFile = findRcSync('foo')

  t.is(rcFile, undefined)
})

test('loadRcSync()', t => {
  const rc = loadRcSync('swc')

  t.deepEqual(rc, mock)
})

test('loadRcSync cwd', t => {
  const rc = loadRcSync('foo', t.context.p1)

  t.deepEqual(rc, mockFoo)
})

test('loadRcSync precedence', async t => {
  const p1 = loadRcSync('foo', t.context.p1)
  const p2 = loadRcSync('foo', t.context.p2)
  const p3 = loadRcSync('foo', t.context.p3)
  const p4 = loadRcSync('foo', t.context.p4)
  const p5 = loadRcSync('foo', t.context.p5)
  const p6 = loadRcSync('foo', t.context.p6)
  // const p7 = error
  const p8 = loadRcSync('foo', t.context.p8)
  const p9 = loadRcSync('foo', t.context.p9)
  const pRoot = loadRcSync('foo', 'test/fixtures')

  t.deepEqual(p1, mockFoo)
  t.deepEqual(p2, mockFoo)
  t.deepEqual(p3, mockFoo)
  t.deepEqual(p4, mockFoo)
  t.deepEqual(await p5, mockFoo)
  t.deepEqual(await p6, mockFoo)
  t.throws(() => loadRcSync('foo', t.context.p7), {
    instanceOf: Error,
    code: 'ERR_REQUIRE_ESM'
  })
  t.deepEqual(p8, mockFoo)
  t.deepEqual(p9, mockFoo)
  t.deepEqual(pRoot, mockFoo)
})

test('loadRcSync empty', t => {
  const rc = loadRcSync('bar')

  t.deepEqual(rc, {})
})

test('loadRc with args', t => {
  const foo = Foo.fromJSON(mockFoo)
  const rc = loadRcSync('withargs', 'test/fixtures', foo)

  t.deepEqual(rc, mockFoo)
})

test('throws invalid values', async t => {
  t.throws(() => loadRcSync('invalid', 'test/fixtures'), {
    instanceOf: TypeError,
    message: /Config must be a plain object/
  })

  // NOTE: it can be a promise
  await t.throwsAsync(
    async () => await loadRcSync('invalidasync', 'test/fixtures'),
    {
      instanceOf: TypeError,
      message: /Config must be a plain object/
    }
  )
})

test('from package.json', t => {
  const rc = loadRcSync('foo')

  t.deepEqual(rc, { bar: 'bar', corge: { xyz: 123 } })
})

test.serial("don't throws missing package.json", t => {
  // mock cwd
  const cwdFn = process.cwd
  process.cwd = () => 'test/fixtures'

  const rc = loadRcSync('foo')

  t.deepEqual(rc, {})
  // restore cwd
  process.cwd = cwdFn
})
