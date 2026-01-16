describe('wordnest modal', function () {
  const previewURL = 'http://localhost:8000/stories/5c082383ff63453c5423f99d/preview'

  this.beforeAll(function () {
    cy.login('Russian')
  })

  this.beforeEach(function () {
    cy.login('Russian')

    cy.intercept('GET', '**/api/stories/**').as('getStory')
    cy.visit(previewURL)
    cy.wait('@getStory')

    cy.get('body', { timeout: 20000 }).should('be.visible')
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

  it('fetches, displays and translates word nest modal correctly', function () {
    cy.contains('спортсменка', { timeout: 10000 }).click()
    cy.contains('sportswoman', { timeout: 10000 })

    cy.get('[data-cy=nest-button]', { timeout: 10000 }).should('be.visible').click()

    cy.get('[data-cy=wordnest-modal]', { timeout: 10000 })
      .should('be.visible')
      .within(() => {
        cy.contains('спорт', { timeout: 10000 })

        cy.contains('[data-cy="wordnest-word"]', 'спорт⋅сме́н', { timeout: 10000 })
          .scrollIntoView()
          .click()

        cy.contains('sportsman', { timeout: 10000 })

        cy.contains('[data-cy="wordnest-word"]', 'не⋅спорти́вный', { timeout: 10000 })
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
    
    cy.get('[data-cy=wordnest-modal]', { timeout: 10000 }).should('be.visible')
    
    cy.get('.ui.dimmer.modals.page', { timeout: 10000 })
      .filter(':visible')
      .first()
      .click('bottomLeft')
    
    cy.get('[data-cy=wordnest-modal]', { timeout: 2000 }).should('not.exist')
  })

  it('closes wordnest modal when clicking close button', function () {
    cy.contains('спортсменка', { timeout: 10000 }).click()
    cy.contains('sportswoman', { timeout: 10000 })
    
    cy.get('[data-cy=nest-button]', { timeout: 10000 }).should('be.visible').click()

    cy.get('[data-cy=wordnest-modal]', { timeout: 10000 })
      .should('be.visible')
      .within(() => {
        cy.get('[data-cy=wordnest-close]', { timeout: 10000 })
          .should('exist')
          .click()
      })

    cy.get('[data-cy=wordnest-modal]', { timeout: 2000 }).should('not.exist')
  })
})
