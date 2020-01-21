describe('Mobvita', function() {
  this.beforeEach(function() {
    cy.visit('http://localhost:8000')
  })
  it('login page opens', function() {
    cy.contains('Login')
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