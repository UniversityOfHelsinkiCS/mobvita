describe('flashcards', function () {
  this.beforeEach(function () {
    cy.login()
    cy.visit('http://localhost:8000/flashcards')
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

  it('displays no flashcards-message correctly', function () {
    cy.get('[data-cy=no-flashcards-text]')
  })

  it('story specific flashcards can be accessed', function () {
    cy.visit('http://localhost:8000/stories/5c407e9eff634503466b0dde/')
    cy.contains('lentokoneita').click()
    cy.visit('http://localhost:8000/flashcards/5c407e9eff634503466b0dde/')
    cy.get('[data-cy=flashcard-content]')
  })
})