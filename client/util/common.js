/**
 * Insert common items here
 */
import revitaLogoTransparent from 'Assets/revita_logo_transparent.png'
import practiceNow from 'Assets/practice_now.jpg'
import flagFinnish from 'Assets/flags/flag_finnish.png'
import flagErzya from 'Assets/flags/flag_erzya.png'
import flagKomizyrian from 'Assets/flags/flag_komi-zyrian.png'
import flagSakha from 'Assets/flags/flag_sakha.png'
import flagTatar from 'Assets/flags/flag_tatar.png'
import flagUdmurt from 'Assets/flags/flag_udmurt.png'
import flagMeadowmari from 'Assets/flags/flag_meadow-mari.png'
import flagNorthsaami from 'Assets/flags/flag_north-saami.png'
import flagCatalan from 'Assets/flags/flag_catalan.png'
import flagGerman from 'Assets/flags/flag_german.png'
import flagKazakh from 'Assets/flags/flag_kazakh.png'
import flagPortuguese from 'Assets/flags/flag_portuguese.png'
import flagRussian from 'Assets/flags/flag_russian.png'
import flagSpanish from 'Assets/flags/flag_spanish.png'
import flagSwedish from 'Assets/flags/flag_swedish.png'
import flagFrench from 'Assets/flags/flag_french.png'
import flagTurkish from 'Assets/flags/flag_turkish.png'
import flagItalian from 'Assets/flags/flag_italian.png'
import flagSyriac from 'Assets/flags/flag_syriac.png'
import culture1 from 'Assets/culture1.png'
import politics1 from 'Assets/politics1.png'
import science1 from 'Assets/science1.png'
import sport1 from 'Assets/sport1.png'
import flashcards from 'Assets/flashcards.jpg'
import logo from 'Assets/Logo.png'
import { callApi } from './apiConnection'

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
  flagSyriac,
  flashcards,
  logo,
}

export const newCapitalize = (word) => {
  const capitalizedParts = word.split('-').map((part) => {
    const p1 = part.slice(0, 1)
    const p2 = part.slice(1, part.length)
    return p1.toUpperCase() + p2
  })

  return capitalizedParts.join('-')
}

export const capitalize = (word = '') => {
  const firstLetter = word.slice(0, 1).toUpperCase()
  const wordEnd = word.slice(1, word.length)
  return `${firstLetter}${wordEnd}`
}

export const learningLanguageSelector = ({ user }) => (user.data ? user.data.user.last_used_language : null)
export const dictionaryLanguageSelector = ({ user }) => user.data.user.last_trans_language

export const supportedLearningLanguages = {
  major: [
    'finnish', 'german', 'russian', 'kazakh', 'catalan', 'spanish', 'swedish', 'italian', 'french',
    'portuguese',
  ].sort((a, b) => a.localeCompare(b)),
  minor: [
    'erzya', 'komi-zyrian', 'meadow-mari', 'north-saami', 'sakha', 'tatar', 'udmurt',
    'turkish',
  ].sort((a, b) => a.localeCompare(b)),
  experimental: ['syriac'],
}

export const betaLanguages = [
  'catalan',
  'french',
  'italian',
  'portuguese',
  'spanish',
  'swedish',
  'north-saami',
  'sakha',
  'syriac',
  'turkish',
]

export const rightAlignedLanguages = ['Syriac']

export const specialFonts = { Syriac: { fontFamily: 'EastSyriacCtesiphon', fontSize: '2rem' } }

export const getTextStyle = (language) => {
  let style = {}
  if (rightAlignedLanguages.includes(language)) style = { textAlign: 'right', direction: 'rtl' }
  if (specialFonts[language]) style = { ...style, ...specialFonts[language] }
  return style
}

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

export const checkRevitaStatus = async () => {
  const result = await callApi('/revitaStatus')
  return result
}


export * from '@root/config/common'

export const getTextWidth = (text) => {
  const myCanvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
  const context = myCanvas.getContext('2d')
  context.font = '1em Arial' // This should match with the defaultFont defined in custom.scss

  const metrics = context.measureText(text)
  return 65 + metrics.width // add just random number, lets hope its fine.
}

export const speak = (surfaceWord, learningLanguage) => {
  try {
    window.responsiveVoice.speak(surfaceWord, `${learningLanguage === 'german' ? 'Deutsch' : capitalize(learningLanguage)} Female`)
  } catch (e) {
    console.log(`Failed to speak ${surfaceWord} in ${capitalize(learningLanguage)}`)
  }
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
  Portuguese: [
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
  'Meadow-mari': [
    'Russian',
  ],
  Udmurt: [
    'Russian',
  ],
  Sakha: [
    'Russian',
    'English',
  ],
  'North-saami': [
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
  Syriac: [],
}
