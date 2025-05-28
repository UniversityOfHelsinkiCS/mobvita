/// <reference types="Cypress" />

let globalUser = null
const users = []
let randomID = Math.floor(Math.random() * 1000000000)

describe('Mobvita', function () {
  this.beforeAll(function () {
    globalUser = createRandomUser()
    cy.login()
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
    cy.viewport(1920, 1080)
    window.localStorage.clear() 
    cy.loginExisting().as('user')
    cy.visit('http://localhost:8000/home')
  })
  /*
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

    cy.get('[class=Toastify]').contains('A message containing a link to confirm your registration has been sent to your email address.')
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
    cy.reload()
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
  */

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
          last_trans_lang: 'Finnish',
          has_seen_home_tour: true,
          has_seen_library_tour: true
        }
      })
      cy.request('POST', '/api/session', { ...globalUser })
        .as('user')
        .then(response => {
          window.localStorage.setItem('user', JSON.stringify(response.body))
          cy.reload()
        })
    })

    // it('library opens', function () {
    //   cy.get('[data-cy=goto-library]').click()
    //   cy.url().should('include', '/library')
    // })

    it('can start random practice', function () {
      cy.get('[data-cy=practice-now]').click()
      cy.get('[data-cy=All-Stories]', { timeout: 20000 }).click()
      // cy.get('[data-cy=practice-view]')
    })

    it("can start filtered practice", function () {
      cy.get('[data-cy=practice-now]').click()

      cy.get('[data-cy=practice-categories]').children()
        .then(children => {
          children[2].click()
          //children[3].click()
        })
      //cy.get("[data-cy=start-random]", { timeout: 20000 }).click()
      // cy.get('[data-cy=practice-view]')
    })
    /*
    it("cant start filtered practice with 0 stories", function () {
      cy.get('[data-cy=practice-now]').click()
      cy.get("[data-cy=start-random]").should("be.enabled")
      cy.get('[data-cy=practice-categories]').children().each(e => e.click())
      cy.get('[data-cy=other-category]').click()
      cy.get("[data-cy=start-random]").should("be.disabled")
    })
    */
    // describe("stories", function () {
    //   this.beforeEach(function () {
    //     // cy.get('[data-cy=practice-now]').click()
    //     cy.get("[data-cy=goto-library]")
    //       .click()
    //   })

    //   it('can be created and new story can be previewed', function () {
    //     cy.get('[data-cy=story-items]')
    //     cy.get('[data-cy=add-story-button]').click()
    //     cy.get('[data-cy=new-story-input] > input')
    //       .should('be.enabled')
    //       .type('https://yle.fi/a/3-12690355')
    //     cy.get('[data-cy="submit-story"]')
    //       .click()
    //     cy.contains('Sunnuntai', { timeout: 120000 })
    //     // cy.contains('Esikatsele')
    //     //   .click()
    //     cy.contains('Harjoittele', { timeout: 20000 })
    //     cy.contains('radio')
    //   })
    // })

    describe("preview mode", function () {

      this.beforeEach(function () {
        cy.visit('http://localhost:8000/stories/5c407e9eff634503466b0dde/preview')
      })

      it("opens", function () {
        cy.contains("Lauantai 22.12.2018 (radio)")
        cy.contains("Britanniassa poliisi on ehkä löytänyt ihmiset, jotka ovat häirinneet lentokoneita.")
        cy.contains("Etelä-Suomessa pakkasta on noin 10 astetta. Pohjois-Suomessa pakkasta on noin 20 astetta. Lapissa on yöllä jopa 30 astetta pakkasta.")
      })

      it("can click (translate) a word", function () { // This test overlaps with dictionary
        cy.contains("ehkä").click()
        cy.get("[data-cy=dictionary-dropdown]").select("Englanti")
        cy.contains("perhaps", { timeout: 20000 })
      })
      // it("can add and see annotations in the library", function () {
      //   cy.viewport(1028, 720) // Set a big enough resolution for annotation box to show up
      //   cy.contains("häirinneet").click()
      //   cy.get('[data-cy="annotation-expand-btn"]').click()
      //   cy.get('[data-cy="create-annotation-button"]').click()
      //   cy.get('[data-cy="annotation-text-field"]').type('This is a test note')
      //   cy.get('[data-cy="save-annotation-button"]').click()
      //   cy.contains("Muistiinpano tallennettu")

      //   cy.visit('http://localhost:8000/notes-library')
      //   cy.wait(30000)
      //   cy.get('[data-cy="library-toggle-0"]').click()
      //   cy.contains("häirinneet lentokoneita")
      //   cy.get('[data-cy="annotation-item-link"').click()
      //   cy.wait(1000)
      //   cy.contains('Lauantai 22.12.2018 (radio)')
      //   /*
      //   cy.contains('[data-cy="25-häirinneet lentokoneita"]').click()
      //   cy.get('[data-cy="delete-annotation-button"]').click()
      //   cy.get('[data-cy=confirm-warning-dialog').click()
      //   cy.contains("Muistiinpano poistettu")
      //   cy.get('[data-cy="25-häirinneet lentokoneita"]').should('not.exist')
      //   */
      // })
    })

  })
})

function randomCredentials() {
  const id = randomID++
  const email = `mobvita${id}@testcypress.foobar123`
  const username = `mobvita${id}`
  const password = 'securepassword'
  const interface_language = null
  return { email, username, password, interface_language }
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

