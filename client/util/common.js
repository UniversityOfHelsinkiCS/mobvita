/**
 * Insert common items here
 */
import sanitize from 'sanitize-html'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import React from 'react'
import revitaLogoTransparent from 'Assets/images/revita_logo_transparent.png'
import flagFinnish from 'Assets/images/flags/flag_finnish.png'
import flagErzya from 'Assets/images/flags/flag_erzya.png'
import flagKomizyrian from 'Assets/images/flags/flag_komi-zyrian.png'
import flagSakha from 'Assets/images/flags/flag_sakha.png'
import flagTatar from 'Assets/images/flags/flag_tatar.png'
import flagTatarnew from 'Assets/images/flags/flag_tatar.png'
import flagUdmurt from 'Assets/images/flags/flag_udmurt.png'
import flagLivvi from 'Assets/images/flags/flag_karelia.png'
import flagUdmurtarch from 'Assets/images/flags/flag_udmurt.png'
import flagMeadowmari from 'Assets/images/flags/flag_meadow-mari.png'
import flagNorthsaami from 'Assets/images/flags/flag_north-saami.png'
import flagCatalan from 'Assets/images/flags/flag_catalan.png'
import flagGerman from 'Assets/images/flags/flag_german.png'
import flagKazakh from 'Assets/images/flags/flag_kazakh.png'
import flagPortuguese from 'Assets/images/flags/flag_portuguese.png'
import flagRussian from 'Assets/images/flags/flag_russian.png'
import flagSpanish from 'Assets/images/flags/flag_spanish.png'
import flagSwedish from 'Assets/images/flags/flag_swedish.png'
import flagFrench from 'Assets/images/flags/flag_french.png'
import flagTurkish from 'Assets/images/flags/flag_turkish.png'
import flagItalian from 'Assets/images/flags/flag_italian.png'
import flagSyriac from 'Assets/images/flags/flag_syriac.png'
import flagChinese from 'Assets/images/flags/flag_prc.png'
import flagEnglish from 'Assets/images/flags/flag_uk.png'
// ---
import culture1 from 'Assets/images/culture.png'
import politics1 from 'Assets/images/politics.png'
import science1 from 'Assets/images/science.png'
import sport1 from 'Assets/images/sport.png'
import flashcards from 'Assets/images/flashcards.png'
import library from 'Assets/images/library.png'
import public1 from 'Assets/images/public.png'
import group1 from 'Assets/images/group.png'
import private1 from 'Assets/images/private.png'
import dices from 'Assets/images/dices.png'
import diveIn from 'Assets/images/diveIn.png'
import addStoriesIcon from 'Assets/images/add-orange.png'

import practice from 'Assets/images/practice.png'
import adaptiveTest from 'Assets/images/adaptive_test.png'
import exhaustiveTest from 'Assets/images/exhaustive_test.png'
import help from 'Assets/images/help.png'
import settingsIcon from 'Assets/images/settings_icon.png'
import bellIcon from 'Assets/images/bell_icon.png'
import infoIcon from 'Assets/images/info_icon.png'
import notesIcon from 'Assets/images/notes.png'
import lightbulbIcon from 'Assets/images/light-bulb.png'
// ---
import addStory from 'Assets/images/add_story.jpg'
import tests from 'Assets/images/tests.jpg'
import logo from 'Assets/images/logo_transparent.png'
import navbarLogo from 'Assets/images/logo_navbar_transparent.png'
import flashcardIcon from 'Assets/images/flashcard_icon.png'
import bronzeMedal from 'Assets/images/medals/bronze_medal.png'
import silverMedal from 'Assets/images/medals/silver_medal.png'
import goldMedal from 'Assets/images/medals/gold_medal.png'
import platinumMedal from 'Assets/images/medals/platinum_medal.png'
import diamondMedal from 'Assets/images/medals/diamond_medal.png'
import unlockedMedal from 'Assets/images/medals/unlocked_medal.png'
import firstMedal from 'Assets/images/medals/first_medal.svg'
import secondMedal from 'Assets/images/medals/second_medal.svg'
import thirdMedal from 'Assets/images/medals/third_medal.svg'
import wreadth from 'Assets/images/wreadth.png'
import fancyWreadth from 'Assets/images/fancy_wreadth.png'
import trophy from 'Assets/images/trophy.svg'
import leaderboard from 'Assets/images/leaderboard.svg'
import nestIcon from 'Assets/images/nest.png'
import balloons from 'Assets/images/balloons.png'
import fireworks from 'Assets/images/fireworks.png'
import encTrophy from 'Assets/images/enc_trophy.png'
import racingFlag from 'Assets/images/racing_flag.png'
import direction from 'Assets/images/direction.png'
import exclamationMark from 'Assets/images/exclamation.png'
import magnifyingGlass from 'Assets/images/glass.png'
import beeHive from 'Assets/images/bee_hive.png'
import barChart from 'Assets/images/bar_chart.png'
import readingBook from 'Assets/images/reading-book.png'
import flameIcon from 'Assets/images/flame_icon.png'
import flame from 'Assets/images/flame.png'
import flameColorless from 'Assets/images/flame_colorless.png'
import greenArrow from 'Assets/images/green_arrow.png'
import heartbeat from 'Assets/images/heartbeat.png'

import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { hiddenFeatures } from 'Utilities/common'

import { Howler } from 'howler'
import confetti from 'canvas-confetti'
import { callApi, yandexSpeak, RVSpeak, tacotronSpeak, coquiSpeak } from './apiConnection'
import StoryTopics from 'Components/StoryView/StoryTopics'
import Sparkle from 'react-sparkle'

export const images = {
  revitaLogoTransparent,
  flagFinnish,
  flagUdmurt,
  flagUdmurtarch,
  flagLivvi,
  flagErzya,
  flagKomizyrian,
  flagMeadowmari,
  flagSakha,
  flagTatar,
  flagTatarnew,
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
  flagChinese,
  flagEnglish,
  tests,
  addStory,
  addStoriesIcon,  
  logo,
  navbarLogo,
  flashcardIcon,
  bronzeMedal,
  silverMedal,
  goldMedal,
  platinumMedal,
  diamondMedal,
  unlockedMedal,
  firstMedal,
  secondMedal,
  thirdMedal,
  wreadth,
  fancyWreadth,
  trophy,
  leaderboard,
  dices, // practice now modal ->
  diveIn, // new practice now modal -> dive in modal
  public1,
  private1,
  group1,
  culture1,
  politics1,
  science1,
  sport1,
  practice, // homeview -->
  flashcards,
  library,
  adaptiveTest,
  exhaustiveTest,
  help,
  infoIcon, // icons -->
  bellIcon,
  settingsIcon,
  nestIcon,
  lightbulbIcon,
  balloons,
  fireworks,
  notesIcon,
  encTrophy,
  racingFlag,
  direction,
  exclamationMark,
  magnifyingGlass,
  beeHive,
  barChart,
  readingBook,
  flame,
  flameColorless,
  flameIcon,
  greenArrow,
  heartbeat,
}

export const backgroundColors = [
  'lavender',
  'lightyellow',
  'antiquewhite',
  'lightPink',
  'lightcyan',
]
export const showAllEncouragements = false

export const getCategoryColor = category => {
  if (category === 'Grammar') {
    return 'note-grammar'
  }
  if (category === 'Phrases') {
    return 'note-phrases'
  }
  if (category === 'Vocabulary') {
    return 'note-vocabulary'
  }

  return ''
}

export const skillLevels = [
  'pre-A1',
  'A1',
  'A1/A2',
  'A2',
  'A2/B1',
  'B1',
  'B1/B2',
  'B2',
  'B2/C1',
  'C1',
  'C1/C2',
  'C2',
  'C2+',
]

export const confettiRain = (x = 0.4, y = 0.6, angle = null) => {
  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  if (angle === null) {
    angle = randomInRange(55, 125);
  }

  confetti({
    angle: angle,
    spread: randomInRange(50, 70),
    particleCount: randomInRange(50, 100),
    origin: { x, y },
  });
};



export const finalConfettiRain = (colors, endDate) => {
  ;(function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    })
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    })

    if (Date.now() < endDate) {
      requestAnimationFrame(frame)
    }
  })()
}

export const timerExpired = (parsedDate, timeLimit) => {
  const currentTime = new Date()
  const dif = currentTime.valueOf() - parsedDate.valueOf()
  const timeElapsed = dif / 1000 / 60 / 60

  return timeElapsed > timeLimit
}

export const isToday = date => {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export const capitalize = word => {
  const capitalizedParts = word.split('-').map(part => {
    const p1 = part.slice(0, 1)
    const p2 = part.slice(1, part.length)
    return p1.toUpperCase() + p2
  })

  return capitalizedParts.join('-')
}

// the above capitalize function capitalizes every component separated by -
// here we capitalize ONLY THE FIRST CHARACTER
export const capitalize_first_char_only = word => {
    const p1 = word.slice(0, 1)
    const p2 = word.slice(1, word.length)
    return p1.toUpperCase() + p2
}



// coloring difficulty
function getRgb(color) {
  const [r, g, b] = color
    .replace('rgb(', '')
    .replace(')', '')
    .split(',')
    .map(str => Number(str))
  return { r, g, b }
}

function colorInterpolate(colorA, colorB, intval) {
  const rgbA = getRgb(colorA)
  const rgbB = getRgb(colorB)
  const colorVal = prop => Math.round(rgbA[prop] * (1 - intval) + rgbB[prop] * intval)
  return {
    r: colorVal('r'),
    g: colorVal('g'),
    b: colorVal('b'),
  }
}

function ColorToHex(color) {
  const hexadecimal = color.toString(16)
  return hexadecimal.length == 1 ? `0${hexadecimal}` : hexadecimal
}

function ConvertRGBtoHex(red, green, blue) {
  return `#${ColorToHex(red)}${ColorToHex(green)}${ColorToHex(blue)}`
}

export const composeExerciseContext = (snippet, word) => {
  const surfaces = {}
  const context = snippet.reduce((acc, curr) => {
    if (curr.id && curr.id == word.id) {
      surfaces[curr.surface] = curr.base
      acc += `<EXERCISE START>${curr.surface}(${curr.base})<EXERCISE END>`;
    } else if (curr.id && curr.id != word.id) {
      surfaces[curr.surface] = curr.base
      acc += `<HIDDEN WORD START>${curr.surface}(${curr.base})<HIDDEN WORD END>`;
    } else {
        acc += curr.surface;
    }
    return acc;
  }, '')
  return {context, surfaces}
}

export function getWordColor(
  word_level,
  user_grade,
  skillLevels,
  show_review_diff,
  show_preview_exer,
  mode
) {
  if (
    !word_level ||
    !user_grade ||
    mode === 'controlled-story-editor' ||
    ((mode === 'review' || mode === 'practice' || mode === 'controlled-practice') &&
      !show_review_diff) ||
    (mode === 'preview' && !show_preview_exer) ||
    user_grade >= word_level || !hiddenFeatures
  ) {
    return '#FFFFFF' // white background
  }

  // const wordDifficulty = skillLevels.findIndex(level => {
  //   return level === word_level
  // })
  // const userGrade = skillLevels.findIndex(level => {
  //   return level === user_grade
  // })
  const difference = user_grade - word_level // userGrade - wordDifficulty
  const difference_intval = Math.abs(difference) / skillLevels.length

  const rgbMin = 'rgb(255, 255, 255)'
  let rgbMax = 'rgb(255, 255, 255)'
  if (difference <= 0) rgbMax = 'rgb(252, 108, 133)'
  // '#90ef90',
  else rgbMax = 'rgb(144, 239, 144)' // '#fc6c85',

  // (difference + skillLevels.length) / (2*skillLevels.length)
  const word_rgb = colorInterpolate(rgbMin, rgbMax, difference_intval)
  return ConvertRGBtoHex(word_rgb.r, word_rgb.g, word_rgb.b)
}

/*
export const capitalize = (word = '') => {
  const firstLetter = word.slice(0, 1).toUpperCase()
  const wordEnd = word.slice(1, word.length)
  return `${firstLetter}${wordEnd}`
}
*/

export const learningLanguageSelector = ({ user }) =>
  user.data ? user.data.user.last_used_language : null
export const dictionaryLanguageSelector = ({ user }) => user.data.user.last_trans_language

export const useLearningLanguage = () => useSelector(learningLanguageSelector)
export const useDictionaryLanguage = () => useSelector(dictionaryLanguageSelector)
export const useMTAvailableLanguage = () => useSelector(({ contextTranslation }) => contextTranslation.avail)
export const useCurrentUser = () => useSelector(({ user }) => user.data.user)

export const supportedLearningLanguages = {
  major: ['finnish', 'russian'].sort((a, b) => a.localeCompare(b)),
  majorBeta: [
    'german',
    'kazakh',
    'catalan',
    'spanish',
    'swedish',
    'italian',
    'french',
    'portuguese',
    'chinese',
    'turkish',
    'english',
  ].sort((a, b) => a.localeCompare(b)),
  minor: [
    'erzya',
    'komi-zyrian',
    'meadow-mari',
    'north-saami',
    'sakha',
    'tatar',
    'tatar-new',
    'udmurt',
    'udmurt-arch',
    'livvi',
  ].sort((a, b) => a.localeCompare(b)),
  experimental: ['syriac'],
}

export const learningLanguageLocaleCodes = {
  Finnish: 'fi',
  German: 'de',
  Russian: 'ru',
  Kazakh: 'kz',
  Catalan: 'ca',
  Spanish: 'es',
  Swedish: 'sv',
  Italian: 'it',
  French: 'fr',
  Portuguese: 'pt',
  Erzya: 'myv',
  'Komi-Zyrian': 'kpv',
  'Meadow-Mari': 'mhr',
  'North-Saami': 'se',
  Sakha: 'ru-sa',
  Tatar: 'tt',
  'Tatar-New': 'tt',
  Udmurt: 'udm',
  Turkish: 'tr',
  Syriac: 'syc',
  Chinese: 'zh',
  'Udmurt-Arch': 'udm',
  livvi: 'olo',
  English: 'en',
}

export const betaLanguages = [
  'catalan',
  'chinese',
  'erzya',
  'french',
  'german',
  'kazakh',
  'italian',
  'komi-zyrian',
  'meadow-mari',
  'portuguese',
  'spanish',
  'swedish',
  'north-saami',
  'sakha',
  'syriac',
  'tatar',
  'tatar-new',
  'turkish',
  'udmurt',
  'udmurt-arch',
  'livvi',
  'english',
]

export const exerciseMaskedLanguages = ['Chinese']

export const colors = {}

export const flashcardColors = {
  background: ['#F3826A', '#FEA75C', '#F9E79F', '#84C3A3', '#50A278'],
  foreground: ['#055A5B', '#055A5B', '#055A5B', '#055A5B', '#055A5B'],
}

const stagingOptions = [
  { displayName: 'Suomi', name: 'Finnish', code: 'fi' },
  { displayName: 'Svenska', name: 'Swedish', code: 'sv' },
  { displayName: 'Русский', name: 'Russian', code: 'ru' },
  { displayName: 'Українська', name: 'Ukrainian', code: 'uk' },
  { displayName: 'English', name: 'English', code: 'en' },
  { displayName: 'Italiano', name: 'Italian', code: 'it' },
  { displayName: '简体中文', name: 'Chinese', code: 'zh' },
]

const prodOptions = [
  { displayName: 'Suomi', name: 'Finnish', code: 'fi' },
  // { displayName: 'Svenska', name: 'Swedish', code: 'sv' },
  { displayName: 'Русский', name: 'Russian', code: 'ru' },
  { displayName: 'Українська', name: 'Ukrainian', code: 'uk' },
  { displayName: 'English', name: 'English', code: 'en' },
  { displayName: 'Italiano', name: 'Italian', code: 'it' },
  { displayName: '简体中文', name: 'Chinese', code: 'zh' },
]

export const localeOptions = hiddenFeatures ? stagingOptions : prodOptions

export const localeNameToCode = name => {
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

export const downloadReadingReport = async (groupId, startDate, endDate) => {
  //TODO: generalize downloading from BE properly
  const result = await callApi(`/groups/${groupId}/reading_report?start_date=${startDate}&end_date=${endDate}`)
  const blob = new Blob([result.data], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a")
  link.download = "report.tsv"
  link.href = url
  link.click()
}

export const getMode = () => useHistory().location.pathname.split('/').filter(x=>x.length).pop()

const defaultAllowed = [
  'b',
  'i',
  'u',
  'em',
  'strong',
  'br',
  'mark',
  'small',
  'sub',
  'sup',
  'ins',
  'del',
  'h3',
  'br',
  'ul',
  'li',
]

export const sanitizeHtml = (dirty, allowedTags = defaultAllowed) => {
  const defaultOptions = { allowedTags }
  return { __html: sanitize(dirty, defaultOptions) }
}

export const formatGreenFeedbackText = text =>
  sanitizeHtml(text?.replace(/[.]{2,}/g, '.')?.replace(/([^0-9])([\.。])[\s]*/g, '$1$2<br />'))

export const formatEmailList = emailListAsString => {
  const separators = [' ', ',', ';']

  return emailListAsString
    .trim()
    .toLowerCase()
    .split(new RegExp(`[${separators.join('')}]`, 'g'))
    .map(p => p.trim())
}

export * from '@root/config/common'

export const rightAlignedLanguages = ['Syriac']

export const specialFonts = { Syriac: { fontFamily: 'NotoSansSyriacEastern', fontSize: '1.7rem' } }
export const titleFontSizes = { Syriac: '2rem' }
export const tooltipFontSizes = { Syriac: '1rem' }

export const getTextStyle = (language, type) => {
  let style = {}

  if (type !== 'title') {style = { fontSize: '1.15rem' }}

  if (rightAlignedLanguages.includes(language)) style = { textAlign: 'right', direction: 'rtl' }
  if (specialFonts[language]) style = { ...style, ...specialFonts[language] }
  if (type === 'title' && titleFontSizes[language]) {
    style = { ...style, fontSize: titleFontSizes[language] }
  }
  if (type === 'tooltip' && tooltipFontSizes[language]) {
    style = { ...style, fontSize: tooltipFontSizes[language] }
  }
  return style
}

export const getBackgroundColor = () => {
  const history = useHistory()
  const mainView =
    history.location.pathname.includes('/home') || history.location.pathname.includes('/welcome')
  return mainView ? 'blue-bg' : 'grey-bg'
}

export const getTextWidth = (text, fontFamily='Arial') => {
  const myCanvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
  const context = myCanvas.getContext('2d')
  context.font = '1em ' + fontFamily // This should match with the defaultFont defined in custom.scss

  const metrics = context.measureText(text)
  return 65 + metrics.width // add just random number, lets hope its fine.
}

export const consistsOfOnlyWhitespace = text => {
  if (text.match(/^\s+$/g)) return true
  return false
}

export const speak = (surfaceWord, voice, voice_type, resource_usage, nRepeat = 0) => {
  const [source, lang_code, tone] = voice
  window.responsiveVoice.cancel()
  Howler.stop()
  try {
    if (source === 'responsive_voice' && window.responsiveVoice.voiceSupport())
      RVSpeak(surfaceWord, lang_code, tone, voice_type)
    else if (
      source === 'yandex' &&
      Howler.codecs('opus') &&
      (resource_usage.tts.Yandex?.access ?? true)
    )
      yandexSpeak(surfaceWord, lang_code, tone, voice_type, String(1.1 - nRepeat % 3 * 0.2).slice(0,3))
    else if (source === 'tacotron2' && Howler.codecs('mp3') && surfaceWord.length > 4)
      tacotronSpeak(surfaceWord, lang_code, tone, voice_type, 0 - ((nRepeat * 3) % 6))
    else if (source === 'coqui_ai' && Howler.codecs('mp3') && surfaceWord.length > 4)
      coquiSpeak(surfaceWord, lang_code, tone, voice_type)
    else if (speakFallbackConfig.hasOwnProperty(voice.join('-')))
      speak(surfaceWord, speakFallbackConfig[voice.join('-')], voice_type, resource_usage)
  } catch (e) {
    console.log(`Failed to speak ${surfaceWord} in ${capitalize(`${lang_code} ${tone}`)}`)
  }
}

export const normalizeDiacritics = word => {
  return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export const levenshteinDistance = (a, b) => {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  // swap to save some memory O(min(a,b)) instead of O(a)
  if (a.length > b.length) {
    const tmp = a
    a = b
    b = tmp
  }

  const row = []

  for (let i = 0; i <= a.length; i++) {
    row[i] = i
  }

  // fill in the rest
  for (let i = 1; i <= b.length; i++) {
    let prev = i
    for (let j = 1; j <= a.length; j++) {
      let val
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        val = row[j - 1]
      } else {
        val = Math.min(
          row[j - 1] + 1, // substitution
          prev + 1, // insertion
          row[j] + 1 // deletion
        )
      }
      row[j - 1] = prev
      prev = val
    }
    row[a.length] = prev
  }

  return row[a.length]
}

export const voiceLanguages = {
  Catalan: ['responsive_voice', 'Catalan', 'Male'],
  Finnish: ['tacotron2', 'fin', 'Female'],
  French: ['responsive_voice', 'French', 'Female'],
  German: ['responsive_voice', 'Deutsch', 'Female'],
  Italian: ['responsive_voice', 'Italian', 'Female'],
  Portuguese: ['responsive_voice', 'Portuguese', 'Female'],
  Russian: ['yandex', 'ru-RU', 'alena'],
  Spanish: ['responsive_voice', 'Spanish', 'Female'],
  Swedish: ['responsive_voice', 'Swedish', 'Female'],
  Turkish: ['responsive_voice', 'Turkish', 'Female'],
  Chinese: ['responsive_voice', 'Chinese', 'Female'],
  English: ['responsive_voice', 'US English', 'Female'], //['coqui_ai', 'eng', 'none'],
}

const speakFallbackConfig = {
  'yandex-ru-RU-alena': ['responsive_voice', 'Russian', 'Female'],
  'tacotron2-fin-Female': ['responsive_voice', 'Finnish', 'Female'],
  'coqui_ai-eng-none': ['responsive_voice', 'US English', 'Female'],
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
  English: [
    'Finnish',
    'French',
    'German',
    'Russian',
    'Spanish',
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
  'Komi-Zyrian': ['Russian'],
  'Meadow-Mari': ['Russian'],
  Udmurt: ['Russian'],
  'Udmurt-Arch': ['Russian'],
  Sakha: ['Russian', 'English'],
  'North-Saami': ['Finnish', 'Norwegian'],
  Erzya: ['Russian'],
  Kazakh: ['Russian', 'English'],
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
  'Tatar-New': [
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
  Livvi: ['Finnish'],
  Syriac: [],
  Chinese: [
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
    'Japanese',
    'Hindi',
  ],
}

const tourSign = () => {
  return (
    <img
      src={direction}
      alt="start"
      style={{ maxWidth: '20%', maxHeight: '20%', marginTop: '25px', marginLeft: '5px' }}
    />
  )
}


export const getHelpLink = (locale, isTeacher, learningLanguage) => {
  const interface_language = localeCodeToName(locale)
  if (isTeacher && interface_language == 'Russian' && learningLanguage == 'Finnish') 
    return 'https://docs.google.com/presentation/d/1MKh8e15yEziO4iJtG2-rovP4nRMciUS8cCSpy4KnsUg/edit?usp=drive_link'
  else if (isTeacher && interface_language == 'English' && learningLanguage == 'Finnish')
    return 'https://docs.google.com/presentation/d/16wRAQjgfRIqkXig9JAxkC3Ll1Zoi35P0chjG3KO_cgI/edit?usp=drive_link'
  else if (isTeacher && interface_language == 'Russian' && learningLanguage == 'Russian')
    return 'https://docs.google.com/presentation/d/1lORT0jD_UOxzDI7Tar2k_5nyYXSkp8r8Ywa-njpS2uk/edit?usp=drive_link'
  else if (isTeacher && interface_language == 'Finnish' && learningLanguage == 'Finnish')
    return 'https://docs.google.com/presentation/d/11zzFn62Xl1dYxA0GSYOjls7cVH7hqZstjha5GOnO1m4/edit?usp=drive_link'
  else if (!isTeacher && interface_language == 'Chinese' && learningLanguage == 'Russian')
    return 'https://docs.google.com/presentation/d/1JtCkK1x48ZuC3URpMAJShQwdI9qBel8A35heXuJ7NFs/edit?usp=drive_link'
  else if (!isTeacher && interface_language == 'Russian' && learningLanguage == 'Finnish')
    return 'https://docs.google.com/presentation/d/16g-k_DupoDkf814LVjQVy7u7hGsS6Rh255DaWUN0ywQ/edit?usp=drive_link'
  else if (!isTeacher && interface_language == 'Finnish' && learningLanguage == 'Finnish')
    return 'https://docs.google.com/presentation/d/1hOOekSdDC3MeIJoWphPDg3xk3LTJ16jsFQ5fJKrhxGQ/edit?usp=drive_link'
  else if (!isTeacher && interface_language == 'English' && learningLanguage == 'Finnish')
    return 'https://docs.google.com/presentation/d/1qZ9syaJZVgUXgr0DATDehJl-xefZSA2C6yZnkN6NyiY/edit?usp=drive_link'
  else if (!isTeacher && interface_language == 'English' && learningLanguage == 'Russian')
    return 'https://docs.google.com/presentation/d/1OSNXy5cydhqMRqRO4I2csG2DqN70Po1HTW-3DYJMxZ8/edit?usp=drive_link'
  else return '/help'
}

/////////////////////////////////////////////////////////
// OLD tour item #3
//-   {
//-     target: '.tour-add-new-stories',
//-     title: <FormattedMessage id="add-content" />,
//-     content: (
//-       <div style={{ position: 'realitive' }}>
//-         <Sparkle flicker={false} />
//-         <FormattedHTMLMessage id="tour-add-content-message" />
//-       </div>
//-     ),
//-     placement: 'top',
//-     disableBeacon: true,
//-     styles: {
//-       tooltipContainer: {
//-         textAlign: 'left',
//-       },
//-       options: {
//-         arrowColor: 'rgb(50, 170, 248)',
//-         primaryColor: 'rgb(50, 170, 248)',
//-         backgroundColor: 'rgb(50, 170, 248',
//-         zIndex: 1000,
//-         textColor: 'white',
//-       },
//-       buttonNext: {
//-         backgroundColor: 'white',
//-         borderRadius: 8,
//-         color: 'black',
//-       },
//-     },
//-   },
/////////////////////////////////////////////////////////


const desktopHomeTourSteps = [
  {
    target: '.tour-start-finish',
    title: <FormattedMessage id="welcome" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-welcome-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.tour-navbar-learning-language',
    title: <FormattedMessage id="Learning-language" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-learning-language-message" />
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    disableBeacon: true,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    target: '.tour-sidebar',
    title: <FormattedMessage id="sidebar" />,
    content: (
      <div className="tour-mobile-message">
        <FormattedHTMLMessage id="tour-sidebar-message" />
      </div>
    ),
    textAlign: 'center',
    placement: 'bottom',
    disableBeacon: true,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    target: '.tour-library',
    title: <FormattedMessage id="Library" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-library-message" />
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    disableBeacon: true,
  },
  {
    target: '.tour-lesson',
    title: <FormattedMessage id="Lessons" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-lessons-message" />
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    disableBeacon: true,
  },
  {
    target: '.tour-practice-now',
    title: <FormattedMessage id="practice-now" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-practice-now-message" />
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    disableBeacon: true,
  },
  {
    target: '.tour-flashcards',
    title: <FormattedMessage id="Flashcards" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-flashcards-message" />
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    disableBeacon: true,
  },
  {
    target: '.tour-progress',
    title: <FormattedMessage id="Progress" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-progress-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.tour-help',
    title: <FormattedMessage id="tour-step9-HELP-header" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-step9-HELP-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'top',
    opacity: 0,
    disableBeacon: true,
  },
  {
    target: '.tour-button',
    title: <FormattedMessage id="begin-practicing" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-begin-practicing-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'top',
    opacity: 0,
    disableBeacon: true,
  },
]



/////////////////////////////////////////////////////////
const mobileHomeTourSteps = [
  {
    target: '.tour-start-finish',
    title: <FormattedMessage id="welcome" />,
    content: (
      <div className="tour-mobile-message">
        <FormattedHTMLMessage id="tour-welcome-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.tour-sidebar',
    title: <FormattedMessage id="sidebar" />,
    content: (
      <div className="tour-mobile-message">
        <FormattedHTMLMessage id="tour-sidebar-message" />
      </div>
    ),
    textAlign: 'center',
    placement: 'bottom',
    disableBeacon: true,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    target: '.tour-learning-language',
    title: <FormattedMessage id="Learning-language" />,
    content: (
      <div className="tour-mobile-message">
        <FormattedHTMLMessage id="tour-learning-language-message" />
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    disableBeacon: true,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    target: '.tour-add-new-stories',
    title: <FormattedMessage id="add-content" />,
    content: (
      <div className="tour-mobile-message" style={{ position: 'realitive' }}>
        <Sparkle flicker={false} />
        <FormattedHTMLMessage id="tour-add-content-message" />
      </div>
    ),
    placement: 'top',
    disableBeacon: true,
    styles: {
      tooltipContainer: {
        textAlign: 'left',
      },
      options: {
        arrowColor: 'rgb(50, 170, 248)',
        primaryColor: 'rgb(50, 170, 248)',
        backgroundColor: 'rgb(50, 170, 248',
        zIndex: 1000,
        textColor: 'white',
      },
      buttonNext: {
        backgroundColor: 'white',
        borderRadius: 8,
        color: 'black',
      },
    },
  },
  {
    target: '.tour-library',
    title: <FormattedMessage id="Library" />,
    content: (
      <div className="tour-mobile-message">
        <FormattedHTMLMessage id="tour-library-message" />
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    disableBeacon: true,
  },
  {
    target: '.tour-lesson',
    title: <FormattedMessage id="Lessons" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-lessons-message" />
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    disableBeacon: true,
  },
  {
    target: '.tour-practice-now',
    title: <FormattedMessage id="practice-now" />,
    content: (
      <div className="tour-mobile-message">
        <FormattedHTMLMessage id="tour-practice-now-message" />
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    disableBeacon: true,
  },
  {
    target: '.tour-flashcards',
    title: <FormattedMessage id="Flashcards" />,
    content: (
      <div className="tour-mobile-message">
        <FormattedHTMLMessage id="tour-flashcards-message" />
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    disableBeacon: true,
  },
  {
    target: '.tour-progress',
    title: <FormattedMessage id="Progress" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-progress-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.tour-mobile-start-button',
    title: <FormattedMessage id="begin-practicing" />,
    content: (
      <div className="tour-mobile-message">
        <FormattedHTMLMessage id="tour-begin-practicing-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    disableBeacon: true,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
]


/////////////////////////////////////////////////////////
const desktopProgressTourSteps = [
  {
    target: '.progress-button',
    title: <FormattedMessage id="Welcome to the Progress page" />,
    content: (
      <div>
        <FormattedHTMLMessage id="progress-tour-welcome-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.progress-tour-timeline-button',
    title: <FormattedMessage id="progress-timeline" />,
    content: <FormattedHTMLMessage id="timeline-explanation" />,
  },
  {
    target: '.date-pickers-container',
    title: <FormattedMessage id="Dates" />,
    content: (
      <div>
        <FormattedHTMLMessage id="progress-tour-dates-message" />
      </div>
    ),
    placement: 'left',
  },
  {
    target: '.progress-tour-vocabulary-button',
    title: <FormattedMessage id="vocabulary-view" />,
    content: <FormattedHTMLMessage id="vocabulary-view-explanation" />,
  },
  {
    target: '.progress-tour-grammar-button',
    title: <FormattedMessage id="hex-map" />,
    content: <FormattedMessage id="hex-map-explanation" />,
  },
  {
    target: '.progress-tour-exercise-history-button',
    title: <FormattedMessage id="exercise-history" />,
    content: <FormattedMessage id="exercise-history-explanation" />,
  },
  {
    target: '.progress-tour-test-history-button',
    title: <FormattedMessage id="Test History" />,
    content: <FormattedMessage id="test-history-explanation" />,
  },
  {
    target: '.tour-button',
    title: <FormattedMessage id="Tour end" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-end-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    disableBeacon: true,
  },
]


/////////////////////////////////////////////////////////
const mobileProgressTourSteps = [
  {
    target: '.sidebar-profile-button',
    title: <FormattedMessage id="Welcome to the Progress page" />,
    content: (
      <div>
        <FormattedHTMLMessage id="progress-tour-welcome-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    disableBeacon: true,
    placement: 'right',
  },
  {
    target: '.progress-page-graph-cont',
    title: <FormattedMessage id="Timeline" />,
    content: <FormattedHTMLMessage id="timeline-explanation" />,
  },
  {
    target: '.date-pickers-container',
    title: <FormattedMessage id="Dates" />,
    content: (
      <div>
        <FormattedHTMLMessage id="progress-tour-dates-message" />
      </div>
    ),
    placement: 'left',
  },
  {
    target: '.tour-mobile-start-button',
    title: <FormattedMessage id="Tour end" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-end-message" />
        <div>
          <img
            src={direction}
            alt="start"
            style={{ maxWidth: '20%', maxHeight: '20%', marginTop: '25px', marginLeft: '5px' }}
          />
        </div>
      </div>
    ),
    placement: 'top-end',
    placementBeacon: 'left',
  },
]


/////////////////////////////////////////////////////////
const anonymousDesktopProgressTourSteps = [
  {
    target: '.navbar-register-button',
    title: <FormattedMessage id="Welcome to the Progress page" />,
    content: (
      <div>
        <FormattedHTMLMessage id="anonymous-progress-tour-message" />
      </div>
    ),
    disableBeacon: true,
    placement: 'right',
  },
]

const anonymousMobileProgressTourSteps = [
  {
    target: '.sidebar-register-button',
    title: <FormattedMessage id="Welcome to the Progress page" />,
    content: (
      <div>
        <FormattedHTMLMessage id="anonymous-progress-tour-message" />
      </div>
    ),
    disableBeacon: true,
    placement: 'right',
  },
]


/////////////////////////////////////////////////////////
const desktopLibraryTourSteps = [
  {
    target: '.library-tour-start',
    title: <FormattedMessage id="Welcome to the Library page" />,
    content: (
      <div>
        <FormattedHTMLMessage id="library-tour-welcome-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.tour-story-card',
    title: <FormattedMessage id="Story" />,
    content: (
      <div>
        <FormattedHTMLMessage id="library-tour-story-message" />
      </div>
    ),
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '.library-tour-difficulty-stars',
    title: <FormattedMessage id="Difficulty stars" />,
    content: (
      <div>
        <FormattedHTMLMessage id="library-tour-stars-message" />
      </div>
    ),
    disableBeacon: true,
    placement: 'top',
    placementBeacon: 'left',
  },
  {
    target: '.library-tour-practice-button',
    title: <FormattedMessage id="practice" />,
    content: (
      <div>
        <FormattedHTMLMessage id="library-tour-practice-message" />
      </div>
    ),
    disableBeacon: true,
    placement: 'top',
    placementBeacon: 'left',
  },
  {
    target: '.library-tour-review-button',
    title: <FormattedMessage id="review" />,
    content: (
      <div>
        <FormattedHTMLMessage id="library-tour-review-message" />
      </div>
    ),
    placement: 'top',
    placementBeacon: 'left',
  },
  {
    target: '.tour-button',
    title: <FormattedMessage id="Tour end" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-end-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    disableBeacon: true,
  },
]


/////////////////////////////////////////////////////////
const mobileLibraryTourSteps = [
  {
    target: '.library-tour-start',
    title: <FormattedMessage id="Welcome to the Library page" />,
    content: (
      <div>
        <FormattedHTMLMessage id="library-tour-welcome-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.tour-story-card',
    title: <FormattedMessage id="Story" />,
    content: (
      <div>
        <FormattedHTMLMessage id="library-tour-story-message" />
      </div>
    ),
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '.library-tour-difficulty-stars',
    title: <FormattedMessage id="Difficulty stars" />,
    content: (
      <div>
        <FormattedHTMLMessage id="library-tour-stars-message" />
      </div>
    ),
    disableBeacon: true,
    placement: 'top',
    placementBeacon: 'left',
  },
  {
    target: '.library-tour-mobile-practice-button',
    title: <FormattedMessage id="practice" />,
    content: (
      <div>
        <FormattedHTMLMessage id="library-tour-practice-message" />
      </div>
    ),
    disableBeacon: true,
    placement: 'top',
    placementBeacon: 'left',
  },
  /*
  {
    target: '.library-tour-mobile-review-button',
    title: <FormattedMessage id="review" />,
    content: (
      <div>
        <FormattedHTMLMessage id="library-tour-review-message" />
      </div>
    ),
    disableBeacon: true,
    placement: 'top',
    placementBeacon: 'left'
  },
  */
  {
    target: '.tour-mobile-start-button',
    title: <FormattedMessage id="Tour end" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-end-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
]


/////////////////////////////////////////////////////////
const desktopPracticeTourSteps = [
  {
    target: '.tour-button',
    title: <FormattedMessage id="Welcome to the Practice mode" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-welcome-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '.story-topics-box',
    title: <FormattedMessage id="Story Topics Box" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-topics-message" />
      </div>
    ),
    disableBeacon: true,
    placement: 'left',
  },
  {
    target: '.dictionary-help',
    title: <FormattedMessage id="Translations" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-translations-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.practice-tour-start-practice',
    title: <FormattedMessage id="Start Practicing" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-start-practice-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.practice-container',
    title: <FormattedMessage id="Exercises" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-exercise-box-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.exercise',
    title: <FormattedMessage id="Exercise" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-exercise-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.attempt-bar',
    title: <FormattedMessage id="check-answer" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-check-answers-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.progress-bar-cont',
    title: <FormattedMessage id="Progress bar" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-progress-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.navbar-basic-item',
    title: <FormattedMessage id="ELO score" />,
    content: (
      <div>
        <FormattedHTMLMessage id="explanations-popup-story-elo" />
      </div>
    ),
  },
  {
    target: '.tour-button',
    title: <FormattedMessage id="Tour end" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-end-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    disableBeacon: true,
  },
]

const mobilePracticeTourSteps = [
  {
    target: '.tour-start-finish',
    title: <FormattedMessage id="Welcome to the Practice mode" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-welcome-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '.mobile-practice-tour-word',
    title: <FormattedMessage id="Translations" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-mobile-translations-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.practice-tour-start-practice',
    title: <FormattedMessage id="Start Practicing" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-start-practice-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.practice-container',
    title: <FormattedMessage id="Exercises" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-exercise-box-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.exercise',
    title: <FormattedMessage id="Exercise" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-exercise-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.attempt-bar',
    title: <FormattedMessage id="check-answer" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-check-answers-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.progress-bar-cont',
    title: <FormattedMessage id="Progress bar" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-progress-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.navbar-basic-item',
    title: <FormattedMessage id="ELO score" />,
    content: (
      <div>
        <FormattedHTMLMessage id="explanations-popup-story-elo" />
      </div>
    ),
  },
  {
    target: '.tour-mobile-start-button',
    title: <FormattedMessage id="Tour end" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-end-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
]

/////////////////////////////////////////////////////////
const desktopLessonsTourSteps = [
  {
    target: '.cont-tall',
    title: <FormattedMessage id="Welcome to the Lessons mode" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-lessons-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '.lesson-story-topic',
    title: <FormattedMessage id="Lesson setup" />,
    content: (
      <div>
        <FormattedHTMLMessage id="lesson-story-topic-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.lesson-vocab-diff',
    title: <FormattedMessage id="Lesson vocab" />,
    content: (
      <div>
        <FormattedHTMLMessage id="lesson-vocab-diff-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.choose-topic',
    title: <FormattedMessage id="Lesson topic" />,
    content: (
      <div>
        <FormattedHTMLMessage id="lesson-topic-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.lesson-content',
    title: <FormattedMessage id="Grammar topics" />,
    content: (
      <div>
        <FormattedHTMLMessage id="grammar-topics-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.lesson-performance',
    title: <FormattedMessage id="Grammar performance" />,
    content: (
      <div>
        <FormattedHTMLMessage id="grammar-performance-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.StepperContainer-0-2-1',
    title: <FormattedMessage id="Reset Lesson" />,
    content: (
      <div>
        <FormattedHTMLMessage id="reset-lesson-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.lesson-practice',
    title: <FormattedMessage id="Practice lesson" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-lesson-message" />
      </div>
    ),
    disableBeacon: true,
  },
  // {
  //   target: '.practice-container',
  //   title: <FormattedMessage id="Lesson exercise" />,
  //   content: (
  //     <div>
  //       <FormattedHTMLMessage id="grammar-practice-message" />
  //     </div>
  //   ),
  //   disableBeacon: true,
  // },
  {
    target: '.tour-button',
    title: <FormattedMessage id="Tour end" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-end-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    disableBeacon: true,
  },
]
const mobileLessonsTourSteps = [
  {
    target: '.cont-tall',
    title: <FormattedMessage id="Welcome to the Lessons mode" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-lessons-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '.lesson-story-topic',
    title: <FormattedMessage id="Lesson setup" />,
    content: (
      <div>
        <FormattedHTMLMessage id="lesson-story-topic-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.lesson-vocab-diff',
    title: <FormattedMessage id="Lesson vocab" />,
    content: (
      <div>
        <FormattedHTMLMessage id="lesson-vocab-diff-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.choose-topic',
    title: <FormattedMessage id="Lesson topic" />,
    content: (
      <div>
        <FormattedHTMLMessage id="lesson-topic-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.lesson-content',
    title: <FormattedMessage id="Grammar topics" />,
    content: (
      <div>
        <FormattedHTMLMessage id="grammar-topics-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.lesson-performance',
    title: <FormattedMessage id="Grammar performance" />,
    content: (
      <div>
        <FormattedHTMLMessage id="grammar-performance-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.StepperContainer-0-2-1',
    title: <FormattedMessage id="Reset Lesson" />,
    content: (
      <div>
        <FormattedHTMLMessage id="reset-lesson-message" />
      </div>
    ),
    disableBeacon: true,
  },
  {
    target: '.lesson-practice',
    title: <FormattedMessage id="Practice lesson" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-lesson-message" />
      </div>
    ),
    disableBeacon: true,
  },
  // {
  //   target: '.practice-container',
  //   title: <FormattedMessage id="Lesson exercise" />,
  //   content: (
  //     <div>
  //       <FormattedHTMLMessage id="lesson-exercise-message" />
  //     </div>
  //   ),
  //   disableBeacon: true,
  // },
  {
    target: '.tour-mobile-start-button',
    title: <FormattedMessage id="Tour end" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-end-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
]

// Slice the tour steps to only include practice view
// steps and not preview view steps
export const practiceTourStepsAlternative =
  window.innerWidth >= 700 ? desktopPracticeTourSteps.slice(4) : mobilePracticeTourSteps.slice(3)
export const practiceTourSteps =
  window.innerWidth >= 700 ? desktopPracticeTourSteps : mobilePracticeTourSteps
export const progressTourSteps =
  window.innerWidth >= 700 ? desktopProgressTourSteps : mobileProgressTourSteps
export const anonymousProgressTourSteps =
  window.innerWidth >= 700 ? anonymousDesktopProgressTourSteps : anonymousMobileProgressTourSteps
export const homeTourSteps = window.innerWidth >= 700 ? desktopHomeTourSteps : mobileHomeTourSteps
export const libraryTourSteps =
  window.innerWidth >= 700 ? desktopLibraryTourSteps : mobileLibraryTourSteps
export const lessonsTourSteps =
  window.innerWidth >= 700 ? desktopLessonsTourSteps : mobileLessonsTourSteps
