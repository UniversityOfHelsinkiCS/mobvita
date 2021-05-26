describe('wordnest modal', function() {
    const readURL = "http://localhost:8000/stories/5c082383ff63453c5423f99d/read"

    this.beforeAll(function () {
      cy.loginRussian()
    })
  
    this.beforeEach(function () {
        cy.loginExisting()
        cy.visit(readURL)
    })
  
    this.afterAll(function () {
      cy.cleanUsers()
    })

    it('fetches, displays and translates nest correctly', function() {
      cy.visit(readURL)
      cy.contains("спортсменка").click()
      cy.contains('sportswoman')
      cy.get('[data-cy=nest-button]').click()
      cy.contains("спорт")
      cy.contains('мото⋅спо́рт').click()
      cy.contains('motor sport')
      cy.contains('не⋅спорти́вный').click()
      cy.contains('unsportsmanlike')
    })

    it('doesn\'t display nest icon when nest is not available', function() {
      cy.visit(readURL)
      cy.contains("метровку").click()
      cy.wait(1000)
      cy.get('[data-cy=nest-button]').should('not.exist')
    })
  
  })
  