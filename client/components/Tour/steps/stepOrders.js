// Pure-data step ordering tables for every tour. No JSX, no path aliases —
// safe to import from Cypress (which uses its own webpack, not Vite). Each
// `*Steps.js` re-exports its `STEP_ORDER` from here so there's still one
// source of truth.

export const homeOrder = {
  desktopStudent: [
    'welcome',
    'sideBar',
    'learningLanguage',
    'practiceNow',
    'library',
    'lesson',
    'flashcards',
    'progress',
    'chatbot',
    'help',
    'beginPracticing',
  ],
  desktopTeacher: [
    'welcome',
    'sideBar',
    'learningLanguage',
    'addNewStories',
    'library',
    'lesson',
    'chatbot',
    'help',
    'beginPracticing',
  ],
  mobileStudent: [
    'welcome',
    'sideBar',
    'library',
    'lesson',
    'practiceNow',
    'flashcards',
    'progress',
    'chatbot',
    'help',
  ],
  mobileTeacher: ['welcome', 'sideBar', 'library', 'lesson', 'chatbot', 'help'],
}

export const libraryOrder = {
  desktopStudent: ['welcome', 'story', 'stars', 'practiceOrPreview', 'desktopEnd'],
  desktopTeacher: ['welcome', 'story', 'stars', 'practiceOrPreview', 'review', 'desktopEnd'],
  mobileStudent: ['welcome', 'story', 'stars', 'practiceOrPreview', 'mobileEnd'],
  mobileTeacher: ['welcome', 'story', 'stars', 'practiceOrPreview', 'mobileEnd'],
}

const progressDesktop = [
  'welcomeDesktop',
  'timelineButton',
  'dates',
  'vocabulary',
  'grammar',
  'exerciseHistory',
  'testHistory',
  'desktopEnd',
]
const progressMobile = ['welcomeMobile', 'timelineMobile', 'dates', 'mobileEnd']

export const progressOrder = {
  desktopStudent: progressDesktop,
  desktopTeacher: progressDesktop,
  mobileStudent: progressMobile,
  mobileTeacher: progressMobile,
}

const inPracticeView = ['exerciseBox', 'exercise', 'checkAnswers', 'progressBar', 'eloScore']

export const practiceOrder = {
  desktopStudent: [
    'welcomeDesktop',
    'topics',
    'translations',
    'storyAction',
    ...inPracticeView,
    'desktopEnd',
  ],
  desktopTeacher: ['welcomeDesktop', 'topics', 'translations', 'storyAction', 'desktopEnd'],
  mobileStudent: [
    'welcomeMobile',
    'translationsMobile',
    'startPracticeMobile',
    ...inPracticeView,
    'mobileEnd',
  ],
  mobileTeacher: [
    'welcomeMobile',
    'translationsMobile',
    'startPracticeMobile',
    ...inPracticeView,
    'mobileEnd',
  ],
}

export const practiceAltOrder = {
  desktopStudent: [...inPracticeView, 'desktopEnd'],
  desktopTeacher: [...inPracticeView, 'desktopEnd'],
  mobileStudent: [...inPracticeView, 'mobileEnd'],
  mobileTeacher: [...inPracticeView, 'mobileEnd'],
}

const lessonsSetup = [
  'storyTopic',
  'vocab',
  'topic',
  'customGrammar',
  'levelTitle',
  'grammarTopics',
]

export const lessonsOrder = {
  desktopStudent: ['welcome', ...lessonsSetup, 'performance', 'resetLesson', 'practiceLesson', 'desktopEnd'],
  desktopTeacher: ['welcome', ...lessonsSetup, 'resetLesson', 'practiceLesson', 'desktopEnd'],
  mobileStudent: ['welcome', ...lessonsSetup, 'performance', 'resetLesson', 'practiceLesson', 'mobileEnd'],
  mobileTeacher: ['welcome', ...lessonsSetup, 'resetLesson', 'practiceLesson', 'mobileEnd'],
}

export const anonymousProgressOrder = {
  desktopStudent: ['register'],
  desktopTeacher: ['register'],
  mobileStudent: ['register'],
  mobileTeacher: ['register'],
}
