let globalUser = null
const users = []
let randomID = Math.floor(Math.random() * 1000000000)

describe("in 'profile' page", function () {
    this.beforeAll(function () {
      cy.login()
    })
  
    this.beforeEach(function () {
      cy.loginExisting().as('user')
      cy.visit('http://localhost:8000/profile/following')
    })
  
    this.afterAll(function () {
      cy.cleanUsers()
    })
  
    it('a user can be followed', function () {

      globalUser = createRandomUser()
      cy.get('[data-cy=follow-user-button]').click()
      cy.get('textarea').eq(0).type(globalUser.email)
      cy.get('[type=submit]').click()
      cy.reload()
      cy.get('[data-cy=followed-table]').contains(globalUser.username)
    })

    it('a user can be blocked', function () {
        globalUser = createRandomUser()
        console.log(globalUser)
        cy.get('[data-cy=block-user-button]').click()
        cy.get('textarea').eq(0).type(globalUser.email)
        cy.get('[type=submit]').click()
        cy.reload()
        cy.get('[data-cy=blocked-table]').contains(globalUser.username)
      })
  })

  function randomCredentials() {
    const id = randomID++
    const email = `mobvita${id}@testcypress.foobar123`
    const username = `mobvita${id}`
    const password = 'securepassword'
  
    return { email, username, password }
  }
  
  function createRandomUser() {
    const user = randomCredentials()
    cy.request('POST', 'localhost:8000/api/register/test', { ...user })
      .then((response) => {
        user.token = response.body.access_token
        console.log(user)
      })
    cy.request('POST', 'localhost:8000/api/confirm/test', { ...user })
  
    users.push(user)
    return user
  }