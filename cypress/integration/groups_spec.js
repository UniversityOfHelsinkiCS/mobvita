describe("groups", function () {
  this.beforeEach(function () {
    cy.login().as('user')
    cy.createUser().as('teacher')
    cy.createUser().as('student')
    cy.visit('http://localhost:8000/groups/')
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

  it('new group can be created with students and teachers', function () {


    cy.get('[data-cy=create-group-modal]').click()
    cy.get('input').eq(0).type('my_test_group')
    cy.get('textarea').eq(0).type(this.teacher.email)
    cy.get('textarea').eq(1).type(this.student.email)

    cy.get('[type=submit]').click()
    cy.contains('my_test_group')
    cy.get('[class=card-header]').eq(0).click()
    cy.contains(this.teacher.username)
    cy.get('[class=card-header]').eq(1).click()
    cy.contains(this.student.username)
  })

  it('group can be removed', function() {
    cy.request({
      method: 'POST',
      url: 'localhost:8000/api/groups',
      headers: {
        'Authorization': `Bearer ${this.user.token}`
      },
      body: {
        group_name: 'destroyed'
      }
    })
    cy.reload()
    cy.get('[data-cy=select-group]').click()
    cy.contains('destroyed').click()
    cy.get('[data-cy=delete-group]').click()
    cy.contains('destroyed').should('not.exist')
  })

  it('users can be added to group and removed', function () {
    cy.request({
      method: 'POST',
      url: 'localhost:8000/api/groups',
      headers: {
        'Authorization': `Bearer ${this.user.token}`
      },
      body: {
        group_name: 'other group'
      }
    })
    cy.reload()
    cy.get('[data-cy=select-group]').click()
    cy.contains('other group').click()
    cy.get('[data-cy=add-to-group-modal]').click()
    cy.get('textarea').eq(0).type(this.teacher.email)
    cy.get('textarea').eq(1).type(this.student.email)
    cy.get('[type=submit]').click()

    cy.get('[class=card-header]').eq(0).click()
    cy.contains(this.teacher.username)

    cy.get('[class=card-header]').eq(1).click()
    cy.contains(this.student.username)

    cy.get(`[data-cy=remove-from-group-${this.student.username}]`).click()
    cy.contains(this.student.username).should('not.exist')
  })
})