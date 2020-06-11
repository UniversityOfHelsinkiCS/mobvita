describe('test view', function() {
  this.beforeAll(function () {
    cy.login()
  })

  this.beforeEach(function () {
    cy.loginExisting().as('user')
    cy.visit('http://localhost:8000')
    cy.get('[data-cy=hamburger]').click()
  })

  it('can start a new test and answer a question', function() {
    cy.get('[data-cy=test-tab]').click()
    cy.url().should('include', '/tests')
    cy.get('[data-cy=start-test]').click()
    cy.get('.test-container')
  })
})