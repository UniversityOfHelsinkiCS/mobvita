/**
 * Library behaviour that depends on the story list staying current:
 *   - answering an exercise refreshes the progress bar WITHOUT a page reload
 *   - deleting from the teacher's story view leaves the library without that story
 *
 * Stories are created by pasting plain text into the private library. The backend builds the
 * exercises with deterministic NLP, not AI, so nothing here triggers generation and each suite owns
 * a story guaranteed to exist. Same approach reading_comprehension_spec.js uses.
 */
const BASE = 'http://localhost:8000'
const API_BASE = 'localhost:8000/api'
const LANGUAGE = 'Finnish'
const STORY_BODY =
  'Koira juoksee nopeasti suuressa puistossa. Kissa nukkuu pehmeällä sohvalla koko päivän.'

const authRequest = (token, method, path) =>
  cy.request({
    method,
    url: `${API_BASE}${path}`,
    headers: { Authorization: `Bearer ${token}` },
    timeout: 120000,
    failOnStatusCode: false,
  })

// Upload returns before the exercises exist; practising too early yields an empty snippet.
const waitStoryReady = (token, storyId, attempts = 30) =>
  authRequest(token, 'GET', `/stories/${storyId}/loading`).then(res => {
    const ready = res.body?.exercise_ready === true || Number(res.body?.progress) >= 1
    if (ready) return null
    if (attempts <= 0) throw new Error(`Story ${storyId} never finished processing`)
    return cy.wait(1000).then(() => waitStoryReady(token, storyId, attempts - 1))
  })

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

const fetchCreatedStory = (token, title) =>
  authRequest(token, 'GET', `/stories?language=${LANGUAGE}&sort_by=date&order=-1`).then(res => {
    const match = (res.body?.stories || []).find(s => s.title === title)
    expect(match, `created story titled "${title}"`).to.exist
    return waitStoryReady(token, match._id).then(() => ({ id: match._id, title }))
  })

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
    cy.login(LANGUAGE, false, 'English').then(user => {
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
    // The refetch this feature relies on: the story list, requested again once an answer lands.
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

  it('refetches the story list in the background as soon as an answer is submitted', function () {
    cy.visit(`${BASE}/stories/${story.id}/practice`)
    answerCurrentSnippet()

    // Still on the practice page — the refetch must not wait for the library to be opened.
    cy.wait('@storiesList', { timeout: 60000 })
    cy.location('pathname').should('include', '/practice')
  })

  it('shows the progress bar in the library without reloading the page', function () {
    cy.visit(`${BASE}/stories/${story.id}/practice`)
    answerCurrentSnippet()
    cy.wait('@storiesList', { timeout: 60000 })

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
    cy.login(LANGUAGE, true, 'English').then(user => {
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
