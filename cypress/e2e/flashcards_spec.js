describe('flashcards', function () {
  const storyId = "5c080874ff6345361ec09dd8"
  const previewURL = `http://localhost:8000/stories/${storyId}/preview`

  this.beforeEach(function () {
    cy.login('Finnish', false, 'English', true)
    cy.intercept('GET', '**/api/**').as('apiCall')
    cy.visit('http://localhost:8000/flashcards')
    cy.wait('@apiCall', { timeout: 30000 })
  })

  it('displays no flashcards-message correctly', function () {
    cy.get('[data-cy=no-flashcards-text]')
  })

  it('flashcards can be added from preview mode', function () {
    cy.intercept('GET', '**/api/**').as('apiCall')
    cy.visit(previewURL)
    cy.wait('@apiCall', { timeout: 30000 })
    cy.get('[data-cy=readmodes-text]', { timeout: 30000 }).contains('saapua').click()
    cy.get('[data-cy=translations]', { timeout: 30000 }).contains('arrive')
    cy.visit('http://localhost:8000/flashcards/')
    cy.contains('saapua', { timeout: 30000 })
  })

  it('flashcards can be added from practice mode', function () {
    cy.intercept('GET', '**/api/**').as('apiCall')
    cy.visit(previewURL)
    cy.wait('@apiCall', { timeout: 30000 })
    cy.get('.word-interactive', { timeout: 30000 }).eq(2).click()
    cy.get('[data-cy=translations]', { timeout: 30000 })
    cy.visit('http://localhost:8000/flashcards/')
    cy.get('[data-cy=flashcard-content]', { timeout: 30000 })
  })

  describe('a card exists', function () {

    this.beforeEach(function () {
      cy.visit(previewURL)
      cy.contains('saapua').click()
      cy.get('[data-cy=translations]').contains('arrive')
      cy.visit('http://localhost:8000/flashcards/')
      cy.get('[data-cy=helper-sidebar-toggle]').click()
    })

    it('story specific flashcards can be accessed', function () {
      cy.visit(`http://localhost:8000/flashcards/fillin/story/${storyId}`)
      cy.get('[data-cy=flashcard-content]')
    })

    // The deck renders a slide per card, and each card renders both of its faces, so these scope to
    // the first card: flip control index 0 is its front, index 1 its back.
    const firstCard = () => cy.get('.flashcard-deck > .swiper-wrapper > .swiper-slide').first()

    it('shows answers after flipping card', function () {
      firstCard().find('[data-cy=flashcard-flip]').eq(0).click()
      cy.get('.flashcard-back-translations').contains('arrive')
    })

    it('cannot be answered after flipping card', function () {
      firstCard().find('[data-cy=flashcard-flip]').eq(0).click()
      firstCard().find('[data-cy=flashcard-flip]').eq(1).click()
      firstCard().find('.flashcard-input').should('not.exist')
    })

    it('right answer flips the card and shows a smile with correct translations', function () {
      cy.get('.flashcard-input input').eq(0).type('arrive')
      cy.get('.flashcard-input .flashcard-button').eq(0).click()
      cy.get('.flashcard-result > .smile.up')
      cy.contains('arrive')
    })

    it('wrong answer flips the cards and shows a sad face with correct translations', function () {
      cy.get('.flashcard-input input').eq(0).type('minttu')
      cy.get('.flashcard-input .flashcard-button').eq(0).click()
      cy.get('.flashcard-result > .smile.down')
      cy.contains('arrive')
    })
    /*
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
    */
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
      cy.get('[data-cy=helper-sidebar-toggle]').click()
    })

    it('can get to the next card', function () {
      cy.get('[data-cy=flashcard-title]').eq(0).as('title').then(() => {
        cy.get('.flashcard-arrow-button').eq(0).click({ force: true })
        cy.get('[data-cy=flashcard-title]').eq(1).should('not.eq', this.title.text())
      })
    })
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

})

