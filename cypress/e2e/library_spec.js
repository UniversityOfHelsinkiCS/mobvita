/**
 * Library behaviour that depends on the story list staying current:
 *   - answering an exercise refreshes the progress bar WITHOUT a page reload
 *   - deleting from the teacher's story view leaves the library without that story
 *
 * Stories are created by pasting plain text into the private library. The backend builds the
 * exercises with deterministic NLP, not AI, so nothing here triggers generation and each suite owns
 * a story guaranteed to exist. Same approach reading_comprehension_spec.js uses.
 */
import { fetchCreatedStory } from '../support/stories'

const BASE = 'http://localhost:8000'
const LANGUAGE = 'Finnish'
const STORY_BODY =
  'Koira juoksee nopeasti suuressa puistossa. Kissa nukkuu pehmeällä sohvalla koko päivän. ' +
  'Lapset leikkivät pihalla ja nauravat iloisesti. Äiti valmistaa keittiössä herkullista ruokaa. ' +
  'Isä lukee sanomalehteä olohuoneessa ja juo kahvia.'

// Pastes a story; collapses the assistant sidebar first so it can't cover the add-story button.
const createStoryViaPaste = (title, body) => {
  // The assistant sidebar overlaps the add-story button on narrow viewports.
  cy.get('.helper-sidebar').then($sidebar => {
    if ($sidebar.hasClass('open')) {
      cy.get('[data-cy=helper-sidebar-toggle]').click()
      cy.get('.helper-sidebar').should('have.class', 'collapsed')
    }
  })
  cy.get('[data-cy=add-story-button]').click()
  cy.get('[data-cy=add-story-paste]').click()
  cy.get('[data-cy=paste-story-title-input] input').clear().type(title)
  cy.get('[data-cy=paste-story-text-input] textarea:visible').clear().type(body)
  cy.get('[data-cy=paste-story-confirm]').should('not.be.disabled').click()
  cy.get('[data-cy=paste-story-title-input]', { timeout: 120000 }).should('not.exist')
}

describe('library progress', function () {
  let owner
  let story

  const card = () => `[data-cy="library-story-card-${story.id}"]`

  // The story is private, so the card only exists under the private tab. A bare /library falls back
  // to the account's saved selection ('public' on a fresh user), which would never show the card.
  const visitPrivateLibrary = () => {
    cy.visit(`${BASE}/library/private`)
    cy.get('[data-cy=tab-private]', { timeout: 30000 }).should('have.attr', 'aria-selected', 'true')
  }

  this.beforeAll(function () {
    // A learner, not a teacher: this is the student practice flow.
    cy.login(LANGUAGE, false, 'English', true).then(user => {
      owner = user
    })

    const title = `Progress Story ${Date.now()}`
    cy.visit(`${BASE}/library/private`)
    createStoryViaPaste(title, STORY_BODY)
    cy.then(() => fetchCreatedStory(owner.token, title)).then(created => {
      story = created
    })
  })

  this.beforeEach(function () {
    cy.loginExisting()
    // The story list. An answer must NOT refetch it: the answer response carries the new progress.
    cy.intercept('GET', '**/stories?language=**').as('storiesList')
    cy.intercept('POST', '**/snippets/answer').as('postAnswers')
  })

  const answerCurrentSnippet = () => {
    cy.get('[data-cy=exercise-cloze]', { timeout: 60000 }).each(element => {
      cy.wrap(element).type('kirjasto', { force: true })
    })
    cy.get('[data-cy=check-answer]').click()
    cy.wait('@postAnswers', { timeout: 60000 })
  }

  it('starts with no progress bar on a freshly created story', function () {
    visitPrivateLibrary()
    cy.get(card(), { timeout: 60000 }).should('exist')
    cy.get(card()).find('[data-cy=story-progress-bar]').should('not.exist')
  })

  it('opens the story info dialog from the card without opening the actions modal', function () {
    visitPrivateLibrary()
    cy.get(card(), { timeout: 60000 }).find('[data-cy=library-story-card-info-button]').click()
    cy.get('[data-cy=story-info-dialog]').should('be.visible').and('contain', story.title)
    // The private-library actions modal would show Delete; the info click must not reach it.
    cy.get('[data-cy=story-detail-modal-delete-button]').should('not.exist')
    cy.get('[data-cy=story-info-dialog-close]').click()
    cy.get('[data-cy=story-info-dialog]').should('not.exist')
  })

  // The list entry this story has in the store (window.store is exposed to Cypress runs).
  const listEntry = () =>
    cy.window().its('store').invoke('getState').its('stories').then(stories =>
      stories.data.find(entry => entry._id === story.id),
    )

  it('takes the story progress from the answer, without refetching the list', function () {
    cy.visit(`${BASE}/stories/${story.id}/practice`)
    // The startup list fetch has landed once the store knows the list's language.
    cy.window().its('store').invoke('getState').its('stories.dataLanguage', { timeout: 60000 })
      .should('eq', LANGUAGE)
    let listRequestsAfterAnswer = 0
    cy.intercept('GET', '**/stories?language=**', () => {
      listRequestsAfterAnswer++
    })
    answerCurrentSnippet()

    cy.get('@postAnswers').its('response.body').then(body => {
      listEntry().its('percent_cov').should('eq', body.percent_cov)
      listEntry().its('percent_perf').should('eq', body.percent_perf)
    })
    cy.wait(3000)
    cy.then(() => expect(listRequestsAfterAnswer, 'list requests after the answer').to.equal(0))
    cy.location('pathname').should('include', '/practice')
  })

  it('shows the progress bar in the library without reloading the page', function () {
    cy.visit(`${BASE}/stories/${story.id}/practice`)
    answerCurrentSnippet()
    listEntry().its('percent_cov').should('be.greaterThan', 0)

    // A reload wipes this property, so if it survives the library was reached by routing alone.
    cy.window().then(win => {
      win.__noReloadSentinel = true
    })

    // In-app navigation, NOT cy.visit — a visit would reload and prove nothing.
    cy.get('[data-cy=hamburger]').click()
    cy.get('[data-cy=sidebar-library]', { timeout: 30000 }).click()
    cy.location('pathname', { timeout: 30000 }).should('include', '/library')

    // The sidebar lands on the saved library, so select private here too — a tab click swaps the
    // list in place and never touches the URL, so the no-reload proof still holds.
    cy.get('[data-cy=tab-private]', { timeout: 30000 }).click()
    cy.get('[data-cy=tab-private]').should('have.attr', 'aria-selected', 'true')

    cy.window().its('__noReloadSentinel').should('eq', true)
    cy.get(card(), { timeout: 60000 }).find('[data-cy=story-progress-bar]').should('exist')
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })
})

describe('deleting a story from the teacher view', function () {
  let owner
  let story

  this.beforeAll(function () {
    // A teacher: the edit/delete controls in the story view are behind teacherView.
    cy.login(LANGUAGE, true, 'English', true).then(user => {
      owner = user
    })

    const title = `Delete Me ${Date.now()}`
    cy.visit(`${BASE}/library/private`)
    createStoryViaPaste(title, STORY_BODY)
    cy.then(() => fetchCreatedStory(owner.token, title)).then(created => {
      story = created
    })
  })

  this.beforeEach(function () {
    cy.loginExisting()
  })

  it('removes the story from the library without a page reload', function () {
    cy.visit(`${BASE}/stories/${story.id}/preview/`)

    // The teacher preview holds a spinner until processing reports 100%, which lands a moment after
    // exercise_ready, so the controls appear slightly later than the story becomes practisable.
    cy.get('[data-cy=story-delete-button]', { timeout: 60000 }).click()
    cy.get('[data-cy=confirm-warning-dialog]').click()

    cy.location('pathname', { timeout: 30000 }).should('include', '/library')
    cy.get('[data-cy=tab-private]', { timeout: 30000 }).click()
    cy.get(`[data-cy="library-story-card-${story.id}"]`).should('not.exist')
  })

  it('stays deleted after a reload', function () {
    cy.visit(`${BASE}/library/private`)
    cy.get(`[data-cy="library-story-card-${story.id}"]`).should('not.exist')
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })
})
