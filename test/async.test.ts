import { resolve } from 'node:path'
import anyTest, { TestFn } from 'ava'
import { findConfig, loadConfig } from '../dist/index.js'
import { mock, mockFoo, Foo, context, type Context } from './utils.js'

const test = anyTest as TestFn<Context>

test.before(t => {
  t.context = context
})

test('findConfig()', async t => {
  const rcFile = await findConfig('prettier')

  t.is(rcFile, resolve(process.cwd(), '.prettierrc'))
})

test('findConfig cwd', async t => {
  const rcFile = await findConfig('foo', t.context.p1)

  t.is(rcFile, resolve(t.context.p1, '.foorc'))
})

test('findConfig precedence', async t => {
  const p1 = await findConfig('foo', t.context.p1)
  const p2 = await findConfig('foo', t.context.p2)
  const p3 = await findConfig('foo', t.context.p3)
  const p4 = await findConfig('foo', t.context.p4)
  const p5 = await findConfig('foo', t.context.p5)
  const p6 = await findConfig('foo', t.context.p6)
  const p7 = await findConfig('foo', t.context.p7)
  const p8 = await findConfig('foo', t.context.p8)
  const p9 = await findConfig('foo', t.context.p9)
  const pRoot = await findConfig('foo', 'test/fixtures')

  t.is(p1, resolve(t.context.p1, '.foorc'))
  t.is(p2, resolve(t.context.p2, '.foorc.json'))
  t.is(p3, resolve(t.context.p3, '.foorc.yaml'))
  t.is(p4, resolve(t.context.p4, '.foorc.yml'))
  t.is(p5, resolve(t.context.p5, '.foo.mjs'))
  t.is(p6, resolve(t.context.p6, '.foo.js'))
  t.is(p7, resolve(t.context.p7, '.foo.js'))
  t.is(p8, resolve(t.context.p8, 'foo.config.mjs'))
  t.is(p9, resolve(t.context.p9, 'foo.config.js'))
  t.is(pRoot, resolve('test/fixtures', 'foo.config.js'))
})

test('findConfig not found', async t => {
  const rcFile = await findConfig('foo')

  t.is(rcFile, undefined)
})

test('loadConfig()', async t => {
  const rc = await loadConfig('prettier')

  t.deepEqual(rc, mock)
})

test('loadConfig cwd', async t => {
  const rc = await loadConfig('foo', t.context.p1)

  t.deepEqual(rc, mockFoo)
})

test('loadConfig precedence', async t => {
  const p1 = await loadConfig('foo', t.context.p1)
  const p2 = await loadConfig('foo', t.context.p2)
  const p3 = await loadConfig('foo', t.context.p3)
  const p4 = await loadConfig('foo', t.context.p4)
  const p5 = await loadConfig('foo', t.context.p5)
  const p6 = await loadConfig('foo', t.context.p6)
  const p7 = await loadConfig('foo', t.context.p7)
  const p8 = await loadConfig('foo', t.context.p8)
  const p9 = await loadConfig('foo', t.context.p9)
  const pRoot = await loadConfig('foo', 'test/fixtures')

  t.deepEqual(p1, mockFoo)
  t.deepEqual(p2, mockFoo)
  t.deepEqual(p3, mockFoo)
  t.deepEqual(p4, mockFoo)
  t.deepEqual(p5, mockFoo)
  t.deepEqual(p6, mockFoo)
  t.deepEqual(p7, mockFoo)
  t.deepEqual(p8, mockFoo)
  t.deepEqual(p9, mockFoo)
  t.deepEqual(pRoot, mockFoo)
})

test('loadConfig empty', async t => {
  const rc = await loadConfig('bar')

  t.deepEqual(rc, {})
})

test('loadConfig with args', async t => {
  const foo = Foo.fromJSON(mockFoo)
  const rc = await loadConfig('withargs', 'test/fixtures', foo)

  t.deepEqual(rc, mockFoo)
})

test('throws invalid values', async t => {
  await t.throwsAsync(loadConfig('invalid', 'test/fixtures'), {
    instanceOf: TypeError,
    message: /Config must be a plain object/
  })
})

test('from package.json', async t => {
  const rc = await loadConfig('foo')

  t.deepEqual(rc, { bar: 'bar', corge: { xyz: 123 } })
})

test.serial("don't throws missing package.json", async t => {
  // mock cwd
  const cwdFn = process.cwd
  process.cwd = () => 'test/fixtures'

  const rc = await loadConfig('foo')

  t.deepEqual(rc, {})
  // restore cwd
  process.cwd = cwdFn
})
