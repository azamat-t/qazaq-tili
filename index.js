// Precomputed character sets for efficient lookups
const VOWELS_HARD = new Set('аоұыя'.split(''))
const VOWELS_SOFT = new Set('әеиөүіэю'.split(''))
const CONSONANTS_HARD = new Set('кқпстфхһчцшщбвгдъ'.split(''))
const CONSONANTS_SOFT = new Set('жз'.split(''))
const CASE1_SET_A = new Set('аоыәеөіэмнңяё'.split(''))
const CASE1_SET_B = new Set('июлрйжзьуүұ'.split(''))
const CASE2_SET_A = new Set('аоуұыәеиөүіэйлрмнңжзяьёю'.split(''))
const CASE3_SET_A = new Set('июйлрмнңужзь'.split(''))
const CASE3_SET_B = new Set('аоуұыәеиөүіэяё'.split(''))
const CASE4_SET_A = new Set('аоуұыәеиөүіэйлрмнңужзяьюё'.split(''))
const CASE5_SET_A = new Set('аоуұыәеиөүіэуйлржзяьюё'.split(''))
const CASE5_SET_B = new Set('мнң'.split(''))

// 1. Move static maps outside the function to avoid recreating them on every call
const SEPTIK_MAP = { a: 0, i: 1, b: 2, t: 3, j: 4, sh: 5, k: 6 }
const VALID_SEPTIK = new Set([0, 1, 2, 3, 4, 5, 6])

/**
 * Adds grammatical suffixes to words based on processing type
 * @param word - Original word
 * @param septik - Processing type (1-6). Default is 6 (көмектес септік)
 * @returns Word with added suffix
 */
function jalgau(word, septik = 0, koptik = false) {
  if (typeof word !== 'string') {
    throw new Error('Invalid word. It must be a string.')
  }

  if (word.length === 0) return word

  // Fast mapping and validation
  const septikCode =
    typeof septik === 'string' ? SEPTIK_MAP[septik.toLowerCase()] : septik
  if (!VALID_SEPTIK.has(septikCode)) {
    throw new Error(
      "Invalid septik value. Allowed: 0-6 or 'a', 'i', 'b', 't', 'j', 'sh', 'k'.",
    )
  }

  const lowerWord = word.toLowerCase()
  const length = lowerWord.length
  const preLastChar = lowerWord[length - 1]

  // 2. Calculate vowel harmony ONLY ONCE.
  let vowelType = 1
  for (let i = length - 1; i >= 0; i--) {
    const char = lowerWord[i]

    if (VOWELS_HARD.has(char)) {
      vowelType = 1
      break
    }
    if (VOWELS_SOFT.has(char)) {
      vowelType = 2
      break
    }
  }

  // Determine Plural (Koptik)
  let plural = ''
  if (koptik) {
    if (CONSONANTS_HARD.has(preLastChar) || 'ъ'.includes(preLastChar)) {
      plural = vowelType === 1 ? 'тар' : 'тер'
    } else if (
      CONSONANTS_SOFT.has(preLastChar) ||
      'лмнң'.includes(preLastChar)
    ) {
      plural = vowelType === 1 ? 'дар' : 'дер'
    } else {
      plural = vowelType === 1 ? 'лар' : 'лер'
    }
  }

  // Early return if no case suffix is needed
  if (septikCode === 0) return word + plural

  // 3. Smart Character Indexing (Avoid re-lowercasing and string concatenation)
  let lastChar, secondLastChar
  if (plural) {
    // Plural suffixes ALWAYS end in 'р' (лар/лер, тар/тер, дар/дер)
    lastChar = 'р'
    // The second to last char of the plural is always the vowel
    secondLastChar = vowelType === 1 ? 'а' : 'е'
  } else {
    lastChar = preLastChar
    secondLastChar = length > 1 ? lowerWord[length - 2] : ''
  }

  let suffix = ''
  switch (septikCode) {
    case 1: // Ілік септік
      if (CASE1_SET_A.has(lastChar)) suffix = 'н'
      else if (CASE1_SET_B.has(lastChar)) suffix = 'д'
      else suffix = 'т'
      suffix += (vowelType === 2 ? 'і' : 'ы') + 'ң'
      break

    case 2: // Барыс септік
      if (CASE2_SET_A.has(lastChar)) suffix = vowelType === 1 ? 'ға' : 'ге'
      else if (CONSONANTS_HARD.has(lastChar))
        suffix = vowelType === 1 ? 'қа' : 'ке'
      else if (secondLastChar === 'с') suffix = vowelType === 1 ? 'на' : 'не'
      else if (
        (secondLastChar === 'ы' || secondLastChar === 'і') &&
        (lastChar === 'м' || lastChar === 'ң')
      )
        suffix = vowelType === 1 ? 'а' : 'е'
      break

    case 3: // Табыс септік
      if (CASE3_SET_A.has(lastChar)) suffix = vowelType === 1 ? 'ды' : 'ді'
      else if (CONSONANTS_HARD.has(lastChar))
        suffix = vowelType === 1 ? 'ты' : 'ті'
      else if (CASE3_SET_B.has(lastChar)) suffix = vowelType === 1 ? 'ны' : 'ні'
      else if (secondLastChar === 'с' && (lastChar === 'ы' || lastChar === 'і'))
        suffix = 'н'
      break

    case 4: // Жатыс септік
      if (CASE4_SET_A.has(lastChar)) suffix = vowelType === 1 ? 'да' : 'де'
      else if (CONSONANTS_HARD.has(lastChar))
        suffix = vowelType === 1 ? 'та' : 'те'
      else if (secondLastChar === 'с' && (lastChar === 'ы' || lastChar === 'і'))
        suffix = vowelType === 1 ? 'нда' : 'нде'
      break

    case 5: // Шығыс септік
      if (CASE5_SET_A.has(lastChar)) suffix = vowelType === 1 ? 'дан' : 'ден'
      else if (CONSONANTS_HARD.has(lastChar))
        suffix = vowelType === 1 ? 'тан' : 'тен'
      else if (
        CASE5_SET_B.has(lastChar) ||
        (secondLastChar === 'с' && (lastChar === 'ы' || lastChar === 'і'))
      )
        suffix = vowelType === 1 ? 'нан' : 'нен'
      break

    case 6: // Көмектес септік
      if (CONSONANTS_SOFT.has(lastChar)) suffix = 'б'
      else if (CONSONANTS_HARD.has(lastChar)) suffix = 'п'
      else suffix = 'м'
      suffix += 'ен'
      break
  }

  return word + plural + suffix
}

const SEPTIK_NAMES = {
  0: { cyrillic: 'Атау', latin: 'Atau', key: 'a' },
  1: { cyrillic: 'Ілік', latin: 'Ilik', key: 'i' },
  2: { cyrillic: 'Барыс', latin: 'Barys', key: 'b' },
  3: { cyrillic: 'Табыс', latin: 'Tabys', key: 't' },
  4: { cyrillic: 'Жатыс', latin: 'Jatys', key: 'j' },
  5: { cyrillic: 'Шығыс', latin: 'Shygys', key: 'sh' },
  6: { cyrillic: 'Көмектес', latin: 'Komektes', key: 'k' },
}

/**
 * Helper to determine vowel harmony of a stem (1 = hard/жуан, 2 = soft/жіңішке)
 */
function getVowelType(stem) {
  for (let i = stem.length - 1; i >= 0; i--) {
    const char = stem[i]
    if (VOWELS_HARD.has(char)) return 1
    if (VOWELS_SOFT.has(char)) return 2
  }
  return 1
}

/**
 * Ordered from longest to shortest suffix to prevent partial suffix collisions
 * (e.g., matching '-н' before '-нан'/'-мен'/'-дан').
 */
const SUFFIX_RULES = [
  // Case 1: Ілік септік (ның/нің, дың/дің, тың/тің)
  {
    suffix: 'ның',
    code: 1,
    vowel: 1,
    check: (last) => CASE1_SET_A.has(last),
  },
  {
    suffix: 'нің',
    code: 1,
    vowel: 2,
    check: (last) => CASE1_SET_A.has(last),
  },
  {
    suffix: 'дың',
    code: 1,
    vowel: 1,
    check: (last) => CASE1_SET_B.has(last),
  },
  {
    suffix: 'дің',
    code: 1,
    vowel: 2,
    check: (last) => CASE1_SET_B.has(last),
  },
  {
    suffix: 'тың',
    code: 1,
    vowel: 1,
    check: (last) => !CASE1_SET_A.has(last) && !CASE1_SET_B.has(last),
  },
  {
    suffix: 'тің',
    code: 1,
    vowel: 2,
    check: (last) => !CASE1_SET_A.has(last) && !CASE1_SET_B.has(last),
  },

  // Case 4 (3-char): Жатыс септік possessive (нда/нде)
  {
    suffix: 'нда',
    code: 4,
    vowel: 1,
    check: (last, secondLast) => secondLast === 'с' && last === 'ы',
  },
  {
    suffix: 'нде',
    code: 4,
    vowel: 2,
    check: (last, secondLast) => secondLast === 'с' && last === 'і',
  },

  // Case 5: Шығыс септік (дан/ден, тан/тен, нан/нен)
  {
    suffix: 'нан',
    code: 5,
    vowel: 1,
    check: (last, secondLast) =>
      CASE5_SET_B.has(last) || (secondLast === 'с' && last === 'ы'),
  },
  {
    suffix: 'нен',
    code: 5,
    vowel: 2,
    check: (last, secondLast) =>
      CASE5_SET_B.has(last) || (secondLast === 'с' && last === 'і'),
  },
  {
    suffix: 'дан',
    code: 5,
    vowel: 1,
    check: (last) => CASE5_SET_A.has(last),
  },
  {
    suffix: 'ден',
    code: 5,
    vowel: 2,
    check: (last) => CASE5_SET_A.has(last),
  },
  {
    suffix: 'тан',
    code: 5,
    vowel: 1,
    check: (last) => CONSONANTS_HARD.has(last),
  },
  {
    suffix: 'тен',
    code: 5,
    vowel: 2,
    check: (last) => CONSONANTS_HARD.has(last),
  },

  // Case 6: Көмектес септік (мен, бен, пен - vowel-harmony invariant)
  {
    suffix: 'бен',
    code: 6,
    vowel: 0,
    check: (last) => CONSONANTS_SOFT.has(last),
  },
  {
    suffix: 'пен',
    code: 6,
    vowel: 0,
    check: (last) => CONSONANTS_HARD.has(last),
  },
  {
    suffix: 'мен',
    code: 6,
    vowel: 0,
    check: (last) => !CONSONANTS_SOFT.has(last) && !CONSONANTS_HARD.has(last),
  },

  // Case 2 (2-char): Барыс септік (ға/ге, қа/ке, на/не)
  {
    suffix: 'на',
    code: 2,
    vowel: 1,
    check: (last, secondLast) => secondLast === 'с' && last === 'ы',
  },
  {
    suffix: 'не',
    code: 2,
    vowel: 2,
    check: (last, secondLast) => secondLast === 'с' && last === 'і',
  },
  {
    suffix: 'ға',
    code: 2,
    vowel: 1,
    check: (last) => CASE2_SET_A.has(last),
  },
  {
    suffix: 'ге',
    code: 2,
    vowel: 2,
    check: (last) => CASE2_SET_A.has(last),
  },
  {
    suffix: 'қа',
    code: 2,
    vowel: 1,
    check: (last) => CONSONANTS_HARD.has(last),
  },
  {
    suffix: 'ке',
    code: 2,
    vowel: 2,
    check: (last) => CONSONANTS_HARD.has(last),
  },

  // Case 3 (2-char): Табыс септік (ды/ді, ты/ті, ны/ні)
  {
    suffix: 'ды',
    code: 3,
    vowel: 1,
    check: (last) => CASE3_SET_A.has(last),
  },
  {
    suffix: 'ді',
    code: 3,
    vowel: 2,
    check: (last) => CASE3_SET_A.has(last),
  },
  {
    suffix: 'ты',
    code: 3,
    vowel: 1,
    check: (last) => CONSONANTS_HARD.has(last),
  },
  {
    suffix: 'ті',
    code: 3,
    vowel: 2,
    check: (last) => CONSONANTS_HARD.has(last),
  },
  {
    suffix: 'ны',
    code: 3,
    vowel: 1,
    check: (last) => CASE3_SET_B.has(last),
  },
  {
    suffix: 'ні',
    code: 3,
    vowel: 2,
    check: (last) => CASE3_SET_B.has(last),
  },

  // Case 4 (2-char): Жатыс септік (да/де, та/те)
  {
    suffix: 'да',
    code: 4,
    vowel: 1,
    check: (last) => CASE4_SET_A.has(last),
  },
  {
    suffix: 'де',
    code: 4,
    vowel: 2,
    check: (last) => CASE4_SET_A.has(last),
  },
  {
    suffix: 'та',
    code: 4,
    vowel: 1,
    check: (last) => CONSONANTS_HARD.has(last),
  },
  {
    suffix: 'те',
    code: 4,
    vowel: 2,
    check: (last) => CONSONANTS_HARD.has(last),
  },

  // Case 2 & 3 (1-char): Possessive-specific suffixes (а/е, н)
  {
    suffix: 'а',
    code: 2,
    vowel: 1,
    check: (last, secondLast) =>
      secondLast === 'ы' && (last === 'м' || last === 'ң'),
  },
  {
    suffix: 'е',
    code: 2,
    vowel: 2,
    check: (last, secondLast) =>
      secondLast === 'і' && (last === 'м' || last === 'ң'),
  },
  {
    suffix: 'н',
    code: 3,
    vowel: 0,
    check: (last, secondLast) =>
      secondLast === 'с' && (last === 'ы' || last === 'і'),
  },
]

/**
 * Detects the Kazakh grammatical case (септік) from `sourceWord`.
 * If `targetWord` is provided, inflects `targetWord` into the detected case.
 *
 * @param {string} sourceWord - Word to detect the case from (e.g., 'Серіктің')
 * @param {string} [targetWord] - Optional word to apply the detected case to (e.g., 'Алмаз')
 * @returns {{ septik: string, latin: string, key: string, code: number } | string}
 */
function getJalgau(sourceWord, targetWord) {
  if (typeof sourceWord !== 'string') {
    throw new Error('Invalid sourceWord. It must be a string.')
  }

  const lowerWord = sourceWord.trim().toLowerCase()
  let detectedCode = 0

  if (lowerWord.length > 0) {
    for (const rule of SUFFIX_RULES) {
      if (!lowerWord.endsWith(rule.suffix)) continue

      const stem = lowerWord.slice(0, lowerWord.length - rule.suffix.length)
      if (stem.length === 0) continue

      const lastChar = stem[stem.length - 1]
      const secondLastChar = stem.length >= 2 ? stem[stem.length - 2] : ''
      const vowelType = getVowelType(stem)

      if (rule.vowel !== 0 && rule.vowel !== vowelType) continue

      if (rule.check(lastChar, secondLastChar)) {
        detectedCode = rule.code
        break
      }
    }
  }

  // If a second word is passed, apply the detected case to it and return the formatted string
  if (typeof targetWord === 'string') {
    return jalgau(targetWord, detectedCode)
  }

  const info = SEPTIK_NAMES[detectedCode]
  return {
    septik: info.cyrillic,
    latin: info.latin,
    key: info.key,
    code: detectedCode,
  }
}

module.exports = { jalgau, getJalgau }
