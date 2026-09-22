// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

Cypress.on('uncaught:exception', (err, runnable) => {
    return false
})

// The library assistant asks the agent for daily stories the moment /library opens, so every spec
// that visits it would otherwise spend LLM tokens. Stub it once, for all of them; a spec that cares
// about the reply registers its own intercept, which takes precedence over this one.
beforeEach(() => {
  cy.intercept({ method: 'POST', url: /\/api\/chatbot\/general(\?|$)/ }, {
    statusCode: 200,
    body: { response: '- [A daily story](http://localhost:8000/stories/cached?cached_id=1)' },
  })
})

// Alternatively you can use CommonJS syntax:
// require('./commands')