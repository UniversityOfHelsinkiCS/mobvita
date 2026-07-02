// These specs use REAL stories created through the paste UI (real backend, real ids) and the
// REAL questions backend: get_questions / save_questions / delete_questions / answer_question
// all hit the backend (intercepts only spy on them via req.continue() for assertions/aliases).
// Only mc_generate is mocked, because it is the sole endpoint that triggers AI work.
// Reading practice runs as the story OWNER (a non-owner is denied access to a private story).
// Stories are created in beforeAll and deleted through the library UI in afterAll.

const BASE = 'http://localhost:8000'
const API_BASE = 'localhost:8000/api'
const LANGUAGE = 'Finnish'

// #fdea3b -> rgb(253, 234, 59) is the sentence-highlight colour used by HighlightedStoryText.
const HIGHLIGHT_BG = 'rgb(253, 234, 59)'
// Correct-answer background in reading practice.
const CORRECT_BG = 'rgba(10, 248, 66, 0.35)'

const storiesListUrl = /\/api\/stories(?:\?.*)?$/
const storyDetailsUrl = /\/api\/stories\/[^/?]+(?:\?.*)?$/

// Two sentences. The backend strips the first pasted line into `title`, so the body below
// becomes paragraph 0 with sentence_id 0 (first sentence) and 1 (second sentence).
// Tokenisation is deterministic: each word / whitespace / punctuation mark is its own token.
// Must be > 50 characters for the paste form to enable the Confirm button.
const STORY_BODY =
  'Koira juoksee nopeasti suuressa puistossa. Kissa nukkuu pehmeällä sohvalla koko päivän.'

// Locate the first non-whitespace token of a given sentence in a real (fetched) story so we
// can assert against its story-token-p<p>-t<t> element regardless of exact tokenisation.
const firstWordTokenOfSentence = (story, sentenceId) => {
  const paragraphs = Array.isArray(story?.paragraph) ? story.paragraph : []
  for (let p = 0; p < paragraphs.length; p += 1) {
    const tokens = paragraphs[p] || []
    for (let t = 0; t < tokens.length; t += 1) {
      const tok = tokens[t]
      if (
        Number(tok?.sentence_id) === Number(sentenceId) &&
        String(tok?.surface || '').trim() !== ''
      ) {
        return { p, t }
      }
    }
  }
  throw new Error(`No token found for sentence ${sentenceId}`)
}

const tokenSelector = ({ p, t }) => `[data-cy="story-token-p${p}-t${t}"]`

// ---- backend helpers (cy.request bypasses cy.intercept, so these always hit the real BE) ----

const authRequest = (token, method, path, body) =>
  cy.request({
    method,
    url: `${API_BASE}${path}`,
    headers: { Authorization: `Bearer ${token}` },
    body,
    timeout: 120000,
    failOnStatusCode: false,
  })

const waitStoryReady = (token, storyId, attempts = 30) =>
  authRequest(token, 'GET', `/stories/${storyId}/loading`).then(res => {
    const ready = res.body?.exercise_ready === true || Number(res.body?.progress) >= 1
    if (ready) return null
    if (attempts <= 0) throw new Error(`Story ${storyId} never finished processing`)
    return cy.wait(1000).then(() => waitStoryReady(token, storyId, attempts - 1))
  })

// Resolve the real id + content of a story just created via the paste UI, by title.
const fetchCreatedStory = (token, title) =>
  authRequest(token, 'GET', `/stories?language=${LANGUAGE}&sort_by=date&order=-1`).then(res => {
    const list = res.body?.stories || []
    const match = list.find(s => s.title === title)
    expect(match, `created story titled "${title}"`).to.exist
    expect(match._id, 'created story id').to.match(/^[a-f0-9]{24}$/)
    return waitStoryReady(token, match._id)
      .then(() => authRequest(token, 'GET', `/stories/${match._id}?user_mode=preview`))
      .then(r => ({ id: match._id, title, story: r.body }))
  })

// save_questions upserts by question text and delete_questions removes by text, so start each
// test from a known state: delete whatever is stored, then save the desired questions.
const resetStoryQuestions = (token, storyId) =>
  authRequest(token, 'GET', `/stories/${storyId}/get_questions`).then(res => {
    const texts = (res.body?.questions || []).map(q => q.question).filter(Boolean)
    if (!texts.length) return null
    return authRequest(token, 'POST', `/stories/${storyId}/delete_questions`, { questions: texts })
  })

const seedStoryQuestions = (token, storyId, questions) =>
  resetStoryQuestions(token, storyId).then(() => {
    if (!questions.length) return null
    return authRequest(token, 'POST', `/stories/${storyId}/save_questions`, { questions })
  })

// ---- UI helpers ----

const createStoryViaPaste = (title, body) => {
  cy.get('[data-cy=add-story-button]').click()
  cy.get('[data-cy=add-story-paste]').click()
  cy.get('[data-cy=paste-story-title-input] input').clear().type(title)
  cy.get('[data-cy=paste-story-text-input] textarea:visible').clear().type(body)
  cy.get('[data-cy=paste-story-confirm]').should('not.be.disabled').click()
  // Modal closes once the upload finishes.
  cy.get('[data-cy=paste-story-title-input]', { timeout: 120000 }).should('not.exist')
}

const deleteCreatedStoriesViaUi = stories => {
  if (!stories.length) return
  cy.loginExisting()
  // A stubbed (empty) stories list may still be active from the last test; let the real list
  // load so the actual cards render and can be deleted.
  cy.intercept('GET', storiesListUrl, req => req.continue()).as('realStoriesList')
  cy.visit(`${BASE}/library/private`)
  stories.forEach(s => {
    cy.get(`[data-cy="library-story-card-${s.id}"]`, { timeout: 60000 })
      .should('exist')
      .find('.story-item-title')
      .click()
    cy.get('[data-cy="story-detail-modal-delete-button"]', { timeout: 30000 })
      .should('not.be.disabled')
      .click()
    cy.get('[data-cy="confirm-warning-dialog"]', { timeout: 30000 }).click()
    cy.get(`[data-cy="library-story-card-${s.id}"]`, { timeout: 30000 }).should('not.exist')
  })
}

// ---- intercept helpers ----

const waitForApiCallAndText = text => {
  cy.wait('@apiCall', { timeout: 30000 })
  cy.contains(text, { timeout: 30000 }).should('be.visible')
}

// Real story details pass through to the backend (owner has access), aliased so the wait helper
// keeps working.
const aliasStoryDetails = () => {
  cy.intercept('GET', storyDetailsUrl, req => {
    req.alias = 'apiCall'
    req.continue()
  })
}

// answer_question hits the real backend; we only spy to assert the payload and alias the call.
// It is fire-and-forget in the UI (state updates locally on click and the auto-reveal effect can
// fire a second answer_question right after), so tests drive off UI state, not this response.
const spyAnswerQuestion = storyId => {
  cy.intercept('POST', `**/api/stories/${storyId}/answer_question`, req => {
    expect(req.body).to.have.property('question_id')
    expect(req.body).to.have.property('answer')
    req.continue()
  }).as('answerQuestion')
}

// Only mock AI question generation; the stories list is stubbed empty so mounting a view never
// renders unrelated library data. The list endpoint returns { stories: [...] } and the reducer
// reads response.stories, so the stub must keep that shape.
const mockAllStoriesApis = () => {
  cy.intercept('GET', storiesListUrl, { body: { stories: [], total_num: 0 } }).as('getStoriesList')
  cy.intercept('POST', '**/api/stories/*/mc_generate', { body: [] }).as('mcGenerateGlobal')
}

describe('reading comprehension', function () {
  let owner
  const stories = []

  this.beforeAll(function () {
    stories.length = 0
    cy.login(LANGUAGE, true, 'English').then(user => {
      owner = user
    })

    const specs = [
      { title: `RC Story One ${Date.now()}`, body: STORY_BODY },
      { title: `RC Story Two ${Date.now()}-2`, body: STORY_BODY },
    ]

    specs.forEach(spec => {
      // Fresh visit resets uploadProgress redux so each Confirm button is enabled.
      cy.visit(`${BASE}/library/private`)
      createStoryViaPaste(spec.title, spec.body)
      cy.then(() => fetchCreatedStory(owner.token, spec.title)).then(s => stories.push(s))
    })
  })

  this.beforeEach(function () {
    cy.viewport(1920, 1080)
    window.localStorage.clear()
    cy.loginExisting().as('user')
    mockAllStoriesApis()
  })

  this.afterAll(function () {
    deleteCreatedStoriesViaUi(stories)
    cy.cleanUsers()
  })

  it('creates real stories that exist in the library with real ids', function () {
    // Let the real stories list load so the actual cards render (beforeEach stubs it empty).
    cy.intercept('GET', storiesListUrl, req => req.continue()).as('realStoriesList')

    stories.forEach(s => {
      expect(s.id, 'story id').to.match(/^[a-f0-9]{24}$/)
    })
    expect(stories).to.have.length(2)

    cy.visit(`${BASE}/library/private`)
    stories.forEach(s => {
      cy.get(`[data-cy="library-story-card-${s.id}"]`, { timeout: 60000 }).should('be.visible')
      cy.get(`[data-cy="library-story-card-${s.id}"]`).should('contain', s.title)
    })
  })

  it('saved questions are scoped per story', function () {
    const [a, b] = stories

    seedStoryQuestions(owner.token, a.id, [
      {
        question: 'Mitä koira tekee puistossa?',
        choices: ['juoksee', 'nukkuu', 'istuu', 'lukee'],
        answer: 'juoksee',
        level: 'B1',
        sentence_ids: [0],
      },
    ])
    seedStoryQuestions(owner.token, b.id, [
      {
        question: 'Missä kissa nukkuu?',
        choices: ['sohvalla', 'puistossa', 'autossa', 'koulussa'],
        answer: 'sohvalla',
        level: 'B1',
        sentence_ids: [1],
      },
    ])

    aliasStoryDetails()

    cy.visit(`${BASE}/stories/${a.id}/reading-comprehension-options`)
    waitForApiCallAndText(a.title)

    cy.get('[data-cy="rc-tab-edit-saved-questions"]').click()
    cy.contains('Mitä koira tekee puistossa?')
    cy.contains('Missä kissa nukkuu?').should('not.exist')

    cy.visit(`${BASE}/stories/${b.id}/reading-comprehension-options`)
    waitForApiCallAndText(b.title)

    cy.get('[data-cy="rc-tab-edit-saved-questions"]').click()
    cy.contains('Missä kissa nukkuu?')
    cy.contains('Mitä koira tekee puistossa?').should('not.exist')

    // Critical assertion: no mc_generate requests should be made.
    cy.get('@mcGenerateGlobal.all').should('have.length', 0)
  })

  it('chooses level and size, edits saved answers, and deletes saved questions', function () {
    const story = stories[0]

    seedStoryQuestions(owner.token, story.id, [
      {
        question: 'Saved question for edits',
        choices: ['Correct A', 'Wrong B', 'Wrong C', 'Wrong D'],
        answer: 'Correct A',
        level: 'B1',
        sentence_ids: [0],
      },
    ])

    aliasStoryDetails()

    cy.intercept('POST', `**/api/stories/${story.id}/save_questions`, req => {
      expect(req.body).to.have.property('questions')
      expect(req.body.questions).to.have.length(1)
      expect(req.body.questions[0].question).to.eq('Saved question for edits')
      expect(req.body.questions[0].choices[0]).to.eq('Updated correct answer')
      // Editing the correct option should also update the answer value.
      expect(req.body.questions[0].answer).to.eq('Updated correct answer')
      req.continue()
    }).as('saveQuestions')

    cy.intercept('POST', `**/api/stories/${story.id}/delete_questions`, req => {
      expect(req.body).to.deep.equal({ questions: ['Saved question for edits'] })
      req.continue()
    }).as('deleteQuestions')

    cy.visit(`${BASE}/stories/${story.id}/reading-comprehension-options`)
    waitForApiCallAndText(story.title)

    cy.get('[data-cy="rc-level-select"]').click()
    cy.contains('.visible.menu .item', 'B2').click()
    cy.get('[data-cy="rc-level-select"]').should('contain', 'B2')

    cy.get('[data-cy="rc-size-select"]').click()
    cy.contains('.visible.menu .item', '4').click()
    cy.get('[data-cy="rc-size-select"]').should('contain', '4')

    // Edit saved question choice and verify save payload.
    cy.get('[data-cy="rc-tab-edit-saved-questions"]').click()
    cy.get('[data-cy="rc-question-title-story-0"]').should('contain', 'Saved question for edits')
    cy.get('[data-cy="rc-choice-edit-story-0-0"]').click()
    cy.get('[data-cy="rc-choice-input-story-0-0"] input').clear().type('Updated correct answer')
    cy.get('[data-cy="rc-choice-save-story-0-0"]').click()
    cy.wait('@saveQuestions').its('response.statusCode').should('be.within', 200, 299)
    cy.get('[data-cy="rc-question-story-0"]')
      .contains('Updated correct answer')
      .should('be.visible')

    // Delete saved question and verify delete payload.
    cy.get('[data-cy="rc-delete-saved-question-btn-0"]').click()
    cy.get('[data-cy="rc-delete-modal-confirm"]').click()
    cy.wait('@deleteQuestions').its('response.statusCode').should('be.within', 200, 299)

    // Critical assertion: no mc_generate requests should be made.
    cy.get('@mcGenerateGlobal.all').should('have.length', 0)
  })

  it('manages two draft questions in generate tab, then saves, edits, and deletes', function () {
    const story = stories[0]
    const sentence0Token = firstWordTokenOfSentence(story.story, 0)

    // Start from a clean slate (no saved questions).
    seedStoryQuestions(owner.token, story.id, [])

    const generatedDraftQuestions = [
      {
        question: 'Draft question A',
        choices: ['A1', 'A2', 'A3', 'A4'],
        answer: 'A1',
        level: 'B1',
        sentence_ids: [0],
      },
      {
        question: 'Draft question B',
        choices: ['B1', 'B2', 'B3', 'B4'],
        answer: 'B1',
        level: 'B1',
        sentence_ids: [0],
      },
    ]

    aliasStoryDetails()

    cy.intercept('POST', `**/api/stories/${story.id}/mc_generate`, req => {
      expect(req.body).to.have.property('level')
      expect(req.body).to.have.property('size')
      req.reply({ statusCode: 200, body: generatedDraftQuestions })
    }).as('mcGenerateSpecific')

    cy.intercept('POST', `**/api/stories/${story.id}/save_questions`, req => {
      expect(req.body).to.have.property('questions')
      expect(req.body.questions).to.have.length(1)
      req.continue()
    }).as('saveQuestionsSpecific')

    cy.intercept('POST', `**/api/stories/${story.id}/delete_questions`, req => {
      expect(req.body).to.have.property('questions')
      req.continue()
    }).as('deleteQuestionsSpecific')

    cy.visit(`${BASE}/stories/${story.id}/reading-comprehension-options`)
    waitForApiCallAndText(story.title)

    cy.get('[data-cy="rc-tab-generate-questions"]').click()

    // Seed draft questions via mocked generate endpoint (no real AI backend work).
    cy.get('[data-cy="rc-generate-btn"]').click()
    cy.wait('@mcGenerateSpecific')

    cy.get('[data-cy="rc-question-title-draft-0"]').should('contain', 'Draft question A')
    cy.get('[data-cy="rc-question-title-draft-1"]').should('contain', 'Draft question B')

    // Selecting a draft question should highlight the matching (real) story sentence.
    cy.get(tokenSelector(sentence0Token)).should('not.have.css', 'background-color', HIGHLIGHT_BG)
    cy.get('[data-cy="rc-question-draft-0"]').click()
    cy.get(tokenSelector(sentence0Token)).should('have.css', 'background-color', HIGHLIGHT_BG)

    // Delete one draft question in Generate tab.
    cy.get('[data-cy="rc-delete-draft-question-btn-1"]').click()
    cy.get('[data-cy="rc-delete-modal-confirm"]').click()
    cy.get('[data-cy="rc-question-title-draft-0"]').should('contain', 'Draft question A')
    cy.get('[data-cy="rc-question-title-draft-1"]').should('not.exist')

    // Modify remaining draft question answer in Generate tab and save to story.
    cy.get('[data-cy="rc-choice-edit-draft-0-0"]').click()
    cy.get('[data-cy="rc-choice-input-draft-0-0"] input').clear().type('A1 Modified Once')
    cy.get('[data-cy="rc-choice-save-draft-0-0"]').click()
    cy.get('[data-cy="rc-add-questions-to-story-btn"]').click()
    cy.wait('@saveQuestionsSpecific').its('response.statusCode').should('be.within', 200, 299)

    // Saved questions are rendered in the Edit Saved Questions tab.
    cy.get('[data-cy="rc-tab-edit-saved-questions"]').click()
    cy.get('[data-cy="rc-question-story-0"]').contains('A1 Modified Once').should('be.visible')

    // Modify the saved question again.
    cy.get('[data-cy="rc-choice-edit-story-0-0"]').click()
    cy.get('[data-cy="rc-choice-input-story-0-0"] input').clear().type('A1 Modified Twice')
    cy.get('[data-cy="rc-choice-save-story-0-0"]').click()
    cy.wait('@saveQuestionsSpecific').its('response.statusCode').should('be.within', 200, 299)
    cy.get('[data-cy="rc-question-story-0"]').contains('A1 Modified Twice').should('be.visible')

    // Delete remaining saved question.
    cy.get('[data-cy="rc-delete-saved-question-btn-0"]').click()
    cy.get('[data-cy="rc-delete-modal-confirm"]').click()
    cy.wait('@deleteQuestionsSpecific').its('response.statusCode').should('be.within', 200, 299)

    cy.get('[data-cy^="rc-question-story-"]').should('have.length', 0)

    // Verify lifecycle call counts.
    cy.get('@saveQuestionsSpecific.all').should('have.length', 2)
    cy.get('@deleteQuestionsSpecific.all').should('have.length', 1)
    cy.get('@mcGenerateSpecific.all').should('have.length', 1)
  })
})

describe('reading practice', function () {
  let owner
  const stories = []

  this.beforeAll(function () {
    stories.length = 0
    // Reading practice runs as the story OWNER: a non-owner is denied (403) access to a
    // private story's details and questions.
    cy.login(LANGUAGE, true, 'English').then(user => {
      owner = user
    })

    const title = `RP Story ${Date.now()}`
    cy.visit(`${BASE}/library/private`)
    createStoryViaPaste(title, STORY_BODY)
    cy.then(() => fetchCreatedStory(owner.token, title)).then(s => stories.push(s))
  })

  this.beforeEach(function () {
    cy.viewport(1920, 1080)
    window.localStorage.clear()
    cy.loginExisting().as('user')
    mockAllStoriesApis()
  })

  this.afterAll(function () {
    deleteCreatedStoriesViaUi(stories)
    cy.cleanUsers()
  })

  it('created reading-practice story exists with a real id', function () {
    const story = stories[0]
    expect(story.id, 'story id').to.match(/^[a-f0-9]{24}$/)

    cy.intercept('GET', storiesListUrl, req => req.continue()).as('realStoriesList')
    cy.visit(`${BASE}/library/private`)
    cy.get(`[data-cy="library-story-card-${story.id}"]`, { timeout: 60000 }).should('be.visible')
  })

  it('highlights correct option after user selects all three wrong answers', function () {
    const story = stories[0]
    const answerSentenceToken = firstWordTokenOfSentence(story.story, 1)

    seedStoryQuestions(owner.token, story.id, [
      {
        question: 'Mikä eläin nukkuu sohvalla?',
        choices: ['Koira', 'Kissa', 'Hevonen', 'Lintu'],
        answer: 'Kissa',
        level: 'B1',
        sentence_ids: [1],
      },
    ])

    aliasStoryDetails()
    spyAnswerQuestion(story.id)

    cy.visit(`${BASE}/stories/${story.id}/reading_practice`)
    waitForApiCallAndText('Mikä eläin nukkuu sohvalla?')

    cy.get('[data-cy="rp-choice-btn-0"]').click()
    cy.get('[data-cy="rp-choice-btn-2"]').click()
    cy.get('[data-cy="rp-choice-btn-3"]').click()

    // After 3 wrong answers the correct option is highlighted and, with the default setting, the
    // answer location is revealed automatically in the text (no manual "show answer" button).
    cy.get('[data-cy="rp-choice-btn-1"]').should('have.css', 'background-color', CORRECT_BG)
    cy.get(tokenSelector(answerSentenceToken)).should('have.css', 'background-color', HIGHLIGHT_BG)
    cy.get('[data-cy="rp-show-answer-location-btn"]').should('not.exist')

    // answer_question hit the real backend, and no mc_generate requests should be made.
    cy.get('@answerQuestion.all').should('have.length.greaterThan', 0)
    cy.get('@mcGenerateGlobal.all').should('have.length', 0)
  })

  it('supports wrong/correct progression with next, start over, answer-location', function () {
    const story = stories[0]
    const answerSentenceToken = firstWordTokenOfSentence(story.story, 1)

    seedStoryQuestions(owner.token, story.id, [
      {
        question: 'Mitä koira tekee?',
        choices: ['nukkuu', 'juoksee', 'istuu', 'lukee'],
        answer: 'juoksee',
        level: 'B1',
        sentence_ids: [0],
      },
      {
        question: 'Missä kissa nukkuu?',
        choices: ['autossa', 'koulussa', 'sohvalla', 'puistossa'],
        answer: 'sohvalla',
        level: 'B1',
        sentence_ids: [1],
      },
    ])

    aliasStoryDetails()
    spyAnswerQuestion(story.id)

    cy.visit(`${BASE}/stories/${story.id}/reading_practice`)
    waitForApiCallAndText('Mitä koira tekee?')

    // Q1: one wrong, then correct, then next.
    cy.get('[data-cy="rp-choice-btn-0"]').click()
    cy.get('[data-cy="rp-choice-btn-1"]').click()
    cy.get('[data-cy="rp-choice-btn-1"]').should('have.css', 'background-color', CORRECT_BG)
    cy.get('[data-cy="rp-next-btn"]').should('not.be.disabled').click()

    // Q2: two wrong, then correct, then start over.
    cy.contains('Missä kissa nukkuu?').should('be.visible')
    cy.get('[data-cy="rp-choice-btn-0"]').click()
    cy.get('[data-cy="rp-choice-btn-1"]').click()
    cy.get('[data-cy="rp-choice-btn-2"]').click()
    cy.get('[data-cy="rp-choice-btn-2"]').should('have.css', 'background-color', CORRECT_BG)
    cy.get('[data-cy="rp-start-over-btn"]').click()

    // Back to Q1: correct, then next.
    cy.contains('Mitä koira tekee?').should('be.visible')
    cy.get('[data-cy="rp-choice-btn-1"]').click()
    cy.get('[data-cy="rp-choice-btn-1"]').should('have.css', 'background-color', CORRECT_BG)
    cy.get('[data-cy="rp-next-btn"]').should('not.be.disabled').click()

    // Q2 again: on the correct answer the location auto-reveals in the text (default setting:
    // no manual "show answer" button), then start over.
    cy.contains('Missä kissa nukkuu?').should('be.visible')
    cy.get(tokenSelector(answerSentenceToken)).should(
      'not.have.css',
      'background-color',
      HIGHLIGHT_BG,
    )
    cy.get('[data-cy="rp-choice-btn-2"]').click()
    cy.get(tokenSelector(answerSentenceToken)).should('have.css', 'background-color', HIGHLIGHT_BG)
    cy.get('[data-cy="rp-show-answer-location-btn"]').should('not.exist')
    cy.get('[data-cy="rp-start-over-btn"]').click()

    cy.contains('Mitä koira tekee?').should('be.visible')
    cy.get('@answerQuestion.all').should('have.length.greaterThan', 0)
    cy.get('@mcGenerateGlobal.all').should('have.length', 0)
  })
})
