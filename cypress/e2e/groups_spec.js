describe("groups", function () {
  this.beforeAll(function () {
    cy.login()
    cy.createUser('teacher')
    cy.createUser('student')
  })

  this.beforeEach(function () {
    cy.loginExisting().as('user')
    cy.getUser('teacher').as('teacher')
    cy.getUser('student').as('student')
    cy.visit('http://localhost:8000/groups/teacher')
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

  it('new group can be created with students and teachers', function () {
    cy.get('[data-cy=create-group-button]').click()
    cy.get('input').eq(0).type('my_test_group')
    cy.get('textarea').eq(1).type(this.teacher.email)
    cy.get('textarea').eq(2).type(this.student.email)
    cy.get('[type=submit]').click()
    
    // Close modal with esc
    cy.get('[data-cy=people-add-result-modal').trigger('keydown', { keyCode: 27});
    cy.wait(200);
    cy.get('body').trigger('keyup', { keyCode: 27});

    cy.contains('my_test_group')
    cy.get('[data-cy=people-button]').click()
    cy.contains(this.teacher.username)
    cy.contains(this.student.username)

    cy.visit('http://localhost:8000/groups/teacher')
    cy.get('[data-cy=delete-group]').click()
    cy.get('[data-cy=confirm-warning-dialog]').click()
  })

  it('group can be removed', function () {
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
    cy.contains('destroyed').parent().parent().parent().find('[data-cy=delete-group]').click()
    cy.get('[data-cy=confirm-warning-dialog]').click()
    cy.get('[data-cy=no-groups-view]').should('not.contain', 'destroyed')
  })

  // it('user can leave group', function () {
  //   cy.request({
  //     method: 'POST',
  //     url: 'localhost:8000/api/groups',
  //     headers: {
  //       'Authorization': `Bearer ${this.user.token}`
  //     },
  //     body: {
  //       group_name: 'left'
  //     }
  //   })
  //   cy.reload()
  //   cy.contains('left').parent().parent().parent().find('[data-cy=leave-group]').click()
  //   cy.get('[data-cy=confirm-warning-dialog]').click()
  //   cy.get('[data-cy=group-list]').should('not.contain', 'left')
  // })

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
    cy.visit('http://localhost:8000/groups/teacher')
    cy.reload()
    cy.contains('other group')

    cy.get('[data-cy=people-button]').click()
    cy.contains('other group')
    cy.get('[data-cy=add-to-group-button]').click()

    cy.get('textarea').eq(0).type(this.teacher.email)
    cy.get('textarea').eq(1).type(this.student.email)
    cy.get('[type=submit]').click()

    cy.get('.modal > .close').click()
    cy.contains(this.teacher.username)
    cy.contains(this.student.username)
    
    cy.get(`[data-cy=remove-from-group-${this.student.username}]`).click()
    cy.contains(this.student.username).should('not.exist')

    cy.visit('http://localhost:8000/groups/teacher')
    cy.get('[data-cy=delete-group]').click()
    cy.get('[data-cy=confirm-warning-dialog]').click()
  })
})