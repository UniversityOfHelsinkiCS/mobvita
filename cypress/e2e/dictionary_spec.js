

describe("dictionary", function () {
  this.beforeAll(function () {
    cy.login('Finnish')
  })

  this.beforeEach(function () {
    cy.viewport(1920, 1080)
    cy.loginExisting(this.user)
    cy.intercept('GET', '**/api/**').as('apiCall')
    cy.visit("http://localhost:8000/stories/5c407e9eff634503466b0dde/preview")
    cy.wait('@apiCall', { timeout: 10000 })
    // cy.get('[data-cy=dictionary-icon]') // Open dictionaryhelp
    //   .click({ force: true })
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

  it("dictionary info opens", function () {
    cy.get("[data-cy=helper-sidebar-toggle]", { timeout: 10000 })
      .scrollIntoView()
      .should('be.visible')
      .click()
    cy.get("[data-cy=dictionary-info]", { timeout: 10000 }).should('be.visible')
    cy.contains("Napsauta harjoitusta — jos siitä herää kysymyksiä, voit kysyä täällä.", { timeout: 10000 })
  })

    it("translate-to language can be changed", function () {
    cy.contains("lentokoneita", { timeout: 10000 }).click()
    cy.get("[data-cy=ai-assistant-settings-popup]", { timeout: 10000 }).click()
    cy.get("[data-cy=dictionary-dropdown]", { timeout: 10000 }).select("Suomi", { force: true })
  })
/*
  it("word translates correctly", function () {
    cy.contains("poliisi")
      .click()
    cy.get('[data-cy=translations]')
      .contains("yhteiskunnassa järjestystä ja turvallisuutta valvova ja ylläpitävä virkamies")
  })

  it("changing translate-to language re-translates the word", function () {
    cy.contains("poliisi")
      .click()
    cy.get('[data-cy=translations]')
      .contains("yhteiskunnassa järjestystä ja turvallisuutta valvova ja ylläpitävä virkamies")
    cy.get("[data-cy=dictionary-dropdown]").select("Espanja")
    cy.get('[data-cy=translations]')
      .contains("policía")
  })
*/
})