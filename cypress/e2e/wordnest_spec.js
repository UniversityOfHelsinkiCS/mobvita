describe('wordnest modal', function () {
  const previewURL = 'http://localhost:8000/stories/5c082383ff63453c5423f99d/preview'

  this.beforeAll(function () {
    cy.login('Russian')
  })

  this.beforeEach(function () {
    cy.loginExisting()
    cy.visit(previewURL)
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

  it('fetches, displays and translates word nest modal correctly', function () {
    cy.contains('спортсменка', { timeout: 10000 }).click()
    cy.contains('sportswoman', { timeout: 10000 })

    cy.get('[data-cy=nest-button]', { timeout: 10000 }).should('be.visible').click()

    cy.get('.ui.modal.visible.active', { timeout: 10000 })
      .filter(':visible')
      .should('have.length.at.least', 1)
      .first()
      .within(() => {
        cy.contains('спорт', { timeout: 10000 })

        cy.contains('span.wordnest-word', 'спорт⋅сме́н', { timeout: 10000 }).scrollIntoView().click()
        cy.contains('sportsman', { timeout: 10000 })

        cy.contains('span.wordnest-word', 'не⋅спорти́вный', { timeout: 10000 })
          .scrollIntoView()
          .click()
        cy.contains('unsportsmanlike', { timeout: 10000 })
      })
  })

  it("doesn't display nest icon when nest is not available", function () {
    cy.contains('метровку', { timeout: 10000 }).click()
    cy.get('[data-cy=nest-button]', { timeout: 2000 }).should('not.exist')
  })
  
  it('close wordnest modal when clicking outside', function () {
    cy.contains('спортсменка', { timeout: 10000 }).click()
    cy.contains('sportswoman', { timeout: 10000 })
    
    cy.get('[data-cy=nest-button]', { timeout: 10000 }).should('be.visible').click()
    
    cy.get('.ui.modal.visible.active', { timeout: 10000 })
      .filter(':visible')
      .should('have.length.at.least', 1)
      .first()
    
    cy.get('.ui.dimmer.modals.page')
      .filter(':visible')
      .first()
      .click('bottomLeft')
    
    cy.get('.ui.modal.visible.active', { timeout: 2000 }).should('not.exist')
  })

  it('closes wordnest modal when clicking close button', function () {
    cy.contains('спортсменка', { timeout: 10000 }).click()
    cy.contains('sportswoman', { timeout: 10000 })
    
    cy.get('[data-cy=nest-button]', { timeout: 10000 }).should('be.visible').click()

    cy.get('.ui.modal.visible.active', { timeout: 10000 })
      .filter(':visible')
      .first()
      .should('be.visible')
      .within(() => {
        cy.get('i.close.small.icon.clickable', { timeout: 10000 })
          .should('exist')
          .click()
      })

    cy.get('.ui.modal.visible.active', { timeout: 2000 }).should('not.exist')
  })
})
