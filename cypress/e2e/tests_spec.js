describe('test view', function() {
  this.beforeAll(function () {
    cy.loginRussian()
    cy.createUser('teacher')
  })

  this.beforeEach(function () {
    cy.loginExisting().as('user')
    cy.getUser('teacher').as('teacher')
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

  it('can create a group, enable tests for it and start a test', function() {

    cy.visit('http://localhost:8000/groups/teacher')
    cy.get('[data-cy=create-group-button]').click()
    cy.get('input').eq(0).type('my_test_group')
    cy.get('textarea').eq(1).type(this.teacher.email)
    cy.get('textarea').eq(2).type(this.teacher.email)
    cy.get('[type=submit]').click()

    // Close modal with esc
    cy.get('[data-cy=people-add-result-modal').trigger('keydown', { keyCode: 27});
    cy.wait(200);
    cy.get('body').trigger('keyup', { keyCode: 27});

    cy.contains('my_test_group')
    cy.get('[data-cy=people-button]').click()
    cy.contains(this.teacher.username)
    cy.contains(this.teacher.username)
    
    cy.visit('http://localhost:8000/groups/teacher')

    cy.get('[data-cy=enable-test-button]').click()
    cy.get('[data-cy=enable-test-ok-button').click()

    cy.visit('http://localhost:8000/home')

    // cy.get('.react-joyride__spotlight').click()
    // cy.wait(1000)
    //cy.get('.modal > .close').click()
    cy.get('[data-cy=tests-button]').click()
    cy.url().should('include', '/tests')
    cy.get('[data-cy=start-test]').click()
    cy.get('.test-container')

    cy.visit('http://localhost:8000/groups/teacher')
    cy.contains('my_test_group').parent().parent().parent().find('[data-cy=delete-group]').click()
    cy.get('[data-cy=confirm-warning-dialog]').click()
    cy.get('[data-cy=no-groups-view]').should('not.contain', 'my_test_group')
  })

  it('no "Tests" button when no tests are enabled for user\'s groups', function() {
    cy.visit('http://localhost:8000')
    cy.wait(500)
    //cy.get('.modal > .close').click()
    cy.get('[data-cy=tests-button]').should('not.exist')
  })

})
