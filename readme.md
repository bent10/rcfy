# rcfy

Finds and loads runtime-configuration file for the current project, with precedence.

## Install

```bash
npm i rcfy
```

## Usage

This package is pure ESM, please read the
[esm-package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

```js
import { findConfig, loadConfig } from 'rcfy'

const rcFile = await findConfig('myproject')
// => root/to/project/.myproject.js

const rc = await loadConfig('myproject')
// => { ... }
```

<details>
<summary>`AnyConfig` interface</summary>

```ts
interface AnyConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
```

</details>

## API

### findConfig

▸ **findConfig**(`name`, `cwd?`): `Promise`<`string` \| `undefined`\>

Finds runtime-configuration file.

```js
import { findConfig } from 'rcfy'

const rcFile = await findConfig('myproject', './config')
// will finds:
// - `.myprojectrc` file in the `./config` directory.
// - `.myprojectrc.json` file in the `./config` directory.
// - `.myprojectrc.{yaml,yml}` file in the `./config` directory.
// - `.myproject.{mjs,cjs,js}` file in the `./config` directory.
// - `myproject.config.{mjs,cjs,js}` file in the `./config` directory.
```

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |
| `cwd`  | `string` |

#### Returns

`Promise`<`string` \| `undefined`\>

---

### loadConfig

▸ **loadConfig**(`name`, `cwd?`, ...`args`): `Promise`<AnyConfig\>

Finds runtime-configuration file, with precedence.

```js
import { loadConfig } from 'rcfy'

const rc = await loadConfig('myproject')
// will try to loads config from:
// - `myproject` field in the `package.json` file.
// - `.myprojectrc` file in the `cwd`.
// - `.myprojectrc.json` file in the `cwd`.
// - `.myprojectrc.{yaml,yml}` file in the `cwd`.
// - `.myproject.{mjs,cjs,js}` file in the `cwd`.
// - `myproject.config.{mjs,cjs,js}` file in the `cwd`.
```

**Note:** Config that found in the `package.json` will be merged with
higher precedence.

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `name`    | `string` |
| `cwd`     | `string` |
| `...args` | `any`[]  |

#### Returns

`Promise`<AnyConfig\>

---

### findConfigSync

▸ **findConfigSync**(`name`, `cwd?`): `string` \| `undefined`

Finds runtime-configuration file synchronously.

```js
import { findConfigSync } from 'rcfy'

const rcFile = findConfigSync('myproject', './config')
// will finds:
// - `.myprojectrc` file in the `./config` directory.
// - `.myprojectrc.json` file in the `./config` directory.
// - `.myprojectrc.{yaml,yml}` file in the `./config` directory.
// - `.myproject.{cjs,js}` file in the `./config` directory.
// - `myproject.config.{cjs,js}` file in the `./config` directory.
```

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |
| `cwd`  | `string` |

#### Returns

`string` \| `undefined`

---

### loadConfigSync

▸ **loadConfigSync**(`name`, `cwd?`, ...`args`): AnyConfig \| `Promise`<AnyConfig\>

Loads runtime-configuration file synchronously, with precedence.

```js
import { loadConfigSync } from 'rcfy'

const rc = loadConfigSync('myproject')
// will try to loads config from:
// - `myproject` field in the `package.json` file.
// - `.myprojectrc` file in the `cwd`.
// - `.myprojectrc.json` file in the `cwd`.
// - `.myprojectrc.{yaml,yml}` file in the `cwd`.
// - `.myproject.{cjs,js}` file in the `cwd`.
// - `myproject.config.{cjs,js}` file in the `cwd`.
```

**Note:** Config that found in the `package.json` will be merged with
higher precedence.

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `name`    | `string` |
| `cwd`     | `string` |
| `...args` | `any`[]  |

#### Returns

AnyConfig \| `Promise`<AnyConfig\>

---

### loadFile

▸ **loadFile**(`pathlike`, `cwd?`, ...`args`): `Promise`<`PlainObject` \| `unknown`\>

Resolves data from `yaml`, `json`, or `js` files.

The `js` module will be normalize to either a plain object, string, number,
boolean, null or undefined.

```js
import { loadFile } from 'loadee'

const fromJson = await loadFile('data.json')
// => { ... }
const fromYaml = await loadFile('data.yaml')
// => { ... }
const fromJs = await loadFile('data.js')
// => { ... } or unknown
const fromCjs = await loadFile('data.cjs')
// => { ... } or unknown
```

#### Parameters

| Name       | Type        |
| :--------- | :---------- |
| `pathlike` | `PathLike`  |
| `cwd?`     | `string`    |
| `...args`  | `unknown`[] |

#### Returns

`Promise`<`PlainObject` \| `unknown`\>

---

### loadFileSync

▸ **loadFileSync**(`pathlike`, `cwd?`, ...`args`): `PlainObject` \| `unknown`

Resolves data from `yaml`, `json`, or `js` files synchronously.

The `js` module will be normalize to either a plain object, string, number,
boolean, null or undefined.

> **NOTE:** This function cannot be used to load ES modules. The `.js`
> file will treated as CommonJS.

```js
import { loadFileSync } from 'loadee'

const fromJsonSync = loadFileSync('data.json')
// => { ... }
const fromYamlSync = loadFileSync('data.yaml')
// => { ... }
const fromJsSync = loadFileSync('data.js')
// => { ... } or unknown
```

#### Parameters

| Name       | Type        |
| :--------- | :---------- |
| `pathlike` | `PathLike`  |
| `cwd?`     | `string`    |
| `...args`  | `unknown`[] |

#### Returns

`PlainObject` \| `unknown`

---

## Contributing

We 💛&nbsp; issues.

When committing, please conform to [the semantic-release commit standards](https://www.conventionalcommits.org/). Please install `commitizen` and the adapter globally, if you have not already.

```bash
npm i -g commitizen cz-conventional-changelog
```

Now you can use `git cz` or just `cz` instead of `git commit` when committing. You can also use `git-cz`, which is an alias for `cz`.

```bash
git add . && git cz
```

## Thank you

A project by [Stilearning](https://stilearning.com) &copy; 2022.
