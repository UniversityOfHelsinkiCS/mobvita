const storyOneId = 'story-one'
const storyTwoId = 'story-two'
const readingPracticeStoryId = 'story-rp'
const storiesListUrl = /\/api\/stories(?:\?.*)?$/
const storyDetailsUrl = /\/api\/stories\/[^/?]+(?:\?.*)?$/

const visitAsMockUser = path => {
  cy.visit(path)
}

// Mock story IDs. Matching API calls are intercepted, so these tests do not depend on real backend data.
const makePreviewStory = ({ id, title, questions = [], readingQuestions = null }) => ({
  _id: id,
  title,
  paragraph: [
    [
      { ID: 0, sentence_id: 0, surface: 'Alpha ' },
      { ID: 1, sentence_id: 1, surface: 'Target ' },
      { ID: 2, sentence_id: 1, surface: 'sentence.' },
    ],
  ],
  ...(readingQuestions ? { reading_questions: readingQuestions } : {}),
  ...(Array.isArray(questions) ? { questions } : {}),
})

const getStoryIdFromUrl = url => new URL(url).pathname.split('/').pop()

// Reading-practice questions + chatbot session_id now come from a separate endpoint
// (GET /api/stories/<id>/get_questions); the story details API only carries num_questions.
const getQuestionsUrl = /\/api\/stories\/[^/?]+\/get_questions(?:\?.*)?$/

const getStoryIdFromQuestionsUrl = url => {
  const parts = new URL(url).pathname.split('/')
  return parts[parts.length - 2]
}

const getStoryResponse = story => (typeof story === 'function' ? story() : story)

const mockStoryDetailsApi = storiesById => {
  cy.intercept('GET', storyDetailsUrl, req => {
    const storyId = getStoryIdFromUrl(req.url)
    const story = storiesById[storyId]

    if (!story) {
      req.reply({
        statusCode: 404,
        body: { message: `Unexpected story id ${storyId}` },
      })
      return
    }

    req.alias = 'apiCall'
    req.reply(getStoryResponse(story))
  })
}

// Mock the reading-practice questions endpoint. Returns the questions the story carries
// (reading_questions / questions) plus a session_id, matching the /get_questions response shape.
const mockReadingQuestionsApi = storiesById => {
  cy.intercept('GET', getQuestionsUrl, req => {
    const storyId = getStoryIdFromQuestionsUrl(req.url)
    const story = getStoryResponse(storiesById[storyId])
    const questions = (story && (story.reading_questions || story.questions)) || []
    req.reply({ reading_questions: questions, session_id: `rp-session-${storyId}` })
  }).as('getReadingQuestions')
}

const waitForApiCallAndText = text => {
  cy.wait('@apiCall', { timeout: 30000 })
  cy.contains(text, { timeout: 30000 }).should('be.visible')
}

// Shared helper — intercept every API call that the ReadingComprehension
// component may fire so no real backend call escapes the test.
const mockAllStoriesApis = () => {
  // Stories list (loaded on mount and after saving)
  cy.intercept('GET', storiesListUrl, { body: [] }).as('getStoriesList')
  // AI question generation — returns static mock; NO real AI call is made
  cy.intercept('POST', '**/api/stories/*/mc_generate', { body: [] }).as('mcGenerateGlobal')
  // Save questions — acknowledge without touching the database
  cy.intercept(
    'POST',
    '**/api/stories/*/save_questions',
    { statusCode: 200, body: { ok: true } },
  ).as('saveQuestionsGlobal')
  // Delete questions — acknowledge without touching the database
  cy.intercept(
    'POST',
    '**/api/stories/*/delete_questions',
    { statusCode: 200, body: { ok: true } },
  ).as('deleteQuestionsGlobal')
  // Reading-practice answer recording — acknowledge without touching the database
  cy.intercept(
    'POST',
    '**/api/stories/*/answer_question',
    { statusCode: 200, body: { ok: true } },
  ).as('answerQuestionGlobal')
}

describe('reading comprehension', function () {
  this.beforeAll(function () {
    cy.login('English')
  })

  this.beforeEach(function () {
    cy.viewport(1920, 1080)
    window.localStorage.clear()
    cy.loginExisting().as('user')
    mockAllStoriesApis()
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

  it('saved questions are scoped per story', function () {
    const storyOne = makePreviewStory({
      id: storyOneId,
      title: 'Story One',
      questions: [
        {
          question: 'Story one question only',
          choices: ['A', 'B', 'C', 'D'],
          answer: 'A',
          level: 'B1',
        },
      ],
    })

    const storyTwo = makePreviewStory({
      id: storyTwoId,
      title: 'Story Two',
      questions: [
        {
          question: 'Story two question only',
          choices: ['E', 'F', 'G', 'H'],
          answer: 'E',
          level: 'B1',
        },
      ],
    })

    mockStoryDetailsApi({
      [storyOneId]: storyOne,
      [storyTwoId]: storyTwo,
    })

    visitAsMockUser(`http://localhost:8000/stories/${storyOneId}/reading-comprehension-options`)
    waitForApiCallAndText('Story One')

    cy.get('[data-cy="rc-tab-edit-saved-questions"]').click()
    cy.contains('Story one question only')
    cy.contains('Story two question only').should('not.exist')

    visitAsMockUser(`http://localhost:8000/stories/${storyTwoId}/reading-comprehension-options`)
    waitForApiCallAndText('Story Two')

    cy.get('[data-cy="rc-tab-edit-saved-questions"]').click()
    cy.contains('Story two question only')
    cy.contains('Story one question only').should('not.exist')

    // Critical assertion: no mc_generate requests should be made.
    cy.get('@mcGenerateGlobal.all').should('have.length', 0)
  })

  it('allows choosing level and size, editing saved answers, and deleting saved questions', function () {
    let storyOne = makePreviewStory({
      id: storyOneId,
      title: 'Story One',
      questions: [
        {
          question: 'Saved question for edits',
          choices: ['Correct A', 'Wrong B', 'Wrong C', 'Wrong D'],
          answer: 'Correct A',
          level: 'B1',
        },
      ],
    })

    mockStoryDetailsApi({ [storyOneId]: () => storyOne })
    cy.intercept('POST', `**/api/stories/${storyOneId}/save_questions`, req => {
      expect(req.body).to.have.property('questions')
      expect(req.body.questions).to.have.length(1)
      expect(req.body.questions[0].question).to.eq('Saved question for edits')
      expect(req.body.questions[0].choices[0]).to.eq('Updated correct answer')
      // Editing the correct option should also update the answer value.
      expect(req.body.questions[0].answer).to.eq('Updated correct answer')

      // Component refetches story after save success; return updated story
      // on subsequent GETs so UI keeps edited value.
      storyOne = {
        ...storyOne,
        questions: req.body.questions,
      }

      req.reply({ statusCode: 200, body: { ok: true } })
    }).as('saveQuestions')

    cy.intercept('POST', `**/api/stories/${storyOneId}/delete_questions`, req => {
      expect(req.body).to.deep.equal({ questions: ['Saved question for edits'] })
      req.reply({ statusCode: 200, body: { ok: true } })
    }).as('deleteQuestions')

    visitAsMockUser(`http://localhost:8000/stories/${storyOneId}/reading-comprehension-options`)
    waitForApiCallAndText('Story One')

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
    cy.wait('@saveQuestions')
    cy.get('[data-cy="rc-question-story-0"]').contains('Updated correct answer').should('be.visible')

    // Delete saved question and verify delete payload.
    cy.get('[data-cy="rc-delete-saved-question-btn-0"]').click()
    cy.get('[data-cy="rc-delete-modal-confirm"]').click()
    cy.wait('@deleteQuestions')

    // Critical assertion: no mc_generate requests should be made.
    cy.get('@mcGenerateGlobal.all').should('have.length', 0)
  })

  it('manages two generated draft questions in generate tab, then saves, edits, and deletes', function () {
    let storyOne = makePreviewStory({
      id: storyOneId,
      title: 'Story One',
      questions: [],
    })

    const generatedDraftQuestions = [
      {
        question: 'Draft question A',
        choices: ['A1', 'A2', 'A3', 'A4'],
        answer: 'A1',
        level: 'B1',
        sentence_ids: [1],
      },
      {
        question: 'Draft question B',
        choices: ['B1', 'B2', 'B3', 'B4'],
        answer: 'B1',
        level: 'B1',
        sentence_ids: [1],
      },
    ]

    mockStoryDetailsApi({ [storyOneId]: () => storyOne })

    cy.intercept('POST', `**/api/stories/${storyOneId}/mc_generate`, req => {
      expect(req.body).to.have.property('level')
      expect(req.body).to.have.property('size')
      req.reply({ statusCode: 200, body: generatedDraftQuestions })
    }).as('mcGenerateSpecific')

    cy.intercept('POST', `**/api/stories/${storyOneId}/save_questions`, req => {
      expect(req.body).to.have.property('questions')
      expect(req.body.questions).to.have.length(1)

      storyOne = {
        ...storyOne,
        questions: req.body.questions,
      }

      req.reply({ statusCode: 200, body: { ok: true } })
    }).as('saveQuestionsSpecific')

    cy.intercept('POST', `**/api/stories/${storyOneId}/delete_questions`, req => {
      expect(req.body).to.have.property('questions')

      const toDelete = Array.isArray(req.body.questions) ? req.body.questions : []
      storyOne = {
        ...storyOne,
        questions: storyOne.questions.filter(q => !toDelete.includes(q.question)),
      }

      req.reply({ statusCode: 200, body: { ok: true } })
    }).as('deleteQuestionsSpecific')

    visitAsMockUser(`http://localhost:8000/stories/${storyOneId}/reading-comprehension-options`)
    waitForApiCallAndText('Story One')

    cy.get('[data-cy="rc-tab-generate-questions"]').click()

    // Seed draft questions via mocked generate endpoint (no real AI backend work).
    cy.get('[data-cy="rc-generate-btn"]').click()
    cy.wait('@mcGenerateSpecific')

    cy.get('[data-cy="rc-question-title-draft-0"]').should('contain', 'Draft question A')
    cy.get('[data-cy="rc-question-title-draft-1"]').should('contain', 'Draft question B')

    // Selecting a draft question should highlight the matching story text.
    cy.get('[data-cy="story-token-p0-t1"]').should('not.have.css', 'background-color', 'rgb(253, 234, 59)')
    cy.get('[data-cy="rc-question-draft-0"]').click()
    cy.get('[data-cy="story-token-p0-t1"]').should('have.css', 'background-color', 'rgb(253, 234, 59)')

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
    cy.wait('@saveQuestionsSpecific')

    // Saved questions are rendered in the Edit Saved Questions tab.
    cy.get('[data-cy="rc-tab-edit-saved-questions"]').click()
    cy.get('[data-cy="rc-question-story-0"]').contains('A1 Modified Once').should('be.visible')

    // Modify the saved question again.
    cy.get('[data-cy="rc-choice-edit-story-0-0"]').click()
    cy.get('[data-cy="rc-choice-input-story-0-0"] input').clear().type('A1 Modified Twice')
    cy.get('[data-cy="rc-choice-save-story-0-0"]').click()
    cy.wait('@saveQuestionsSpecific')
    cy.get('[data-cy="rc-question-story-0"]').contains('A1 Modified Twice').should('be.visible')

    // Delete remaining saved question.
    cy.get('[data-cy="rc-delete-saved-question-btn-0"]').click()
    cy.get('[data-cy="rc-delete-modal-confirm"]').click()
    cy.wait('@deleteQuestionsSpecific')

    cy.get('[data-cy^="rc-question-story-"]').should('have.length', 0)

    // Verify lifecycle call counts.
    cy.get('@saveQuestionsSpecific.all').should('have.length', 2)
    cy.get('@deleteQuestionsSpecific.all').should('have.length', 1)
    cy.get('@mcGenerateSpecific.all').should('have.length', 1)
  })
})

describe('reading practice', function () {
  this.beforeAll(function () {
    cy.login('English')
  })

  this.beforeEach(function () {
    cy.viewport(1920, 1080)
    window.localStorage.clear()
    cy.loginExisting().as('user')
    mockAllStoriesApis()
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

  it('highlights correct option after user selects all three wrong answers', function () {
    const readingQuestions = [
      {
        question: 'Pick the right option after three wrong tries',
        choices: ['Wrong A', 'Correct option', 'Wrong B', 'Wrong C'],
        answer: 'Correct option',
        sentence_ids: [1],
      },
    ]

    const story = makePreviewStory({
      id: readingPracticeStoryId,
      title: 'Reading Practice Story',
      readingQuestions,
      questions: null,
    })

    mockStoryDetailsApi({ [readingPracticeStoryId]: story })
    mockReadingQuestionsApi({ [readingPracticeStoryId]: story })

    visitAsMockUser(`http://localhost:8000/stories/${readingPracticeStoryId}/reading_practice`)
    waitForApiCallAndText('Pick the right option after three wrong tries')

    cy.get('[data-cy="rp-choice-btn-0"]').click()
    cy.get('[data-cy="rp-choice-btn-2"]').click()
    cy.get('[data-cy="rp-choice-btn-3"]').click()

    // After 3 wrong answers, correct answer should be highlighted automatically.
    cy.get('[data-cy="rp-choice-btn-1"]').should('have.css', 'background-color', 'rgba(10, 248, 66, 0.35)')
    // With the default setting (manual button off) the answer location is revealed automatically.
    cy.get('[data-cy="story-token-p0-t1"]').should('have.css', 'background-color', 'rgb(253, 234, 59)')

    // Critical assertion: no mc_generate requests should be made.
    cy.get('@mcGenerateGlobal.all').should('have.length', 0)
  })

  it('supports wrong/correct progression with next, start over, and answer-location flow', function () {
    const story = {
      _id: readingPracticeStoryId,
      title: 'Reading Practice Story',
      paragraph: [
        [
          { ID: 0, sentence_id: 1, surface: 'First ' },
          { ID: 1, sentence_id: 1, surface: 'target ' },
          { ID: 2, sentence_id: 1, surface: 'sentence. ' },
          { ID: 3, sentence_id: 2, surface: 'Second ' },
          { ID: 4, sentence_id: 2, surface: 'answer ' },
          { ID: 5, sentence_id: 2, surface: 'sentence.' },
        ],
      ],
      reading_questions: [
        {
          question: 'Question 1',
          choices: ['Wrong 1', 'Correct 1', 'Wrong 2', 'Wrong 3'],
          answer: 'Correct 1',
          sentence_ids: [1],
        },
        {
          question: 'Question 2',
          choices: ['Wrong A', 'Wrong B', 'Correct 2', 'Wrong C'],
          answer: 'Correct 2',
          sentence_ids: [2],
        },
      ],
    }

    mockStoryDetailsApi({ [readingPracticeStoryId]: story })
    mockReadingQuestionsApi({ [readingPracticeStoryId]: story })

    visitAsMockUser(`http://localhost:8000/stories/${readingPracticeStoryId}/reading_practice`)
    waitForApiCallAndText('Question 1')

    // Q1: one wrong, then correct, then next.
    cy.get('[data-cy="rp-choice-btn-0"]').click()
    cy.get('[data-cy="rp-choice-btn-1"]').click()
    cy.get('[data-cy="rp-next-btn"]').should('not.be.disabled').click()

    // Q2: two wrong, then correct, then start over.
    cy.contains('Question 2').should('be.visible')
    cy.get('[data-cy="rp-choice-btn-0"]').click()
    cy.get('[data-cy="rp-choice-btn-1"]').click()
    cy.get('[data-cy="rp-choice-btn-2"]').click()
    cy.get('[data-cy="rp-start-over-btn"]').click()

    // Back to Q1: correct, then next.
    cy.contains('Question 1').should('be.visible')
    cy.get('[data-cy="rp-choice-btn-1"]').click()
    cy.get('[data-cy="rp-next-btn"]').should('not.be.disabled').click()

    // Q2 again: correct, show answer location in text, then start over.
    cy.contains('Question 2').should('be.visible')
    cy.get('[data-cy="story-token-p0-t4"]').should('not.have.css', 'background-color', 'rgb(253, 234, 59)')
    cy.get('[data-cy="rp-choice-btn-2"]').click()
    // With the default setting the answer location is revealed automatically (no manual button).
    cy.get('[data-cy="story-token-p0-t4"]').should('have.css', 'background-color', 'rgb(253, 234, 59)')
    cy.get('[data-cy="rp-start-over-btn"]').click()

    cy.contains('Question 1').should('be.visible')
    cy.get('@mcGenerateGlobal.all').should('have.length', 0)
  })
})
