

describe("dictionary", function () {
  this.beforeAll(function () {
    cy.login('Finnish')
  })

  this.beforeEach(function () {
    cy.viewport(1920, 1080)
    // Reset the dictionary (translation) language to English so tests don't
    // depend on each other. The "translate-to language can be changed" test
    // persists a different language on the user, which would otherwise break
    // the translation assertions below.
    cy.setDictionaryLanguage('English')
    cy.loginExisting(this.user)
    cy.intercept('GET', '**/api/**').as('apiCall')
    cy.intercept('GET', '**/api/translate*').as('translate')
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

  it("word translates correctly", function () {
    cy.contains("poliisi", { timeout: 10000 })
      .scrollIntoView()
      .click()
    cy.wait('@translate', { timeout: 15000 })
    cy.get('[data-cy="dictionary-help"]', { timeout: 10000 })


    cy.get('[data-cy="translations"] .translation-glosses', { timeout: 10000 })
          .contains("police officer")

  })

  it("changing translate-to language re-translates the word", function () {
    cy.contains("poliisi", { timeout: 10000 })
      .scrollIntoView()
      .click()
    cy.wait('@translate', { timeout: 15000 })
    cy.get('[data-cy=dictionary-help]', { timeout: 10000 })
      .scrollIntoView()
      .should('be.visible')
      .within(() => {
        cy.get('[data-cy="translations"] .translation-glosses', { timeout: 10000 })
          .contains("police officer")
      })
    cy.get("[data-cy=ai-assistant-settings-popup]", { timeout: 10000 }).click()
    cy.get("[data-cy=dictionary-dropdown]", { timeout: 10000 }).select("Espanja", { force: true })
    cy.wait('@translate', { timeout: 15000 })
    cy.get('[data-cy=dictionary-help]', { timeout: 10000 })
      .scrollIntoView()
      .should('be.visible')
      .within(() => {
        cy.get('[data-cy="translations"] .translation-glosses', { timeout: 10000 })
          .contains("policía")
      })
  })
})