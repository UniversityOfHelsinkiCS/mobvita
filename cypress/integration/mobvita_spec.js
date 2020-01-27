describe('Mobvita', function() {
  this.beforeEach(function() {
    cy.visit('http://localhost:8000')
  })

  it('can log in as anonymous', function() {
    cy.get('[data-cy=login-anon]')
      .click()
    cy.get('[data-cy=choose-lang]')
  })

  it('can log in as user', function() {
    cy.get('input:first')
      .type('elbert.alyas@plutocow.com')
    cy.get('input:last')
      .type('emacsemacs')
    cy.get('form')
      .get('[data-cy=login]')
      .click()
  })

  describe('when logged in', function() {
    this.beforeEach(function() {
      cy.request('POST', '/api/session', { email: 'elbert.alyas@plutocow.com', password: 'emacsemacs'})
        .as('user')
        .then(response => {
          window.localStorage.setItem('user', JSON.stringify(response.body))
          cy.reload()
        })
    })

    it('library opens', function() {
      cy.get('[href="/library"]')
        .click()
      cy.get('[data-cy=library-controls]')
      cy.url().should('include', '/library')
    })

    it('can start random practice', function() {
      cy.get('[data-cy=practice-now]').click()
      cy.get('[data-cy=start-random]').click()
      cy.get('[data-cy=practice-view]')
    })
  })
})