describe('flashcards', function () {
  this.beforeEach(function () {
    cy.login()
    cy.visit('http://localhost:8000/flashcards')
  })

  it('displays no flashcards-message correctly', function () {
    cy.get('[data-cy=no-flashcards-text]')
  })

  it('flashcards can be added from reading mode', function () {
    cy.visit('http://localhost:8000/stories/5c407e9eff634503466b0dde/read')
    cy.get('[data-cy=readmode-text]').contains('lentokoneita').click()
    cy.get('.book').click({ force: true })
    cy.get('[data-cy=translations]').contains('plane')
    cy.visit('http://localhost:8000/flashcards/')
    cy.contains('lentokone')
  })

  it('flashcards can be added from practice mode', function () {
    cy.visit('http://localhost:8000/stories/5c407e9eff634503466b0dde/practice')
    cy.get('[class=word-interactive]').eq(1).click()
    cy.get('.book').click({ force: true })
    cy.get('[data-cy=translations]')
    cy.visit('http://localhost:8000/flashcards/')
    cy.get('[data-cy=flashcard-content]')
  })

  describe('a card exists', function () {

    this.beforeEach(function () {
      cy.visit('http://localhost:8000/stories/5c407e9eff634503466b0dde/read')
      cy.contains('lentokoneita').click()
      cy.get('.book').click({ force: true })
      cy.get('[data-cy=translations]').contains('plane')
      cy.visit('http://localhost:8000/flashcards/')
    })

    it('story specific flashcards can be accessed', function () {
      cy.visit('http://localhost:8000/flashcards/fillin/5c407e9eff634503466b0dde')
      cy.get('[data-cy=flashcard-content]')
    })

    it('shows answers after flipping card', function () {
      cy.get('[class=flashcard-footer]').children().eq(0).click()
      cy.get('[class=flashcard-translations]').contains('plane')
    })

    it('cannot be answered after flipping card', function () {
      cy.get('[class=flashcard-footer]').children().eq(0).click()
      cy.get('.react-card-back > .flashcard > .flashcard-footer > .flashcard-blended-input').eq(0).click()
      cy.get('.react-card-front > .flashcard > .flashcard-input').should('not.exist')
    })

    it('right answer flips the card and shows thumbs up with correct translations', function () {
      cy.get('input').eq(0).type('plane')
      cy.get('.flashcard-button').eq(0).click()
      cy.get('.flashcard-result > .thumbs.up')
      cy.contains('plane')
    })

    it('wrong answer flips the cards and shows thumbs down with correct translations', function () {
      cy.get('input').eq(0).type('minttu')
      cy.get('.flashcard-button').eq(0).click()
      cy.get('.flashcard-result > .thumbs.down')
      cy.contains('plane')
    })

    it('language can be changed', function () {
      cy.contains('lentokone')
      cy.get('[class=flashcard-footer]').get('select').eq(0).select('Espanja')
      cy.get('[data-cy=no-flashcards-text]')
    })
  })

  describe('multiple cards', function () {
    this.beforeEach(function () {
      cy.visit('http://localhost:8000/stories/5c407e9eff634503466b0dde/read')
      cy.get('.book').click({ force: true })

      cy.contains('lentokoneita').click()
      cy.get('[data-cy=translations]').contains('plane')
      cy.contains('perustavat').click()
      cy.get('[data-cy=translations]').contains('found')
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

