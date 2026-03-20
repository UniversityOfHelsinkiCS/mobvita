// const storyOneId = 'story-one'
// const storyTwoId = 'story-two'
// const readingPracticeStoryId = 'story-rp'

// const makePreviewStory = ({ id, title, questions = [], readingQuestions = null }) => ({
//   _id: id,
//   title,
//   paragraph: [
//     [
//       { ID: 0, sentence_id: 0, surface: 'Alpha ' },
//       { ID: 1, sentence_id: 1, surface: 'Target ' },
//       { ID: 2, sentence_id: 1, surface: 'sentence.' },
//     ],
//   ],
//   ...(readingQuestions ? { reading_questions: readingQuestions } : {}),
//   ...(Array.isArray(questions) ? { questions } : {}),
// })

// describe('reading comprehension', function () {
//   this.beforeAll(function () {
//     cy.login('English')
//   })

//   this.beforeEach(function () {
//     cy.viewport(1920, 1080)
//     window.localStorage.clear()
//     cy.loginExisting().as('user')
//   })

//   this.afterAll(function () {
//     cy.cleanUsers()
//   })

//   it('saved questions are scoped per story', function () {
//     const storyOne = makePreviewStory({
//       id: storyOneId,
//       title: 'Story One',
//       questions: [
//         {
//           question: 'Story one question only',
//           choices: ['A', 'B', 'C', 'D'],
//           answer: 'A',
//           level: 'B1',
//         },
//       ],
//     })

//     const storyTwo = makePreviewStory({
//       id: storyTwoId,
//       title: 'Story Two',
//       questions: [
//         {
//           question: 'Story two question only',
//           choices: ['E', 'F', 'G', 'H'],
//           answer: 'E',
//           level: 'B1',
//         },
//       ],
//     })

//     cy.intercept('GET', `**/api/stories/${storyOneId}*`, storyOne).as('getStoryOne')
//     cy.intercept('GET', `**/api/stories/${storyTwoId}*`, storyTwo).as('getStoryTwo')

//     cy.visit(`http://localhost:8000/stories/${storyOneId}/reading-comprehension-options`)
//     cy.wait('@getStoryOne')

//     cy.get('.rc-tabs .item').eq(1).click()
//     cy.contains('Story one question only')
//     cy.contains('Story two question only').should('not.exist')

//     cy.visit(`http://localhost:8000/stories/${storyTwoId}/reading-comprehension-options`)
//     cy.wait('@getStoryTwo')

//     cy.get('.rc-tabs .item').eq(1).click()
//     cy.contains('Story two question only')
//     cy.contains('Story one question only').should('not.exist')
//   })

//   it('generated question can be selected and saved for current story', function () {
//     const storyOne = makePreviewStory({
//       id: storyOneId,
//       title: 'Story One',
//       questions: [],
//     })

//     const generated = [
//       {
//         question: 'Generated question for story one?',
//         choices: ['Right', 'Wrong A', 'Wrong B', 'Wrong C'],
//         answer: 'Right',
//         level: 'B1',
//       },
//     ]

//     cy.intercept('GET', `**/api/stories/${storyOneId}*`, storyOne).as('getStoryOne')
//     cy.intercept('GET', '**/api/stories?*', []).as('getStoriesList')
//     cy.intercept('POST', `**/api/stories/${storyOneId}/mc_generate`, generated).as('mcGenerate')
//     cy.intercept('POST', `**/api/stories/${storyOneId}/save_questions`, req => {
//       expect(req.body).to.have.property('questions')
//       expect(req.body.questions).to.have.length(1)
//       expect(req.body.questions[0].question).to.eq('Generated question for story one?')
//       req.reply({ statusCode: 200, body: { ok: true } })
//     }).as('saveQuestions')

//     cy.visit(`http://localhost:8000/stories/${storyOneId}/reading-comprehension-options`)
//     cy.wait('@getStoryOne')
//     cy.contains('Story One').should('be.visible')

//     cy.get('[data-cy="rc-generate-btn"]').click()
//     cy.wait('@mcGenerate')

//     cy.contains('.rc-question__titleText', 'Generated question for story one?').should('be.visible')
//     cy.get('[data-cy="rc-add-questions-to-story-btn"]').should('be.disabled')

//     cy.contains('.rc-question', 'Generated question for story one?').click()

//     cy.get('[data-cy="rc-add-questions-to-story-btn"]').should('not.be.disabled').click()

//     cy.wait('@saveQuestions')
//   })
// })

// describe('reading practice', function () {
//   this.beforeAll(function () {
//     cy.login('English')
//   })

//   this.beforeEach(function () {
//     cy.viewport(1920, 1080)
//     window.localStorage.clear()
//     cy.loginExisting().as('user')
//   })

//   this.afterAll(function () {
//     cy.cleanUsers()
//   })

//   it('highlights answer text only after show-location button click', function () {
//     const readingQuestions = [
//       {
//         question: 'Which option is correct?',
//         choices: ['Wrong A', 'Correct option', 'Wrong B', 'Wrong C'],
//         answer: 'Correct option',
//         sentence_ids: [1],
//       },
//     ]

//     const story = makePreviewStory({
//       id: readingPracticeStoryId,
//       title: 'Reading Practice Story',
//       readingQuestions,
//       questions: null,
//     })

//     cy.intercept('GET', `**/api/stories/${readingPracticeStoryId}*`, story).as('getPracticeStory')

//     cy.visit(`http://localhost:8000/stories/${readingPracticeStoryId}/reading_practice`)
//     cy.wait('@getPracticeStory')

//     cy.contains('span', 'Target').should('not.have.css', 'color', 'rgb(33, 186, 69)')

//     cy.get('[data-cy="rp-choice-btn-1"]').click()
//     cy.get('[data-cy="rp-show-answer-location-btn"]').click()

//     cy.contains('span', 'Target').should('have.css', 'color', 'rgb(33, 186, 69)')
//   })
// })
