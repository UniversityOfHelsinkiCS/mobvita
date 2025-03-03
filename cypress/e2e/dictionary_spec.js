

describe("dictionary", function () {
  this.beforeAll(function () {
    cy.login('Finnish')
  })

  this.beforeEach(function () {
    cy.viewport(1920, 1080)
    cy.loginExisting(this.user)
    cy.visit("http://localhost:8000/stories/5c407e9eff634503466b0dde/preview")
    // cy.get('[data-cy=dictionary-icon]') // Open dictionaryhelp
    //   .click({ force: true })
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

  it("dictionary opens", function () {
    cy.get("[data-cy=dictionary-info]")
  })

  it("translate-to language can be changed", function () {
    cy.get("[data-cy=dictionary-dropdown]").select("Suomi")

  })

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

})