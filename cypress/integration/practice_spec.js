describe("practice mode", function () {
  const practiceURL = "http://localhost:8000/stories/5c407e9eff634503466b0dde/practice"

  this.beforeAll(function () {
    cy.login()
  })

  this.beforeEach(function () {
    cy.loginExisting()
    cy.visit(practiceURL)
  })

  it("can type into cloze fields", function () {
    cy.get("[data-cy=exercise-cloze]", { timeout: 10000 }).each(element => {
      cy.get(element).type("h3hasdi3g92137fhs", { force: true })
    })
  })

  it("can submit answers", function () {
    cy.get("[data-cy=check-answer]").click()
  })

  it("can get to next snippet after two retries", function () {
    cy.contains('0 / 8', { timeout: 20000 })

    cy.get("[data-cy=check-answer]").click()
    cy.get("[data-cy=check-answer]").click()

    cy.contains('1 / 8', { timeout: 20000 })
  })

  it("shows feedback", function () {
    cy.get("[data-cy=exercise-cloze]", { timeout: 10000 }).each(element => {
      cy.get(element).type("h3hasdi3g92137fhs", { force: true })
    })
    cy.get("[data-cy=check-answer]").click()

    //Locate incorrecly answered cloze exercise:
    cy.get("[data-cy=exercise-cloze]").eq(0).should("have.class", "wrong")
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })
})