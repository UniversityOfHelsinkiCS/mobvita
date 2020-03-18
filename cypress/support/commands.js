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

let users = []

let savedUsers = {}

let currentUser = null

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

Cypress.Commands.add('login', function (transLang = 'English') {
  const user = randomCredentials()
  cy.request(
    {
      method: 'POST', 
      url: 'localhost:8000/api/register', 
      body: { ...user },
      retryOnNetworkFailure: true
    })
    .then(function (response) {
      user.token = response.body.access_token
      currentUser = user
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
          last_trans_lang: transLang,
          interface_lang: 'Finnish'
        },
        retryOnNetworkFailure: true
      })
      cy.request('POST', 'localhost:8000/api/session', { ...user })
          .as('user')
          .then(response => window.localStorage.setItem('user', JSON.stringify(response.body)))

      cy.reload()
    })

    return cy.wrap(user)
})

Cypress.Commands.add('loginExisting', function () {
  cy.request('POST', 'localhost:8000/api/session', { ...currentUser })
    .then(response => window.localStorage.setItem('user', JSON.stringify(response.body)))
  
  return cy.wrap(currentUser)
})

Cypress.Commands.add('createUser', function(name) {
  const user = randomCredentials()
  cy.request('POST', 'localhost:8000/api/register', { ...user })
    .then(function (response) {
      user.token = response.body.access_token

      cy.request('POST', 'localhost:8000/api/confirm/test', { ...user })
      users.push(user)
  })
  if (name) {
    savedUsers[name] = user
  }

  return cy.wrap(user)
})

Cypress.Commands.add('getUser', function(name) {
  return cy.wrap(savedUsers[name])
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

  users = [];
  savedUsers = {}
  currentUser = null
})