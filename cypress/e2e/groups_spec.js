describe("groups", function () {
  this.beforeAll(function () {
    cy.login('Finnish', true, 'English')
    cy.createUser('student', 'Finnish')
    cy.createUser('teacher', 'Finnish', true)
  })

  this.beforeEach(function () {
    cy.viewport(1920, 1080)
    cy.loginExisting().as('user')
    cy.getUser('teacher').as('teacher')
    cy.getUser('student').as('student')
    cy.intercept('GET', '**/api/**').as('apiCall')
    cy.visit('localhost:8000/groups/teacher')
    cy.wait('@apiCall', { timeout: 10000 })
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

  it('new group can be created with students and teachers', function () {
    cy.get('[data-cy=create-group-button]').click()
    cy.get('[data-cy=add-group-form]').should('be.visible').within(() => {
      cy.get('[data-cy=group-name]').type('my_test_group')
      cy.get('[data-cy=teacher-emails]').type(this.teacher.email)
      cy.get('[data-cy=student-emails]').type(this.student.email)
      cy.get('[type=submit]').click()
    })
    
    // Close result modal (more reliable than ESC)
    cy.get('[data-cy=people-add-result-modal]').should('be.visible')
    cy.get('[data-cy=people-add-result-modal]').find('i.close.icon').click()

    cy.contains('h5', 'my_test_group', { timeout: 10000 })
      .closest('.card')
      .within(() => {
        cy.get('[data-cy=people-button]').click()
      })
    cy.contains(this.teacher.username)
    cy.contains(this.student.username)

    cy.visit('localhost:8000/groups/teacher')
    cy.contains('h5', 'my_test_group', { timeout: 10000 })
      .closest('.card')
      .within(() => {
        cy.get('[data-cy=delete-group]').click()
      })
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
    cy.contains('h5', 'destroyed', { timeout: 10000 })
      .closest('.card')
      .within(() => {
        cy.get('[data-cy=delete-group]').click()
      })
    cy.get('[data-cy=confirm-warning-dialog]').click()
    cy.get('body', { timeout: 10000 }).should('not.contain', 'destroyed')
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
    cy.visit('localhost:8000/groups/teacher')
    cy.wait('@apiCall', { timeout: 10000 })
    cy.reload()
    cy.contains('h5', 'other group', { timeout: 10000 })
      .closest('.card')
      .within(() => {
        cy.get('[data-cy=people-button]').click()
      })
    cy.contains('other group')
    // Scope add-to-group-button click to the modal context
    cy.get('[data-cy=add-to-group-button]').should('be.visible').click()

    cy.get('[data-cy=add-to-group-teacher-emails]').should('be.visible').type(this.teacher.email)
    cy.get('[data-cy=add-to-group-student-emails]').type(this.student.email)
    cy.get('[type=submit]').click()

    cy.get('.modal > .close').click()
    cy.contains(this.teacher.username)
    cy.contains(this.student.username)
    
    cy.get(`[data-cy=remove-from-group-${this.student.username}]`).click()
    cy.contains(this.student.username).should('not.exist')

    cy.visit('localhost:8000/groups/teacher')
    cy.wait('@apiCall', { timeout: 10000 })
    cy.contains('h5', 'other group', { timeout: 10000 })
      .closest('.card')
      .within(() => {
        cy.get('[data-cy=delete-group]').click()
      })
    cy.get('[data-cy=confirm-warning-dialog]').click()
  })
})