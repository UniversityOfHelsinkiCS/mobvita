/// <reference types="Cypress" />

let globalUser = null
const users = []
let randomID = Math.floor(Math.random() * 1000000000)

describe('Mobvita', function () {
  this.beforeAll(function () {
    globalUser = createRandomUser()
  })

  this.afterAll(function () {
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

    cy.cleanUsers();
  })

  this.beforeEach(function () {
    cy.visit('http://localhost:8000')
  })

  it('can create a new user, has English as default ui language', function () {
    const user = randomCredentials()

    const { email, username, password } = user
    cy.get('[data-cy=register-button]').click()
    cy.get('input').eq(0).type(email)
    cy.get('input').eq(1).type(username)
    cy.get('input').eq(2).type(password)
    cy.get('input').eq(3).type(password)
    cy.get('[data-cy=accept-terms]').click()
    cy.get('[type=submit]').click()

    cy.get('[class=Toastify]').contains('Account creation success')
    cy.request('POST', 'localhost:8000/api/confirm/test', { ...user })
      .then(response => {
        user.token = response.body.access_token
      })

    users.push(user)

    cy.get('input:first')
      .type(user.email)
    cy.get('input:last')
      .type(user.password)
    cy.get('form')
      .get('[data-cy=login]')
      .click()
    cy.contains('Learning language')
  })

  it('can log in as anonymous', function () {
    cy.get('[data-cy=login-anon]')
      .click()
    cy.get('[data-cy=choose-lang]')
  })

  it('can log in as user', function () {
    cy.get('input:first')
      .type(globalUser.email)
    cy.get('input:last')
      .type(globalUser.password)
    cy.get('form')
      .get('[data-cy=login]')
      .click()
    cy.get('[data-cy=choose-lang]')
  })

  describe('when logged in', function () {
    this.beforeEach(function () {
      cy.request({
        method: 'POST',
        url: '/api/user',
        headers: {
          'Authorization': `Bearer ${globalUser.token}`
        },
        body: {
          last_used_lang: 'Finnish',
          interface_lang: 'Finnish',
          last_trans_lang: 'Finnish'
        }
      })
      cy.request('POST', '/api/session', { ...globalUser })
        .as('user')
        .then(response => {
          window.localStorage.setItem('user', JSON.stringify(response.body))
          cy.reload()
        })
    })

    it('library opens', function () {
      cy.get('[href="/library"]')
        .click()
      cy.get('[data-cy=library-controls]')
      cy.url().should('include', '/library')
    })

    it('can start random practice', function () {
      cy.get('[data-cy=practice-now]').click()
      cy.get('[data-cy=start-random]', { timeout: 20000 }).click()
      cy.get('[data-cy=practice-view]')
    })

    it("can start filtered practice", function () {
      cy.get('[data-cy=practice-now]').click()
      cy.get('[class=checkbox-group]').eq(1).children()
        .then(children => {
          children[2].click()
          children[4].click()
        })

      cy.get("[data-cy=start-random]").click()
    })

    it("cant start filtered practice with 0 stories", function () {
      cy.get('[data-cy=practice-now]').click()
      cy.get("[data-cy=start-random]").should("be.enabled")
      cy.get('[class=checkbox-group]').eq(1).children().each(e => e.click())
      cy.get("[data-cy=start-random]").should("be.disabled")
    })

    describe("stories", function () {
      this.beforeEach(function () {
        cy.get("[data-cy=library-tab]")
          .click()
      })

      it('can be created and new story can be read', function () {
        cy.get('[data-cy=new-story-input]')
          .type('https://yle.fi/uutiset/3-11191886')
        cy.get('[data-cy="submit-story"]')
          .click()
        cy.get('[class=Toastify]').contains('Processing your story')
        cy.get('.checkbox-group > :nth-child(2)').click()
        cy.contains('5G-kännyköitä', { timeout: 20000 })
        cy.contains('Lue')
          .click()
        cy.contains('Harjoittele', { timeout: 20000 })
        cy.contains('Tehokkaasta 5G-liittymästä')
      })
    })

    describe("read mode", function () {

      this.beforeEach(function () {
        cy.visit('http://localhost:8000/stories/5c407e9eff634503466b0dde/')
      })

      it("opens", function () {
        cy.contains("Lauantai 22.12.2018 (radio)")
        cy.contains("Britanniassa poliisi on ehkä löytänyt ihmiset, jotka ovat häirinneet lentokoneita.")
        cy.contains("Etelä-Suomessa pakkasta on noin 10 astetta. Pohjois-Suomessa pakkasta on noin 20 astetta. Lapissa on yöllä jopa 30 astetta pakkasta.")
      })

      it("can click (translate) a word", function () { // This test overlaps with dictionary
        cy.contains("Britanniassa")
          .click()
        cy.get('.book') // Open dictionaryhelp
          .click({ force: true })
        cy.contains("Yhdistyneestä kuningaskunnasta käytetty lyhyt nimitys")
      })
    })

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
  cy.request('POST', 'localhost:8000/api/register', { ...user })
    .then((response) => {
      user.token = response.body.access_token
      console.log(user)
    })
  cy.request('POST', 'localhost:8000/api/confirm/test', { ...user })

  users.push(user)
  return user
}

