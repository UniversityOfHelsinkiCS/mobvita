// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
let randomID = Math.floor(Math.random() * 1000000000)

const users = []


function randomCredentials() {
  const id = randomID++
  const email = `mobvita${id}@testcypress.foobar123`
  const username = `mobvita${id}`
  const password = 'securepassword'

  return { email, username, password }
}

function createRandomUser() {
  const user = randomCredentials()
  cy.request('POST', 'localhost:8000/api/register', { ...user })
    .then((response) => {
      user.token = response.body.access_token
      console.log(user)
    })
  cy.request('POST', 'localhost:8000/api/confirm/test', { ...user })

  users.push(user)
  return
}

Cypress.Commands.add('login', function () {
  const user = randomCredentials()
  cy.request('POST', 'localhost:8000/api/register', { ...user })
    .then(function (response) {
      user.token = response.body.access_token

      cy.request('POST', 'localhost:8000/api/confirm/test', { ...user })
      users.push(user)
      cy.request({
        method: 'POST',
        url: 'localhost:8000/api/user',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: {
          last_used_lang: 'Finnish',
          last_trans_lang: 'English'
        }
      })
      cy.request('POST', 'localhost:8000/api/session', { ...user })
          .as('user')
          .then(response => window.localStorage.setItem('user', JSON.stringify(response.body)))

      cy.reload()
    })
})

Cypress.Commands.add('cleanUsers', function () {
  for (let user of users) {
    cy.request({
      method: 'POST',
      url: 'localhost:8000/api/user/remove',
      headers: {
        'Authorization': `Bearer ${user.token}`
      },
      body: {
        password: user.password,
        is_test: true
      }
    })
  }
})