# qazaq-tili

Decline Kazakh words by grammatical case (septik) and detect a word's case from its suffix. No dependencies.

[Instructions in Kazakh](./kz.md)

[Instructions in Russian](../README.md)

```js
jalgau('Алмас', 'b') // 'Алмасқа'
jalgau('кітап', 'sh', true) // 'кітаптардан'
getJalgau('Серіктің') // { septik: 'Ілік', latin: 'Ilik', key: 'i', code: 1 }
```

## Installation

```bash
npm install qazaq-tili
```

## Import

```js
const { jalgau, getJalgau } = require('qazaq-tili')
// or
import { jalgau, getJalgau } from 'qazaq-tili'
```

## Cases

A case can be passed as a number or as a string key:

| Code |  Key   | Name     | Latin    | English equivalent        | Questions              | Suffixes                         |
| :--: | :----: | -------- | -------- | ------------------------- | ---------------------- | -------------------------------- |
| `0`  | `'a'`  | Атау     | Atau     | Nominative                | кім? не?               | —                                |
| `1`  | `'i'`  | Ілік     | Ilik     | Genitive                  | кімнің? ненің?         | -ның/-нің, -дың/-дің, -тың/-тің  |
| `2`  | `'b'`  | Барыс    | Barys    | Dative                    | кімге? неге? қайда?    | -ға/-ге, -қа/-ке, -на/-не, -а/-е |
| `3`  | `'t'`  | Табыс    | Tabys    | Accusative                | кімді? нені?           | -ны/-ні, -ды/-ді, -ты/-ті, -н    |
| `4`  | `'j'`  | Жатыс    | Jatys    | Locative                  | кімде? неде? қайда?    | -да/-де, -та/-те, -нда/-нде      |
| `5`  | `'sh'` | Шығыс    | Shygys   | Ablative                  | кімнен? неден? қайдан? | -дан/-ден, -тан/-тен, -нан/-нен  |
| `6`  | `'k'`  | Көмектес | Komektes | Instrumental / Comitative | кіммен? немен?         | -мен, -бен, -пен                 |

## `jalgau(word, septik = 0, koptik = false)`

Puts a word into the given case. The hard or soft form of the suffix (vowel harmony) is chosen automatically.

| Parameter | Type               | Description                                                     |
| --------- | ------------------ | --------------------------------------------------------------- |
| `word`    | `string`           | Word in its base (nominative) form                              |
| `septik`  | `number \| string` | Case: `0–6` or `'a'`, `'i'`, `'b'`, `'t'`, `'j'`, `'sh'`, `'k'` |
| `koptik`  | `boolean`          | `true` — add the plural suffix                                  |

```js
jalgau('қала', 'j') // 'қалада'
jalgau('мектеп', 'b') // 'мектепке'
jalgau('Әлия', 'i') // 'Әлияның'
jalgau('Айгүл', 'k') // 'Айгүлмен'
jalgau('Мұрат', 2) // 'Мұратқа'
```

Plural:

```js
jalgau('кітап', 'a', true) // 'кітаптар'
jalgau('кітап', 'i', true) // 'кітаптардың'
jalgau('адам', 'b', true) // 'адамдарға'
jalgau('мектеп', 'j', true) // 'мектептерде'
```

## `getJalgau(sourceWord, targetWord?)`

Detects a word's case from its suffix.

```js
getJalgau('Серіктің') // { septik: 'Ілік',  latin: 'Ilik',   key: 'i',  code: 1 }
getJalgau('қаладан') // { septik: 'Шығыс', latin: 'Shygys', key: 'sh', code: 5 }
getJalgau('Серік') // { septik: 'Атау',  latin: 'Atau',   key: 'a',  code: 0 }
```

If you pass a second word, the function returns it in the same case:

```js
getJalgau('Серіктің', 'Алмаз') // 'Алмаздың'
getJalgau('мектепте', 'қала') // 'қалада'
getJalgau('Айгүлге', 'Мұрат') // 'Мұратқа'
```

## Usage examples

```js
const { jalgau } = require('qazaq-tili')

// Notification text
const msg = `${jalgau('Алмас', 'sh')} ${jalgau('Серік', 'b')} 5000 ₸ аударылды`
// 'Алмастан Серікке 5000 ₸ аударылды'

// All case forms of a word
const forms = ['a', 'i', 'b', 't', 'j', 'sh', 'k'].map((k) => jalgau('қала', k))
// ['қала', 'қаланың', 'қалаға', 'қаланы', 'қалада', 'қаладан', 'қаламен']
```

## Errors

Both functions throw an `Error` if `word` or `sourceWord` is not a string, or if an unknown case is passed (for example `7`, `'x'`, or the string `'1'` instead of the number `1`).

## Good to know

- Pass words to `jalgau` in their base form, without extra whitespace (use `trim()`).
- Suffixes are always added in lowercase: `jalgau('АЛМАС', 'i')` → `'АЛМАСтың'`.
- `getJalgau` detects the case from the word's ending only, so a base-form word whose ending looks like a case suffix may be misdetected: for example, `getJalgau('Қазақстан')` → Шығыс.

## License

ISC
