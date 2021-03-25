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
    cy.get('[data-cy=create-group]').click()
    cy.get('input').eq(0).type('my_test_group')
    cy.get('textarea').eq(1).type(this.teacher.email)
    cy.get('textarea').eq(2).type(this.teacher.email)
    cy.get('[type=submit]').click()
    cy.contains('my_test_group')
    cy.reload()
    cy.get('[class=card-header]').eq(0).click()
    cy.contains(this.teacher.username)
    cy.get('[class=card-header]').eq(1).click()
    cy.contains(this.teacher.username)
    
    cy.visit('http://localhost:8000/groups/teacher')
    cy.get('[data-cy=enable-test-button]').click()
    cy.get('[data-cy=enable-test-one-day]').click()

    cy.visit('http://localhost:8000/home')
    cy.get('[data-cy=test-tab]').click()
    cy.url().should('include', '/tests')
    cy.get('[data-cy=start-test]').click()
    cy.get('.test-container')
  })

  it('no "Tests" tab when no tests are enabled for user\'s groups', function() {
    cy.visit('http://localhost:8000')
    cy.get('[data-cy=test-tab]').should('not.exist')
  })
})
