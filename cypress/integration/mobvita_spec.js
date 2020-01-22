describe('Mobvita', function() {
  this.beforeEach(function() {
    cy.visit('http://localhost:8000')
  })

  it('can log in as anonymous', function() {
    cy.contains(/Test Mobvita.*/)
      .click()
    cy.get('.bars').click()
    cy.contains('Anonymous User')
    cy.contains('Log out').click()
  })

  it('can log in as user', function() {
    cy.get('input:first')
      .type('elbert.alyas@plutocow.com')
    cy.get('input:last')
      .type('emacsemacs')
    cy.get('form')
      .contains('Login')
      .click()
  })

  describe('when logged in', function() {
    this.beforeEach(function() {
      cy.request('POST', '/api/session', { email: 'elbert.alyas@plutocow.com', password: 'emacsemacs'})
        .then(response => {
          window.localStorage.setItem('user', JSON.stringify(response.body))
        })
      cy.reload()
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