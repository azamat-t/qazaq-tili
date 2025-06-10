// Precomputed character sets for efficient lookups
const VOWELS_HARD = new Set('аоуұыя'.split(''))
const VOWELS_SOFT = new Set('әеиөүіэ'.split(''))
const CONSONANTS_HARD = new Set('кқпстфхһчцшщбвгд'.split(''))
const CONSONANTS_SOFT = new Set('жз'.split(''))
const CASE1_SET_A = new Set('аоуұыәеөүіэмнңяё'.split(''))
const CASE1_SET_B = new Set('июлруйжзь'.split(''))
const CASE2_SET_A = new Set('аоуұыәеиөүіэйлрмнңжзяьё'.split(''))
const CASE3_SET_A = new Set('июйлрмнңужзь'.split(''))
const CASE3_SET_B = new Set('аоуұыәеиөүіэяё'.split(''))
const CASE4_SET_A = new Set('аоуұыәеиөүіэйлрмнңужзяьюё'.split(''))
const CASE5_SET_A = new Set('аоуұыәеиөүіэуйлржзяьюё'.split(''))
const CASE5_SET_B = new Set('мнң'.split(''))

/**
 * Adds grammatical suffixes to names based on processing type
 * @param name - Original name
 * @param typer - Processing type (1-6). Default is 6 (көмектес септік)
 * @returns Name with added suffix
 */
function qazaqtili(name, typer = 0) {
  const lowerName = name.toLowerCase()
  const length = lowerName.length

  if (length === 0) return name

  const lastChar = lowerName.charAt(length - 1)
  const secondLastChar = length > 1 ? lowerName.charAt(length - 2) : ''

  // Determine vowel harmony type (1 = hard, 2 = soft)
  let vowelType = 0
  for (let i = length - 1; i >= 0; i--) {
    const char = lowerName.charAt(i)
    if (VOWELS_HARD.has(char)) {
      vowelType = 1
      break
    }
    if (VOWELS_SOFT.has(char)) {
      vowelType = 2
      break
    }
  }

  let suffix = ''

  switch (typer) {
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

    case 6: // Көмектес септік (default)
      if (CONSONANTS_SOFT.has(lastChar)) suffix = 'б'
      else if (CONSONANTS_HARD.has(lastChar)) suffix = 'п'
      else suffix = 'м'
      suffix += 'ен'
      break
  }

  return name + suffix
}

module.exports = qazaqtili
