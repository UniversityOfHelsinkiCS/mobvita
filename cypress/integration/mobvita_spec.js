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
    this.beforeEach(function() {
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
      }).then(() => cy.reload())
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

    describe("sidebar is open", function() {
      this.beforeEach(function(){
        cy.get('.bars').click()
      })


      it("can open and close terms and conditions", function(){
        cy.get('[data-cy=tc-button]').click()
        cy.get('[data-cy=tc-content]')
        cy.get('.inverted').click(-50, -50, { force: true })
      })

      it("can read about (mob|re)vita", function() {
        cy.get('[data-cy=about-button]').click()
        cy.get('[data-cy=about-content]')
      })

      it("ui language can be changed", function() {
        cy.get('[data-cy=ui-lang-select]').click()
        cy.get('[data-cy=ui-lang-select] > .visible > :nth-child(2)').click()
        cy.contains('Startsida')
      })
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
      this.beforeEach(function(){
        cy.get("[data-cy=library-tab]")
          .click()
      })

      it('can be created and upload progress bar seen', function(){
        cy.get('[data-cy=new-story-input]')
          .type('https://yle.fi/uutiset/3-11191886')
        cy.get('[data-cy="submit-story"]')
          .click()
        cy.contains('Validating url-address')
        cy.contains('Processing your story')
      })

      it('added story can be seen', function(){
        cy.contains('5G-kännyköitä')
      })

      it('added story can be read', function(){
        cy.contains('Lue')
          .click()
        cy.contains('Harjoittele')
        cy.contains('Tehokkaasta 5G-liittymästä')
      })
    })

    describe("read mode", function(){

      this.beforeEach(function(){
        cy.visit('http://localhost:8000/stories/5c407e9eff634503466b0dde/')
      })

      it("story opens", function(){
        cy.contains("Lauantai 22.12.2018 (radio)")
        cy.contains("Britanniassa poliisi on ehkä löytänyt ihmiset, jotka ovat häirinneet lentokoneita.")
        cy.contains("Etelä-Suomessa pakkasta on noin 10 astetta. Pohjois-Suomessa pakkasta on noin 20 astetta. Lapissa on yöllä jopa 30 astetta pakkasta.")
      })

      it("can click (translate) a word", function(){ // This test overlaps with dictionary
         cy.contains("Britanniassa")
          .click()
        cy.get('.book') // Open dictionaryhelp
          .click({force:true})
        cy.contains("Yhdistyneestä kuningaskunnasta käytetty lyhyt nimitys")
      })


    })
  })
})
