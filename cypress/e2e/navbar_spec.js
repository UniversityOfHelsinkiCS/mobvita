describe("via navbar", function () {
  this.beforeAll(function () {
    cy.login()
  })

  this.beforeEach(function () {
    cy.loginExisting().as('user')
    cy.visit('http://localhost:8000/home')
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

  it("can open and close terms and conditions", function () {
    cy.get('[data-cy=navbar-info-dropdown]').click()
    cy.get('[data-cy=navbar-tc-button]').click()
    cy.get('[data-cy=tc-content]')
    cy.get('.inverted').click(-50, -50, { force: true })
  })

  it("can find 'About' dropdown menu item", function () {
    cy.get('[data-cy=navbar-info-dropdown]').click()
    cy.get('[data-cy=navbar-about-button]')
  })

  it("ui language can be changed and is saved", function () {
    cy.get('[data-cy=navbar-settings-button]').click()
    cy.get('[data-cy=ui-lang-dropdown]').click()
    cy.get('[data-cy=ui-lang-dropdown] > .visible > :nth-child(4)').click()
    cy.contains('Lingua dell\'interfaccia')
    cy.get('[data-cy=navbar-user-dropdown]').click()
    cy.get('[data-cy=navbar-logout-button]').click()
    cy.request('POST', '/api/session', { ...this.user })
      .as('user')
      .then(response => {
        window.localStorage.setItem('user', JSON.stringify(response.body))
        cy.reload()
      })
    cy.contains('Lingua dell\'interfaccia')
  })

  it("can visit groups view", function () {
    cy.get('[data-cy=navbar-groups-button]').click()
    cy.get('[data-cy=join-group-button]')
  })
})