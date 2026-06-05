/// <reference types="Cypress" />

// Tests for the tour system. Two layers:
//   1. Structural — validates the pure `STEP_ORDER` tables from every tour's
//      steps file. No browser needed; catches duplicated ids, missing
//      role/screen variants, and bad teacher/student/mobile/desktop splits.
//   2. Walkthroughs — drives each tour through Joyride and asserts the
//      tooltip is reached and can be walked to completion. The home tour
//      auto-starts (via `has_seen_home_tour: false`); the others are
//      launched by clicking the navbar `.tour-button` while on their page.

import {
  homeOrder,
  libraryOrder,
  progressOrder,
  practiceOrder,
  practiceAltOrder,
  lessonsOrder,
  anonymousProgressOrder,
} from '../../client/components/Tour/steps/stepOrders'

const ROLE_KEYS = ['desktopStudent', 'desktopTeacher', 'mobileStudent', 'mobileTeacher']

const TABLES = {
  home: homeOrder,
  library: libraryOrder,
  progress: progressOrder,
  practice: practiceOrder,
  'practice-alt': practiceAltOrder,
  lessons: lessonsOrder,
  'progress-anonymous': anonymousProgressOrder,
}

describe('Tour step ordering — structural', () => {
  Object.entries(TABLES).forEach(([name, table]) => {
    describe(`${name}`, () => {
      it('has all four role/screen keys', () => {
        ROLE_KEYS.forEach(key =>
          expect(table, `${name}.${key}`).to.have.property(key).that.is.an('array'),
        )
      })

      ROLE_KEYS.forEach(key => {
        it(`${key}: contains only unique non-empty string ids`, () => {
          const order = table[key]
          expect(order.length, 'order length').to.be.greaterThan(0)
          order.forEach(id => {
            expect(id).to.be.a('string')
            expect(id.length, `${name}.${key} id`).to.be.greaterThan(0)
          })
          expect(new Set(order).size, `${name}.${key} unique ids`).to.equal(order.length)
        })
      })
    })
  })

  it('home: teacher desktop swaps practiceNow/flashcards/progress for addNewStories', () => {
    expect(homeOrder.desktopTeacher).to.include('addNewStories')
    expect(homeOrder.desktopTeacher).to.not.include('practiceNow')
    expect(homeOrder.desktopStudent).to.not.include('addNewStories')
  })

  it('library: only teacher desktop has the review step', () => {
    expect(libraryOrder.desktopTeacher).to.include('review')
    expect(libraryOrder.desktopStudent).to.not.include('review')
    expect(libraryOrder.mobileTeacher).to.not.include('review')
  })

  it('progress: mobile is shorter than desktop and drops the vocabulary chart', () => {
    expect(progressOrder.mobileStudent.length).to.be.lessThan(progressOrder.desktopStudent.length)
    expect(progressOrder.desktopStudent).to.include('vocabulary')
    expect(progressOrder.mobileStudent).to.not.include('vocabulary')
  })

  it('practice: teachers stop after storyAction; students continue into the practice view', () => {
    expect(practiceOrder.desktopTeacher).to.not.include('exerciseBox')
    expect(practiceOrder.desktopStudent).to.include('exerciseBox')
  })

  it('practice-alt: always starts in the in-practice view (no welcome step)', () => {
    ROLE_KEYS.forEach(key => {
      expect(practiceAltOrder[key][0]).to.equal('exerciseBox')
      expect(practiceAltOrder[key]).to.not.include('welcomeDesktop')
      expect(practiceAltOrder[key]).to.not.include('welcomeMobile')
    })
  })

  it('lessons: teachers skip the performance step; students see it', () => {
    expect(lessonsOrder.desktopStudent).to.include('performance')
    expect(lessonsOrder.desktopTeacher).to.not.include('performance')
  })

  it('every tour starts with a welcome step', () => {
    Object.entries(TABLES).forEach(([name, table]) => {
      // progress-anonymous is a single 'register' step; practice-alt
      // intentionally resumes inside the practice view at 'exerciseBox'.
      if (name === 'progress-anonymous' || name === 'practice-alt') return
      ROLE_KEYS.forEach(key => {
        expect(table[key][0], `${name}.${key} first`).to.match(/welcome/i)
      })
    })
  })
})

// ── Walkthrough helpers ─────────────────────────────────────────────────────

const TOOLTIP = '.react-joyride__tooltip'
const NEXT = `${TOOLTIP} button[data-action="primary"]`
const CLOSE = `${TOOLTIP} button[data-action="close"]`
const TOUR_BUTTON = '.tour-button'

// Walks Joyride forward until the tooltip disappears or `maxSteps` is hit.
// Tolerates steps whose target is missing (per-tour handler dispatches
// `handleNextTourStep` past those automatically).
const walkToEnd = (maxSteps = 30) => {
  cy.get(TOOLTIP, { timeout: 15000 }).should('be.visible')
  for (let i = 0; i < maxSteps; i += 1) {
    cy.get('body').then($body => {
      if ($body.find(TOOLTIP).length === 0) return
      cy.get(NEXT, { timeout: 10000 }).click({ force: true })
    })
  }
  cy.get(TOOLTIP, { timeout: 15000 }).should('not.exist')
}

// Visit a page and start its tour via the navbar tour button. Works for
// every tour because the button dispatches the right action based on the
// current route (see NavBar.handleTourStart). MUI's sidebar overlay can
// linger in the DOM (`aria-hidden="true"`) and visually cover the navbar,
// so the click is forced.
const startTourFromPage = path => {
  cy.intercept('GET', '**/api/**').as('apiCall')
  cy.visit(`http://localhost:8000${path}`)
  cy.wait('@apiCall', { timeout: 10000 })
  cy.get(TOUR_BUTTON, { timeout: 15000 }).click({ force: true })
}

// ── Walkthroughs ────────────────────────────────────────────────────────────
//
// Every tour is launched the same way: navigate to its page, click the
// navbar tour button. Content-heavy steps (charts, story lists) may have
// missing DOM targets on a fresh test user; the per-tour handler advances
// past those automatically, so the walker just keeps clicking Next until
// the tooltip is gone.

describe('Tour walkthroughs', function () {
  this.beforeAll(function () {
    cy.login('Finnish', false)
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

  this.beforeEach(function () {
    cy.viewport(1920, 1080)
    cy.loginExisting()
  })

  it('home tour: opens and walks to completion', function () {
    startTourFromPage('/home')
    walkToEnd(homeOrder.desktopStudent.length + 5)
  })

  it('home tour: close button stops it', function () {
    startTourFromPage('/home')
    cy.get(TOOLTIP, { timeout: 15000 }).should('be.visible')
    cy.get(CLOSE).click()
    cy.get(TOOLTIP).should('not.exist')
  })

  it('library tour: opens and walks to completion', function () {
    startTourFromPage('/library')
    walkToEnd(libraryOrder.desktopStudent.length + 5)
  })

  it('progress tour: opens and walks to completion', function () {
    startTourFromPage('/profile/progress')
    walkToEnd(progressOrder.desktopStudent.length + 5)
  })

  it('lessons tour: opens and walks to completion', function () {
    startTourFromPage('/lessons')
    walkToEnd(lessonsOrder.desktopStudent.length + 5)
  })
})
