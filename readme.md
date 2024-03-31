# rcfy

Finds and loads runtime-configuration file for the current project, with precedence.

## Install

```bash
npm i rcfy
# or
yarn add rcfy
```

## Usage

This package is pure ESM, please read the
[esm-package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

```js
import { findRc, loadRc } from 'rcfy'

const rcFile = await findRc('myproject')
// => root/to/project/.myproject.js

const rc = await loadRc('myproject')
// => { ... }
```

## API

### findRc

▸ **findRc**(`name`, `cwd?`): `Promise`<`string` \| `undefined`\>

Finds runtime-configuration file.

```js
import { findRc } from 'rcfy'

const rcFile = await findRc('myproject', './config')
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

### loadRc

▸ **loadRc**<`T` = `any`\>(`name`, `cwd?`, ...`args`): `Promise`<`T`\>

Loads runtime-configuration file, with precedence.

```js
import { loadRc } from 'rcfy'

const rc = await loadRc('myproject')
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

`Promise`<`T`\>

---

### findRcSync

▸ **findRcSync**(`name`, `cwd?`): `string` \| `undefined`

Finds runtime-configuration file synchronously.

```js
import { findRcSync } from 'rcfy'

const rcFile = findRcSync('myproject', './config')
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

### loadRcSync

▸ **loadRcSync**<`T` = `any`\>(`name`, `cwd?`, ...`args`): `T` \| `Promise`<`T`\>

Loads runtime-configuration file synchronously, with precedence.

```js
import { loadRcSync } from 'rcfy'

const rc = loadRcSync('myproject')
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

`T` \| `Promise`<`T`\>

## Related

- [`loadee`](https://github.com/bent10/loadee) – A utility to simplify the loading of YAML, JSON, and JS files.

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

## License

![GitHub](https://img.shields.io/github/license/bent10/rcfy)

A project by [Stilearning](https://stilearning.com) &copy; 2022-2024.
