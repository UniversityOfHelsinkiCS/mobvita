describe('flashcards', function () {
  const storyId = "5c080874ff6345361ec09dd8"
  const previewURL = `http://localhost:8000/stories/${storyId}/preview`

  this.beforeEach(function () {
    cy.login()
    cy.visit('http://localhost:8000/flashcards')
  })

  it('displays no flashcards-message correctly', function () {
    cy.get('[data-cy=no-flashcards-text]')
  })

  it('flashcards can be added from preview mode', function () {
    cy.visit(previewURL)
    cy.get('[data-cy=readmodes-text]').contains('saapua').click()
    cy.get('[data-cy=translations]').contains('arrive')
    cy.visit('http://localhost:8000/flashcards/')
    cy.contains('saapua')
  })

  it('flashcards can be added from practice mode', function () {
    cy.visit(previewURL)
    cy.get('.word-interactive').eq(2).click()
    cy.get('[data-cy=translations]')
    cy.visit('http://localhost:8000/flashcards/')
    cy.get('[data-cy=flashcard-content]')
  })

  describe('a card exists', function () {

    this.beforeEach(function () {
      cy.visit(previewURL)
      cy.contains('saapua').click()
      cy.get('[data-cy=translations]').contains('arrive')
      cy.visit('http://localhost:8000/flashcards/')
    })

    it('story specific flashcards can be accessed', function () {
      cy.visit(`http://localhost:8000/flashcards/fillin/story/${storyId}`)
      cy.get('[data-cy=flashcard-content]')
    })

    it('shows answers after flipping card', function () {
      cy.get('[class=flashcard-footer]').children().eq(0).click()
      cy.get('[class=flashcard-translations]').contains('arrive')
    })

    it('cannot be answered after flipping card', function () {
      cy.get('[class=flashcard-footer]').children().eq(0).click()
      cy.get('.react-card-back > .flashcard > .flashcard-footer > .flashcard-blended-input').eq(0).click()
      cy.get('.react-card-front > .flashcard > .flashcard-input').should('not.exist')
    })

    it('right answer flips the card and shows thumbs up with correct translations', function () {
      cy.get('input').eq(0).type('arrive')
      cy.get('.flashcard-button').eq(0).click()
      cy.get('.flashcard-result > .thumbs.up')
      cy.contains('arrive')
    })

    it('wrong answer flips the cards and shows thumbs down with correct translations', function () {
      cy.get('input').eq(0).type('minttu')
      cy.get('.flashcard-button').eq(0).click()
      cy.get('.flashcard-result > .thumbs.down')
      cy.contains('arrive')
    })

    it('language can be changed', function () {
      cy.contains('saapua')

      cy.get('[data-cy=flashcards-dictionary-language]', { timeout: 10000 })
        .should('be.visible')
        .scrollIntoView()
        .click()

      cy.get('[data-cy=flashcards-dictionary-language]', { timeout: 10000 })
        .find('.menu .item .text')
        .contains('Espanja')
        .click()

      cy.get('[data-cy=flashcards-dictionary-language] .text', { timeout: 10000 })
        .should('contain', 'Espanja')
    })
  })

  describe('multiple cards', function () {
    this.beforeEach(function () {
      cy.viewport(1200, 900) 
      cy.visit(previewURL)

      cy.contains('saapua').click()
      cy.get('[data-cy=translations]').contains('arrive')
      cy.contains('viikolla').click()
      cy.get('[data-cy=translations]').contains('week')
      cy.visit('http://localhost:8000/flashcards/')
    })

    it('can get to the next card', function () {
      cy.get('[data-cy=flashcard-title]').eq(0).as('title').then(() => {
        cy.get('.flashcard-arrow-button').eq(0).click()
        cy.get('[data-cy=flashcard-title]').eq(1).should('not.eq', this.title.text())
      })
    })
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

})

