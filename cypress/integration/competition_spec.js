describe("competition mode", function () {
  const competeURL = "http://localhost:8000/stories/5c080874ff6345361ec09dd8/compete"

  this.beforeAll(function () {
    cy.login()
  })

  this.beforeEach(function () {
    cy.loginExisting()
    cy.visit(competeURL)
  })

  it("can be started", function () {
    cy.get("[data-cy=opponent-bar]")
    cy.get("[data-cy=player-bar]")
  })

  it("shows player's progress correctly", function () {
    cy.get('[data-cy=next-snippet-ready] > span').click()
    cy.get('[data-cy=progress-033]')
    cy.get('[data-cy=next-snippet-ready] > span').click()
    cy.get('[data-cy=progress-067]')
    cy.get('[data-cy=next-snippet-ready] > span').click()
    cy.get('[data-cy=progress-100]')
  })

  it("shows end modal when competition has ended", function () {
    cy.get('[data-cy=next-snippet-ready] > span').click()
    cy.get('[data-cy=next-snippet-ready] > span').click()
    cy.get('[data-cy=next-snippet-ready] > span').click()
    cy.get('[data-cy=competition-end-modal]')
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })
})