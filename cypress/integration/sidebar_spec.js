describe("sidebar is open (only mobile)", function () {
  this.beforeAll(function () {
    cy.login()
  })

  this.beforeEach(function () {
    cy.viewport(375, 667) // Set a mobile resolution
    cy.loginExisting().as('user')
    cy.visit('http://localhost:8000')
    cy.get('[data-cy=hamburger]').click()
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

  it("can open and close terms and conditions", function () {
    cy.get('[data-cy=tc-button]').click()
    cy.get('[data-cy=tc-content]')
    cy.get('.inverted').click(-50, -50, { force: true })
  })

  it("ui language can be changed and is saved", function () {
    cy.get('[data-cy=ui-lang-select]').click()
    cy.get('[data-cy=ui-lang-select] > .visible > :nth-child(4)').click()
    cy.contains('Profilo')
    cy.get('[data-cy=logout]').click()
    cy.request('POST', '/api/session', { ...this.user })
      .as('user')
      .then(response => {
        window.localStorage.setItem('user', JSON.stringify(response.body))
        cy.reload()
      })
    cy.contains('Profilo')
  })

  it("can visit groups view", function () {
    cy.get('[data-cy=groups-link]').eq(1).click()
    cy.get('[data-cy=create-group-button]')
  })
})