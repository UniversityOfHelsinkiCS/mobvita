/// <reference types="Cypress" />

let globalUser = null
const users = []
let randomID = Math.floor(Math.random() * 1000000000)

describe('Mobvita', function () {
  this.beforeAll(function () {
    globalUser = createRandomUser()
    users.push(globalUser)

    cy.request('POST', 'localhost:8000/api/register', { ...globalUser })
      .then((response) => {
        globalUser.token = response.body.access_token
        cy.request('POST', 'localhost:8000/api/confirm/test', { ...globalUser })
      })
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
  })

  this.beforeEach(function () {
    cy.visit('http://localhost:8000')
  })

  it('can create a new user, has English as default ui language', function () {
    const user = createRandomUser()

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
      cy.get("[data-cy=category-science]").click()
      cy.get("[data-cy=category-uncategorized]").click()
      cy.get("[data-cy=start-random]").click()
    })

    it("cant start filtered practice with 0 stories", function () {
      const categories = ["politics", "culture", "science", "sport", "uncategorized"]
      cy.get('[data-cy=practice-now]').click()
      categories.forEach(category => {
        cy.get(`[data-cy=category-${category}]`).click()
      })
      cy.get("[data-cy=start-random]").should("be.disabled")
    })

    describe("sidebar is open", function () {
      this.beforeEach(function () {
        cy.get('.bars').click()
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
        cy.request('POST', '/api/session', { ...globalUser })
          .as('user')
          .then(response => {
            window.localStorage.setItem('user', JSON.stringify(response.body))
            cy.reload()
          })
        cy.contains('Startsida')
      })
    })

    describe("dictionary", function () {
      this.beforeEach(function () {
        cy.visit("http://localhost:8000/stories/5c407e9eff634503466b0dde/")
        cy.get(".book") // Open dictionaryhelp
          .click()
      })

      it("dictionary opens", function () {
        cy.contains("Klikkaa sinulle tuntemattomia sanoja tekstissä saadaksesi käännöksiä.")
      })

      it("translate-to language can be changed", function () {
        cy.get("[data-cy=dictionary-dropdown] > div.text")
          .click()
        cy.get(".visible > :nth-child(6)")
          .contains("Finnish")
          .click()
      })

      it("word translates correctly", function () {
        cy.contains("poliisi")
          .click()
        cy.contains("yhteiskunnassa järjestystä ja turvallisuutta valvova ja ylläpitävä virkamies")
      })

      it("changing translate-to language re-translates the word", function () {
        cy.contains("poliisi")
          .click()
        cy.contains("yhteiskunnassa järjestystä ja turvallisuutta valvova ja ylläpitävä virkamies")
        cy.get("[data-cy=dictionary-dropdown] > div.text")
          .click()
        cy.get(".visible > :nth-child(5)")
          .contains("Spanish")
          .click()
        cy.contains("policía")
      })

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

    describe("practice mode", function () {
      const practiceURL = "http://localhost:8000/stories/5c407e9eff634503466b0dde/practice"

      this.beforeEach(function () {
        cy.visit(practiceURL)
      })

      it("can type into cloze fields", function () {
        cy.get("[data-cy=exercise-cloze]", { timeout: 10000 }).each(element => {
          cy.get(element).type("h3hasdi3g92137fhs")
        })
      })

      it("can submit answers", function () {
        cy.get("[data-cy=check-answer]").click()
      })

      it("can get to next snippet after two retries", function () {
        cy.contains('0 / 8')

        cy.get("[data-cy=check-answer]").click()
        cy.get("[data-cy=check-answer]").click()

        cy.contains('1 / 8')
      })

      it("shows feedback", function () {
        cy.get("[data-cy=exercise-cloze]", { timeout: 10000 }).each(element => {
          cy.get(element).type("h3hasdi3g92137fhs")
        })
        cy.get("[data-cy=check-answer]").click()

        //Locate incorrecly answered cloze exercise:
        cy.get("[data-cy=exercise-cloze]").eq(0).should("have.class", "wrong")
      })
    })
  })
})

function createRandomUser() {
  const id = randomID++
  const email = `mobvita${id}@testcypress.foobar123`
  const username = `mobvita${id}`
  const password = 'securepassword'

  return { email, username, password }
}
