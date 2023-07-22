import { resolve } from 'node:path'

export const context = {
  p1: resolve('test/fixtures/p1'),
  p2: resolve('test/fixtures/p2'),
  p3: resolve('test/fixtures/p3'),
  p4: resolve('test/fixtures/p4'),
  p5: resolve('test/fixtures/p5'),
  p6: resolve('test/fixtures/p6'),
  p7: resolve('test/fixtures/p7'),
  p8: resolve('test/fixtures/p8'),
  p9: resolve('test/fixtures/p9')
}

export const fooData = {
  bar: 'bar', // => overrides from package.json
  baz: 87,
  qux: true,
  corge: { xyz: 123 } // => added from package.json
}

export const fooRcData = {
  bar: 'lorem ipsum',
  baz: 87,
  qux: true
}

// to pass as args
export class Foo {
  bar: string
  baz: number
  qux: boolean
  corge: { xyz: number }

  constructor(bar: string, baz: number, qux: boolean, corge: { xyz: number }) {
    this.bar = bar
    this.baz = baz
    this.qux = qux
    this.corge = corge
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: Record<string, any>): Foo {
    return new Foo(json.bar, json.baz, json.qux, json.corge)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJSON(): Record<string, any> {
    return {
      bar: this.bar,
      baz: this.baz,
      qux: this.qux,
      corge: this.corge
    }
  }
}
