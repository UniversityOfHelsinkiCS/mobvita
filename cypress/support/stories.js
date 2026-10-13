// Real-story helpers shared by specs that need stories in a user's library. Stories are created
// through the paste UI (real backend, real ids) and deleted through the library UI afterwards.

const BASE = 'http://localhost:8000'
const API_BASE = 'localhost:8000/api'

export const storiesListUrl = /\/api\/stories(?:\?.*)?$/

// ---- backend helpers (cy.request bypasses cy.intercept, so these always hit the real BE) ----

export const authRequest = (token, method, path, body) =>
  cy.request({
    method,
    url: `${API_BASE}${path}`,
    headers: { Authorization: `Bearer ${token}` },
    body,
    timeout: 120000,
    failOnStatusCode: false,
  })

export const waitStoryReady = (token, storyId, attempts = 30) =>
  authRequest(token, 'GET', `/stories/${storyId}/loading`).then(res => {
    const ready = res.body?.exercise_ready === true || Number(res.body?.progress) >= 1
    if (ready) return null
    if (attempts <= 0) throw new Error(`Story ${storyId} never finished processing`)
    return cy.wait(1000).then(() => waitStoryReady(token, storyId, attempts - 1))
  })

// The paste modal closes when the upload request resolves, which is not the same moment the story
// becomes queryable — so poll the list instead of asserting on the first response.
export const findStoryByTitle = (token, title, language = 'Finnish', attempts = 20) =>
  authRequest(token, 'GET', `/stories?language=${language}&sort_by=date&order=-1`).then(res => {
    const match = (res.body?.stories || []).find(s => s.title === title)
    if (match) return match
    // Out of attempts: assert so the failure names the story rather than throwing on `undefined`.
    const neverAppeared = `created story titled "${title}" never appeared in the list`
    expect(attempts, neverAppeared).to.be.greaterThan(0)
    return cy.wait(1000).then(() => findStoryByTitle(token, title, language, attempts - 1))
  })

// Resolve the real id + content of a story just created via the paste UI, by title.
export const fetchCreatedStory = (token, title, language = 'Finnish') =>
  findStoryByTitle(token, title, language).then(match => {
    expect(match._id, 'created story id').to.match(/^[a-f0-9]{24}$/)
    return waitStoryReady(token, match._id)
      .then(() => authRequest(token, 'GET', `/stories/${match._id}?user_mode=preview`))
      .then(r => ({ id: match._id, title, story: r.body }))
  })

// ---- UI helpers ----

export const createStoryViaPaste = (title, body) => {
  // The paste form closes its modal whether the upload succeeded or not, so without watching the
  // request a failed upload only shows up much later as "the story never appeared in the list".
  cy.intercept('POST', /\/api\/stories$/, req => req.continue()).as('postStory')

  cy.get('[data-cy=add-story-button]').click()
  cy.get('[data-cy=add-story-paste]').click()
  cy.get('[data-cy=paste-story-title-input] input').clear().type(title)
  cy.get('[data-cy=paste-story-text-input] textarea:visible').clear().type(body)
  cy.get('[data-cy=paste-story-confirm]').should('not.be.disabled').click()

  // Fail here, naming the status, rather than 20s later in the list lookup.
  cy.wait('@postStory', { timeout: 120000 }).then(({ response }) => {
    expect(response?.statusCode, `POST /stories for "${title}"`).to.be.oneOf([200, 201])
  })

  // Modal closes once the upload finishes.
  cy.get('[data-cy=paste-story-title-input]', { timeout: 120000 }).should('not.exist')
}

export const deleteCreatedStoriesViaUi = stories => {
  if (!stories.length) return
  cy.loginExisting()
  // A stubbed (empty) stories list may still be active from the last test; let the real list
  // load so the actual cards render and can be deleted.
  cy.intercept('GET', storiesListUrl, req => req.continue()).as('realStoriesList')
  cy.visit(`${BASE}/library/private`)
  stories.forEach(s => {
    cy.get(`[data-cy="library-story-card-${s.id}"]`, { timeout: 60000 })
      .should('exist')
      .find('.library-item-title')
      .click()
    cy.get('[data-cy="story-detail-modal-delete-button"]', { timeout: 30000 })
      .should('not.be.disabled')
      .click()
    cy.get('[data-cy="confirm-warning-dialog"]', { timeout: 30000 }).click()
    cy.get(`[data-cy="library-story-card-${s.id}"]`, { timeout: 30000 }).should('not.exist')
  })
}
