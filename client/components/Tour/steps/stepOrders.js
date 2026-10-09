// Pure-data step orders and targets for every tour. No JSX, no path aliases — safe to import
// from Cypress, which checks each shown step's spotlight against these same targets.

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
  desktopStudent: ['welcome', 'lessonStartButton', 'lessonSetupButton', ...lessonsSetup, 'performance', 'resetLesson', 'practiceLesson', 'desktopEnd'],
  desktopTeacher: ['welcome', ...lessonsSetup, 'resetLesson', 'practiceLesson', 'desktopEnd'],
  mobileStudent: ['welcome', 'lessonStartButton', 'lessonSetupButton', ...lessonsSetup, 'performance', 'resetLesson', 'practiceLesson', 'mobileEnd'],
  mobileTeacher: ['welcome', ...lessonsSetup, 'resetLesson', 'practiceLesson', 'mobileEnd'],
}

export const anonymousProgressOrder = {
  desktopStudent: ['register'],
  desktopTeacher: ['register'],
  mobileStudent: ['register'],
  mobileTeacher: ['register'],
}

// Steps whose targets render only for high-access users: the assistant sidebar (chatbot, topics,
// translations) and lessons. Anonymous and other users never see them, so their tours drop them.
export const highAccessSteps = {
  home: ['lesson', 'chatbot'],
  practice: ['topics', 'translations'],
}

// The order a user actually walks: without high access, the steps they cannot see are left out.
export const visibleOrder = (order, hiddenIds = [], highAccess = true) =>
  highAccess ? order : order.filter(id => !hiddenIds.includes(id))

// ── Step targets ───────────────────────────────────────────────────────────
// Each tour's step id → the selector its tooltip points at. The `*Steps.js` blueprints read their
// `target` from here, so the walkthrough tests assert against exactly what the app uses.

// The shared last step points at the start-tour row in the left sidebar.
const sharedEndTarget = '.tour-shared-end'
export const endTargets = { desktopEnd: sharedEndTarget, mobileEnd: sharedEndTarget }

export const homeTargets = {
  welcome: '.tour-home-welcome',
  sideBar: '.tour-home-sidebar',
  learningLanguage: '.tour-home-learning-language',
  addNewStories: '.tour-home-add-new-stories',
  library: '.tour-home-library',
  lesson: '.tour-home-lesson',
  practiceNow: '.tour-home-practice-now',
  flashcards: '.tour-home-flashcards',
  progress: '.tour-home-progress',
  chatbot: '.tour-home-chatbot',
  help: '.tour-home-help',
  beginPracticing: '.tour-home-begin-practicing',
}

export const libraryTargets = {
  ...endTargets,
  welcome: '.tour-library-welcome',
  story: '.tour-library-story',
  stars: '.tour-library-stars',
  practiceOrPreview: '.tour-library-practice-or-preview',
  review: '.tour-library-review',
}

export const progressTargets = {
  ...endTargets,
  welcomeDesktop: '.tour-progress-welcome',
  welcomeMobile: '.tour-progress-welcome',
  timelineButton: '.tour-progress-timeline-button',
  timelineMobile: '.tour-progress-timeline-mobile',
  dates: '.tour-progress-dates',
  vocabulary: '.tour-progress-vocabulary',
  grammar: '.tour-progress-grammar',
  exerciseHistory: '.tour-progress-exercise-history',
  testHistory: '.tour-progress-test-history',
}

export const practiceTargets = {
  ...endTargets,
  welcomeDesktop: '.tour-practice-welcome',
  welcomeMobile: '.tour-practice-welcome',
  topics: '.tour-practice-topics',
  translations: '.tour-practice-translations',
  translationsMobile: '.tour-practice-translations-mobile',
  storyAction: '.tour-practice-story-action',
  startPracticeMobile: '.tour-practice-story-action',
  exerciseBox: '.tour-practice-exercise-box',
  exercise: '.exercise',
  checkAnswers: '.tour-practice-check-answers',
  progressBar: '.tour-practice-progress-bar',
  eloScore: '.tour-practice-elo-score',
}

export const lessonsTargets = {
  ...endTargets,
  welcome: '.tour-lesson-welcome',
  lessonStartButton: '.tour-lesson-start-button',
  lessonSetupButton: '.tour-lesson-setup-button',
  storyTopic: '.tour-lesson-story-topic',
  vocab: '.tour-lesson-vocab',
  topic: '.tour-lesson-topic',
  customGrammar: '.tour-lesson-custom-grammar',
  levelTitle: '.tour-lesson-level-title',
  grammarTopics: '.tour-lesson-grammar-topics',
  performance: '.tour-lesson-performance',
  resetLesson: '.tour-lesson-reset',
  practiceLesson: '.tour-lesson-practice',
}

export const anonymousProgressTargets = {
  register: '.tour-progress-welcome',
}
