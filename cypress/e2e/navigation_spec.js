/**
 * App-wide routing: redirects, menu navigation, links, browser history and the catch-all route.
 * Story URLs with ids (useParams) are covered by "preview mode" in mobvita_spec.js.
 */
const BASE = 'http://localhost:8000'

// Fails if the ErrorBoundary page (Finnish UI, the cy.login default) has replaced the route.
const assertNoCrash = () => cy.contains('Järjestelmässä on tapahtunut virhe').should('not.exist')

describe('navigation', function () {
  const routerErrors = []

  this.beforeAll(function () {
    cy.login()
  })

  // Collects router warnings from console.error, which never fail a test on their own.
  this.beforeEach(function () {
    routerErrors.length = 0
    cy.on('window:before:load', win => {
      const original = win.console.error
      win.console.error = (...args) => {
        const text = args.map(String).join(' ')
        if (/router|route|navigate|location/i.test(text)) routerErrors.push(text.slice(0, 300))
        original(...args)
      }
    })
  })

  this.afterEach(function () {
    cy.then(() => expect(routerErrors, 'router console errors').to.deep.equal([]))
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

  it('redirects a logged-out visitor from a protected page to the landing page', function () {
    cy.clearLocalStorage()
    cy.visit(`${BASE}/library`)
    cy.location('pathname', { timeout: 20000 }).should('eq', '/')
    assertNoCrash()
  })

  it('sends a logged-in user from the landing page to the welcome page', function () {
    cy.loginExisting()
    cy.visit(`${BASE}/`)
    cy.location('pathname', { timeout: 20000 }).should('eq', '/welcome')
  })

  it('moves between pages with the menu, the logo link and browser back', function () {
    cy.viewport(1440, 900)
    cy.loginExisting()
    cy.visit(`${BASE}/welcome`)
    // The sidebar is already open on /welcome at desktop width.
    cy.get('[data-cy=sidebar-library]', { timeout: 30000 }).should('be.visible').click()
    cy.location('pathname').should('match', /^\/library/)
    cy.get('.library-search-field', { timeout: 30000 }).should('exist')

    cy.get('[data-cy=revita-logo]').click()
    cy.location('pathname').should('eq', '/home')

    cy.go('back')
    cy.location('pathname').should('match', /^\/library/)
    assertNoCrash()
  })

  it('renders an unknown address without crashing', function () {
    cy.loginExisting()
    cy.visit(`${BASE}/this-route-does-not-exist`)
    cy.location('pathname').should('eq', '/this-route-does-not-exist')
    cy.get('#root').should('not.be.empty')
    assertNoCrash()
  })
})
