/// <reference types="Cypress" />


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
    cy.get('[data-cy=practice-now]')
  })

  describe('when logged in', function() {
    this.beforeEach( function() {
      cy.request('POST', '/api/session', { email: 'elbert.alyas@plutocow.com', password: 'emacsemacs'})
        .as('user')
        .then(response => {
          window.localStorage.setItem('user', JSON.stringify(response.body))
          cy.reload()
        })
      cy.request({
        method: 'POST',
        url: '/api/user',
          headers: {
            'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1ODEzMzQyNDAsIm5iZiI6MTU4MTMzNDI0MCwianRpIjoiODA1OTgzZDgtNWVlNy00ZTJiLThkNGMtMGY2NTYwNmViODM3IiwiaWRlbnRpdHkiOiI1YzQ1ZjE2YWZmNjM0NTA1NjZlOGY4ZjciLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.WwwyhqmTk9kWG10QkDbrbsyAlcPUYvOm3Q8c7sxucYk`
          },
        body: {
          last_used_lang: 'Finnish',
          interface_lang: 'Finnish',
          last_trans_lang: 'Finnish'
        }
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

    it("can start filtered practice", function(){
      cy.get('[data-cy=practice-now]').click()
      cy.get("[data-cy=category-science]").click()
      cy.get("[data-cy=category-uncategorized]").click()
      cy.get("[data-cy=start-random]").click()
    })

    it("cant start filtered practice with 0 stories", function(){
      const categories = ["politics","culture","science","sport","uncategorized"]
      cy.get('[data-cy=practice-now]').click()
      categories.forEach(category => {
        cy.get(`[data-cy=category-${category}]`).click()
      })
      cy.get("[data-cy=start-random]").should("be.disabled")
    })

    it("can open and close terms and conditions", function(){
      cy.get('.bars').click()
      cy.get('[data-cy=tc-button]').click()
      cy.get('[data-cy=tc-content]')
      cy.get('.inverted').click(-50, -50, { force: true })
    })

    it("can read about (mob|re)vita", function() {
      cy.get('.bars').click()
      cy.get('[data-cy=about-button]').click()
      cy.get('[data-cy=about-content]')
    })

    describe("dictionary", function(){

      this.beforeEach(function(){
        cy.visit("http://localhost:8000/stories/5c407e9eff634503466b0dde/")
        cy.get(".book") // Open dictionaryhelp
          .click()
      })

      it("dictionary opens", function(){
        cy.contains("Klikkaa sinulle tuntemattomia sanoja tekstissä saadaksesi käännöksiä.")
      })

      it("translate-to language can be changed", function(){
        cy.get("[data-cy=dictionary-dropdown] > div.text")
          .click()
        cy.get(".visible > :nth-child(6)")
          .contains("Finnish")
          .click()
      })

      it("word translates correctly", function(){
        cy.contains("poliisi")
          .click()
        cy.contains("yhteiskunnassa järjestystä ja turvallisuutta valvova ja ylläpitävä virkamies")
      })

      it("changing translate-to language re-translates the word", function(){
        cy.contains("poliisi")
          .click()
        cy.contains("yhteiskunnassa järjestystä ja turvallisuutta valvova ja ylläpitävä virkamies")
        cy.get("[data-cy=dictionary-dropdown] > div.text")
        .click()
        cy.get(".visible > :nth-child(5)")
          .contains("Spanish")
          .click()
        cy.contains("policía")
      })

    })

    describe("stories", function(){
      it('can be created', function(){
        cy.get("[data-cy=library-tab]")
          .click()
        cy.get('[data-cy=new-story-input]')
          .type('https://yle.fi/uutiset/3-11191886')
        cy.get('[data-cy="submit-story"]')
          .click()
        cy.contains('Validating url-address')
      })
    })
  })
})