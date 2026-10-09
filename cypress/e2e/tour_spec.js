/// <reference types="Cypress" />

// Tests for the tour system. Two layers:
//   1. Structural — validates the pure step orders and targets in stepOrders.js: unique ids,
//      all role/screen variants, and a target for every step of every order.
//   2. Walkthroughs — real users walk each tour; every step must show, with its spotlight on its
//      target, on screen and uncovered. A step skipped for a missing target fails the test.

import {
  homeOrder,
  libraryOrder,
  progressOrder,
  practiceOrder,
  practiceAltOrder,
  lessonsOrder,
  anonymousProgressOrder,
  homeTargets,
  libraryTargets,
  progressTargets,
  practiceTargets,
  lessonsTargets,
  anonymousProgressTargets,
} from '../../client/components/Tour/steps/stepOrders'
import {
  createStoryViaPaste,
  deleteCreatedStoriesViaUi,
  fetchCreatedStory,
} from '../support/stories'

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

// Each table's targets; practice-alt replays practice steps, so it shares practice's targets.
const TARGETS = {
  home: homeTargets,
  library: libraryTargets,
  progress: progressTargets,
  practice: practiceTargets,
  'practice-alt': practiceTargets,
  lessons: lessonsTargets,
  'progress-anonymous': anonymousProgressTargets,
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

        it(`${key}: every step has a target selector`, () => {
          table[key].forEach(id => {
            expect(TARGETS[name][id], `${name}.${id} target`).to.be.a('string').and.match(/^\./)
          })
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
const START_TOUR = '[data-cy=sidebar-start-tour]'

// Long enough for several snippets with exercises in the practice view.
const STORY_BODY =
  'Koira juoksee nopeasti suuressa puistossa. Kissa nukkuu pehmeällä sohvalla koko päivän. ' +
  'Lapset leikkivät pihalla ja nauravat iloisesti. Äiti valmistaa keittiössä herkullista ruokaa. ' +
  'Isä lukee sanomalehteä olohuoneessa ja juo kahvia. Illalla perhe katsoo yhdessä elokuvaa.'

// The tour state lives in redux; the app exposes the store to Cypress (see util/store.js).
const tourState = () => cy.window().its('store').invoke('getState').its('tour')

// Asserts the shown step points at its real target: it exists and, unless the step is centred
// (no spotlight), the spotlight hole surrounds it on screen and nothing covers it.
const assertStepOnTarget = (id, selector) =>
  cy.window({ timeout: 10000 }).should(win => {
    const doc = win.document
    const el = doc.querySelector(selector)
    expect(el, `${id}: target ${selector} exists`).to.exist
    const r = el.getBoundingClientRect()
    expect(r.width > 0 && r.height > 0, `${id}: target ${selector} has a size`).to.equal(true)

    const hole = doc.querySelectorAll('.react-joyride__spotlight path')[1]
    if (!hole) return
    const svg = hole.ownerSVGElement.getBoundingClientRect()
    const b = hole.getBBox()
    const h = { left: svg.left + b.x, top: svg.top + b.y, right: svg.left + b.x + b.width, bottom: svg.top + b.y + b.height }
    const surrounds =
      h.left <= r.left + 1 && h.top <= r.top + 1 && h.right >= r.right - 1 && h.bottom >= r.bottom - 1
    expect(surrounds, `${id}: spotlight ${JSON.stringify(h)} surrounds ${selector}`).to.equal(true)

    const v = {
      left: Math.max(r.left, 0),
      top: Math.max(r.top, 0),
      right: Math.min(r.right, win.innerWidth),
      bottom: Math.min(r.bottom, win.innerHeight),
    }
    expect(v.right > v.left && v.bottom > v.top, `${id}: ${selector} is on screen`).to.equal(true)
    const fractions = [0.5, 0.2, 0.8]
    const reachable = fractions.some(fx =>
      fractions.some(fy => {
        const hit = doc.elementFromPoint(v.left + (v.right - v.left) * fx, v.top + (v.bottom - v.top) * fy)
        // An ancestor hit means nothing is on top: disabled targets have pointer-events: none.
        return hit && (hit === el || el.contains(hit) || hit.contains(el))
      }),
    )
    expect(reachable, `${id}: ${selector} is not covered by anything`).to.equal(true)
  })

// Clicks Next through the running tour, checking every shown step; yields the shown step ids.
const walkTour = (order, targets, maxSteps = 30) => {
  const shown = []
  const step = n => {
    expect(n, 'tour finishes within the step budget').to.be.lessThan(maxSteps)
    return tourState().then(({ run }) => {
      if (!run) return
      cy.get(TOOLTIP, { timeout: 15000 }).should('be.visible')
      tourState().then(({ stepIndex }) => {
        const id = order[stepIndex]
        shown.push(id)
        assertStepOnTarget(id, targets[id])
        // No auto-scroll: Cypress would scroll the button to the top and move the page under the tour.
        cy.get(NEXT).click({ scrollBehavior: false })
        cy.window().should(win => {
          const tour = win.store.getState().tour
          expect(!tour.run || tour.stepIndex !== stepIndex, `${id}: tour moves on`).to.equal(true)
        })
        step(n + 1)
      })
    })
  }
  step(0)
  return cy.wrap(shown)
}

// Opens the page, waits until it is ready, then starts its tour from the sidebar like a user.
const startTour = (path, ready) => {
  cy.loginExisting()
  cy.visit(`http://localhost:8000${path}`)
  ready()
  // The sidebar may already be open (it covers the hamburger then).
  cy.window()
    .its('store')
    .invoke('getState')
    .its('sidebar.open')
    .then(open => {
      if (!open) cy.get('[data-cy=hamburger]').click()
    })
  cy.get(START_TOUR).click()
  cy.get(TOOLTIP, { timeout: 15000 }).should('be.visible')
}

// Walks a tour and asserts it showed exactly its steps, none skipped for a missing target.
const expectFullTour = (order, targets) =>
  walkTour(order, targets).then(shown => expect(shown, 'shown steps').to.deep.equal(order))

const metadataLoaded = key =>
  cy
    .window({ timeout: 30000 })
    .its('store')
    .invoke('getState')
    .its(`metadata.${key}`)
    .should('have.length.greaterThan', 0)

const ready = {
  home: () => {
    metadataLoaded('lessons')
    metadataLoaded('lesson_topics')
  },
  library: () => cy.get(libraryTargets.story, { timeout: 60000 }).should('be.visible'),
  progress: () => cy.get(progressTargets.welcomeDesktop, { timeout: 60000 }).should('be.visible'),
  practice: () => cy.get(practiceTargets.topics, { timeout: 60000 }).should('be.visible'),
  lessons: () => cy.get(lessonsTargets.welcome, { timeout: 60000 }).should('be.visible'),
}

// ── Walkthroughs ────────────────────────────────────────────────────────────
//
// Real users with assistant access and a real story of their own (created through the paste UI
// like reading_comprehension_spec), so every step has its target. Each walkthrough must show
// every step of its order, with the spotlight on the step's target.

const walkthroughs = (role, isTeacher) =>
  describe(`Tour walkthroughs — desktop ${role}`, function () {
    const key = isTeacher ? 'desktopTeacher' : 'desktopStudent'
    const stories = []
    let user

    this.beforeAll(function () {
      cy.viewport(1920, 1080)
      cy.login('Finnish', isTeacher, 'English', true).then(u => {
        user = u
      })
      const title = `Tour ${role} story ${Date.now()}`
      cy.visit('http://localhost:8000/library/private')
      createStoryViaPaste(title, STORY_BODY)
      cy.then(() => fetchCreatedStory(user.token, title)).then(s => stories.push(s))
    })

    this.afterAll(function () {
      deleteCreatedStoriesViaUi(stories)
      cy.cleanUsers()
    })

    this.beforeEach(function () {
      cy.viewport(1920, 1080)
    })

    it('home tour shows every step on its target', function () {
      startTour('/home', ready.home)
      expectFullTour(homeOrder[key], homeTargets)
    })

    it('home tour: close button stops it', function () {
      startTour('/home', ready.home)
      cy.get(CLOSE).click({ scrollBehavior: false })
      cy.get(TOOLTIP).should('not.exist')
      tourState().its('run').should('equal', false)
    })

    it('library tour shows every step on its target', function () {
      startTour('/library/private', ready.library)
      expectFullTour(libraryOrder[key], libraryTargets)
    })

    it('progress tour shows every step on its target', function () {
      startTour('/profile/progress', ready.progress)
      expectFullTour(progressOrder[key], progressTargets)
    })

    it('practice tour shows every step on its target', function () {
      startTour(`/stories/${stories[0].id}/preview`, ready.practice)
      expectFullTour(practiceOrder[key], practiceTargets)
    })

    it('lessons tour shows every step on its target', function () {
      startTour('/lessons/library', ready.lessons)
      expectFullTour(lessonsOrder[key], lessonsTargets)
    })
  })

walkthroughs('student', false)
walkthroughs('teacher', true)
