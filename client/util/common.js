/**
 * Insert common items here
 */
import revitaLogoTransparent from 'Assets/revita_logo_transparent.png'
import practiceNow from 'Assets/practice_now.jpg'
import flagFinnish from 'Assets/flag_finnish.png'
import flagErzya from 'Assets/flag_erzya.png'
import flagKomizyrian from 'Assets/flag_komi-zyrian.png'
import flagSakha from 'Assets/flag_sakha.png'
import flagTatar from 'Assets/flag_tatar.png'
import flagUdmurt from 'Assets/flag_udmurt.png'
import flagMeadowmari from 'Assets/flag_meadow-mari.png'
import flagNorthsaami from 'Assets/flag_north-saami.png'
import flagCatalan from 'Assets/flag_catalan.png'
import flagGerman from 'Assets/flag_german.png'
import flagKazakh from 'Assets/flag_kazakh.png'
import flagPortuguese from 'Assets/flag_portuguese.png'
import flagRussian from 'Assets/flag_russian.png'
import flagSpanish from 'Assets/flag_spanish.png'
import flagSwedish from 'Assets/flag_swedish.png'
import flagFrench from 'Assets/flag_french.png'
import flagTurkish from 'Assets/flag_turkish.png'
import flagItalian from 'Assets/flag_italian.png'
import culture1 from 'Assets/culture1.png'
import politics1 from 'Assets/politics1.png'
import science1 from 'Assets/science1.png'
import sport1 from 'Assets/sport1.png'
import flashcards from 'Assets/flashcards.jpg'

export const images = {
  revitaLogoTransparent,
  practiceNow,
  culture1,
  politics1,
  science1,
  sport1,
  flagFinnish,
  flagUdmurt,
  flagErzya,
  flagKomizyrian,
  flagMeadowmari,
  flagSakha,
  flagTatar,
  flagNorthsaami,
  flagSwedish,
  flagItalian,
  flagGerman,
  flagRussian,
  flagKazakh,
  flagCatalan,
  flagSpanish,
  flagPortuguese,
  flagTurkish,
  flagFrench,
  flashcards,
}

export const capitalize = (word) => {
  const firstLetter = word.slice(0, 1).toUpperCase()
  const wordEnd = word.slice(1, word.length)
  return `${firstLetter}${wordEnd}`
}

export const learningLanguageSelector = ({ user }) => user.data.user.last_used_language
export const dictionaryLanguageSelector = ({ user }) => user.data.user.last_trans_language

export const supportedLearningLanguages = [
  'finnish', 'german', 'russian', 'kazakh', 'catalan', 'spanish', 'swedish', 'italian', 'french', 'turkish',
  'portuguese', 'erzya', 'komi-zyrian', 'meadow-mari', 'north-saami', 'sakha', 'tatar', 'udmurt',
].sort((a, b) => a.localeCompare(b))


export const colors = {}

export const localeOptions = [
  { displayName: 'Suomi', name: 'Finnish', code: 'fi' },
  { displayName: 'Svenska', name: 'Swedish', code: 'sv' },
  { displayName: 'Русский', name: 'Russian', code: 'ru' },
  { displayName: 'English', name: 'English', code: 'en' },
  { displayName: 'Italiano', name: 'Italian', code: 'it' },
]

export const localeNameToCode = (name) => {
  const localeObject = localeOptions.find(option => option.name === name)
  if (localeObject) {
    return localeObject.code
  }
  return 'en'
}
export const localeCodeToName = code => localeOptions.find(option => option.code === code).name


export * from '@root/config/common'

export const getTextWidth = (text) => {
  const myCanvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
  const context = myCanvas.getContext('2d')
  context.font = '1em Arial' // This should match with the defaultFont defined in custom.scss

  const metrics = context.measureText(text)
  return 65 + metrics.width // add just random number, lets hope its fine.
}

export const translatableLanguages = {
  Finnish: [
    'English',
    'French',
    'German',
    'Russian',
    'Spanish',
    'Finnish',
    'Swedish',
    'Turkish',
    'Italian',
    'Polish',
    'Czech',
    'Norwegian',
    'Portuguese',
    'Chinese',
    'Japanese',
    'Hindi',
  ],
  Russian: [
    'English',
    'Finnish',
    'Chinese',
    'French',
    'German',
    'Italian',
    'Norwegian',
    'Spanish',
    'Swedish',
    'Turkish',
    'Japanese',
    'Kazakh',
    'Polish',
    'Czech',
    'Portuguese',
    'Hindi',
  ],
  Spanish: [
    'Chinese',
    'English',
    'Finnish',
    'French',
    'German',
    'Italian',
    'Norwegian',
    'Russian',
    'Swedish',
    'Turkish',
    'Japanese',
    'Kazakh',
    'Polish',
    'Czech',
    'Portuguese',
    'Hindi',
  ],
  Italian: [
    'Chinese',
    'English',
    'Finnish',
    'French',
    'German',
    'Spanish',
    'Norwegian',
    'Russian',
    'Swedish',
    'Turkish',
    'Japanese',
    'Kazakh',
    'Polish',
    'Czech',
    'Portuguese',
    'Hindi',
  ],
  Catalan: [
    'Spanish',
    'Chinese',
    'English',
    'Finnish',
    'German',
    'Italian',
    'Norwegian',
    'Russian',
    'Swedish',
    'Turkish',
    'Japanese',
    'Kazakh',
    'Polish',
    'Czech',
    'Portuguese',
    'Hindi',
  ],
  French: [
    'Spanish',
    'Chinese',
    'English',
    'Finnish',
    'German',
    'Italian',
    'Norwegian',
    'Russian',
    'Swedish',
    'Turkish',
    'Japanese',
    'Kazakh',
    'Polish',
    'Czech',
    'Portuguese',
    'Hindi',
  ],
  German: [
    'Chinese',
    'English',
    'Finnish',
    'French',
    'Italian',
    'Norwegian',
    'Russian',
    'Spanish',
    'Swedish',
    'Turkish',
    'Japanese',
    'Polish',
    'Czech',
    'Portuguese',
    'Hindi',
  ],
  Swedish: [
    'Chinese',
    'English',
    'Finnish',
    'French',
    'Italian',
    'Norwegian',
    'Russian',
    'Spanish',
    'German',
    'Turkish',
    'Japanese',
    'Polish',
    'Czech',
    'Portuguese',
    'Hindi',
  ],
  'Komi-zyrian': [
    'Russian',
  ],
  'Meadow-Mari': [
    'Russian',
  ],
  Udmurt: [
    'Russian',
  ],
  Sakha: [
    'Russian',
    'English',
  ],
  'North-Saami': [
    'Finnish',
    'Norwegian',
  ],
  Erzya: [
    'Russian',
  ],
  Kazakh: [
    'Russian',
    'English',
  ],
  Tatar: [
    'Chinese',
    'English',
    'Finnish',
    'French',
    'Italian',
    'Norwegian',
    'Russian',
    'Spanish',
    'Swedish',
    'Turkish',
    'Japanese',
    'Polish',
    'Czech',
    'Portuguese',
    'Hindi',
  ],
  Turkish: [
    'Chinese',
    'English',
    'Finnish',
    'French',
    'Italian',
    'Norwegian',
    'Russian',
    'Spanish',
    'Swedish',
    'Japanese',
    'Polish',
    'Czech',
    'Portuguese',
    'Hindi',
    'Finnish',
  ],
  Livvi: [
    'Finnish',
  ],
}
