describe("sidebar is open", function () {
  this.beforeEach(function () {
    cy.login().as('user')
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

  it("can read about (mob|re)vita", function () {
    cy.get('[data-cy=about-button]').click()
    cy.get('[data-cy=about-content]')
  })

  it("ui language can be changed and is saved", function () {
    cy.get('[data-cy=ui-lang-select]').click()
    cy.get('[data-cy=ui-lang-select] > .visible > :nth-child(2)').click()
    cy.contains('Startsida')
    cy.get('[data-cy=logout]').click()
    cy.request('POST', '/api/session', { ...this.user })
      .as('user')
      .then(response => {
        window.localStorage.setItem('user', JSON.stringify(response.body))
        cy.reload()
      })
    cy.contains('Startsida')
  })

  it("can visit groups view", function () {
    cy.get('[data-cy=groups-link]').click()
    cy.get('[data-cy=create-group-modal]')
  })
})