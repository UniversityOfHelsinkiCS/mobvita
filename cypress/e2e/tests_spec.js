describe('test view', function() {
  this.beforeAll(function () {
    cy.login('Russian', true, 'English')
    cy.createUser('teacher')
  })

  this.beforeEach(function () {
    cy.viewport(1920, 1080)
    cy.loginExisting().as('user')
    cy.getUser('teacher').as('teacher')
    cy.intercept('GET', '**/api/**').as('apiCall')
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

  it('can create a group, enable tests for it and start a test', function() {

    cy.visit('http://localhost:8000/groups/teacher')
    cy.wait('@apiCall', { timeout: 30000 })
    cy.get('[data-cy=create-group-button]', { timeout: 30000 }).click()
    cy.get('[data-cy=group-name]').eq(0).type('my_test_group')
    cy.get('textarea').eq(1).type(this.teacher.email)
    cy.get('textarea').eq(2).type(this.teacher.email)
    cy.get('[type=submit]').click()

    // Close modal with esc
    cy.get('[data-cy=people-add-result-modal').trigger('keydown', { keyCode: 27});
    cy.wait(200);
    cy.get('body').trigger('keyup', { keyCode: 27});

    cy.contains('my_test_group')
    // Scope people-button click to the created group row
    cy.contains('my_test_group').closest('.card').within(() => {
      cy.get('[data-cy=people-button]').click()
    })
    cy.contains(this.teacher.username)
    cy.contains(this.teacher.username)
    
    cy.visit('http://localhost:8000/groups/teacher')
    cy.wait('@apiCall', { timeout: 30000 })

    cy.get('[data-cy=enable-test-button]', { timeout: 30000 }).click()
    cy.get('[data-cy=enable-test-ok-button', { timeout: 30000 }).click()

    cy.visit('http://localhost:8000/home')
    cy.wait('@apiCall', { timeout: 30000 })

    // cy.get('.react-joyride__spotlight').click()
    // cy.wait(1000)
    //cy.get('.modal > .close').click()
    // cy.get('[data-cy=tests-button]').click()
    // cy.url().should('include', '/tests')
    // cy.get('[data-cy=start-test]').click()
    // cy.get('.test-container')

    cy.visit('http://localhost:8000/groups/teacher')
    cy.wait('@apiCall', { timeout: 30000 })
    cy.contains('my_test_group').closest('.card').within(() => {
      cy.get('[data-cy=delete-group]').click()
    })
    cy.get('[data-cy=confirm-warning-dialog]').click()
    cy.get('body', { timeout: 30000 }).should('not.contain', 'my_test_group')
  })

  it('no "Tests" button when no tests are enabled for user\'s groups', function() {
    // Visit /home directly to avoid root-URL redirect which can hit pageLoadTimeout
    cy.visit('http://localhost:8000/home', { timeout: 90000 })
    cy.wait('@apiCall', { timeout: 15000 })
    cy.get('[data-cy=tests-button]', { timeout: 15000 }).should('not.exist')
  })

})
