describe('wordnest modal', function() {
    const previewURL = "http://localhost:8000/stories/5c082383ff63453c5423f99d/preview"

    this.beforeAll(function () {
      cy.loginRussian()
    })
  
    this.beforeEach(function () {
        cy.loginExisting()
        cy.visit(previewURL)
    })
  
    this.afterAll(function () {
      cy.cleanUsers()
    })

    it('fetches, displays and translates nest correctly', function() {
      cy.visit(previewURL)
      cy.contains("спортсменка").click()
      cy.contains('sportswoman')
      cy.get('[data-cy=nest-button]').click()
      cy.contains("спорт")
      cy.contains('спорт⋅сме́н').click()
      cy.contains('sportsman')
      cy.contains('не⋅спорти́вный').click()
      cy.contains('unsportsmanlike')
    })

    it('doesn\'t display nest icon when nest is not available', function() {
      cy.visit(previewURL)
      cy.contains("метровку").click()
      cy.wait(1000)
      cy.get('[data-cy=nest-button]').should('not.exist')
    })
  
  })
  