
function logout() {
  cy.get('.bars').click()
  cy.contains('Log out').click()
}

describe('Mobvita', function() {
  this.beforeEach(function() {
    cy.visit('http://localhost:8000')
  })

  it('login page opens', function() {
    cy.contains('Login')
  })

  it('can log in as anonymous', function() {
    cy.contains(/Test Mobvita.*/)
      .click()
    cy.get('.bars').click()
    cy.contains('Anonymous User')
    cy.contains('Log out').click()
  })

  describe('when logged in', function() {
    this.beforeEach(function() {
      cy.get('input:first')
        .type('elbert.alyas@plutocow.com')
      cy.get('input:last')
        .type('emacsemacs')
      cy.get('form')
        .contains('Login')
        .click()
    })

    this.afterEach(function() {
      logout()
    })

    it('library opens', function() {
      cy.contains('Library')
        .click()
      cy.contains('GO!')
    })

    it('can start random practice', function() {
      cy.contains('Practice now').click()
      cy.contains(/Start.*/).click()
      cy.contains('Skip this part')
    })
  })
})