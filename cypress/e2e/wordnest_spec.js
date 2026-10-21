describe('wordnest modal', function () {
  const previewURL = 'http://localhost:8000/stories/5c082383ff63453c5423f99d/preview'

  this.beforeAll(function () {
    // The word nest and the translations it asserts on live in the assistant sidebar, which is
    // gated on ACCESS.HIGH.
    cy.login('Russian', false, 'English', true)
  })

  this.beforeEach(function () {
    // Reuse the session created in beforeAll — do not call cy.login() again
    cy.loginExisting()

    cy.intercept('GET', '**/api/**').as('apiCall')
    cy.intercept({ method: /GET|POST/, url: '**/api/**translation**' }).as('getTranslation')
    cy.visit(previewURL)
    cy.wait('@apiCall', { timeout: 30000 })

    cy.contains('спортсменка', { timeout: 30000 }).should('be.visible')
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

  it('fetches, displays and translates word nest modal correctly', function () {
    // Desktop layout: nest panel beside the dictionary.
    cy.viewport(1280, 900)

    cy.contains('спортсменка', { timeout: 30000 }).click()
    cy.contains('sportswoman', { timeout: 30000 })
    cy.get('[data-cy=chat-action-menu-popup]', { timeout: 30000 }).click()
    cy.get('[data-cy=nest-button]', { timeout: 30000 }).should('be.visible').click()

    cy.get('[data-cy=wordnest-modal]', { timeout: 30000 })
      .should('be.visible')
      .within(() => {
        cy.contains('спорт', { timeout: 30000 })

        // First column: plain words (the stress mark is optional — the BE may or may not send it).
        cy.contains('[data-cy="wordnest-word"]', /^спортсме́?н$/, { timeout: 30000 })
          .scrollIntoView()
          .click()

        cy.contains('sportsman', { timeout: 30000 })

        // Off by default: no word parts until the switch is turned on.
        cy.get('[data-cy="wordnest-word-parts"]').should('not.exist')
        // By data-cy, not label text: the test user's interface language is the learning language
        // (Russian), so the label is not in English.
        cy.get('[data-cy=wordnest-additional-info-toggle]').click()

        // Second column: the word split into morphemes, translating on click like the first.
        cy.contains('[data-cy="wordnest-word-parts"]', 'не⋅спорти́вный', { timeout: 30000 })
          .scrollIntoView()
          .should('be.visible')
          .click()
        cy.contains('unsportsmanlike', { timeout: 30000 }).should('be.visible')
      })
  })

  it('keeps the chatbot on the word that opened the nest while nest words are clicked', function () {
    // The chatbot's dictionary cards, not the nest's own dictionary pane.
    const chatbotCards = () =>
      cy
        .get('[data-cy=translations]')
        .filter((_, el) => !el.closest('[data-cy=wordnest-modal]'))
    // Its glosses can overlap the nest word's, so compare the whole card text, not single words.
    const expectChatbotUnchanged = () =>
      cy.get('@chatbotText').then(before => {
        chatbotCards().invoke('text').should('eq', before)
      })

    cy.viewport(1280, 900)
    cy.contains('спортсменка', { timeout: 30000 }).click()
    chatbotCards().should('contain', 'sportswoman').invoke('text').as('chatbotText')
    cy.get('[data-cy=chat-action-menu-popup]', { timeout: 30000 }).click()
    cy.get('[data-cy=nest-button]', { timeout: 30000 }).should('be.visible').click()

    cy.get('[data-cy=wordnest-modal]', { timeout: 30000 })
      .should('be.visible')
      .within(() => {
        cy.contains('[data-cy="wordnest-word"]', /^спортсме́?н$/, { timeout: 30000 })
          .scrollIntoView()
          .click()
        cy.contains('[data-cy=translations]', 'sportsman', { timeout: 30000 })
          .should('be.visible')
          .and('not.contain', 'sportswoman')
      })

    expectChatbotUnchanged()

    cy.get('[data-cy=wordnest-close]').click()
    cy.get('[data-cy=wordnest-modal]', { timeout: 2000 }).should('not.exist')

    expectChatbotUnchanged()
  })

  it('translates the nest word in the title when it is clicked', function () {
    cy.viewport(1280, 900)
    cy.contains('спортсменка', { timeout: 30000 }).click()
    cy.contains('sportswoman', { timeout: 30000 })
    cy.get('[data-cy=chat-action-menu-popup]', { timeout: 30000 }).click()
    cy.get('[data-cy=nest-button]', { timeout: 30000 }).should('be.visible').click()

    cy.get('[data-cy=wordnest-modal]', { timeout: 30000 })
      .should('be.visible')
      .within(() => {
        cy.contains('[data-cy=translations]', 'sportswoman', { timeout: 30000 })

        // Slowed down so the loading state can be seen: old lemmas go, a spinner shows.
        cy.intercept('GET', '**/api/translate*', req => {
          req.on('response', res => res.setDelay(1500))
        })
        // The title is the uppercase heading; its lemma is the lowercase word under it.
        cy.contains('[data-cy=wordnest-title-word]', 'СПОРТ', { timeout: 30000 }).click()
        cy.get('[data-cy=dictionary-help-loading]').should('be.visible')
        cy.contains('sportswoman').should('not.exist')
        cy.contains('[data-cy=translations] a, [data-cy=translations] span', /^спорт$/, {
          timeout: 30000,
        }).should('be.visible')
      })
  })

  it("doesn't display nest icon when nest is not available", function () {
    cy.contains('метровку', { timeout: 30000 }).click()
    cy.get('[data-cy=chat-action-menu-popup]', { timeout: 30000 }).click()
    cy.get('[data-cy=nest-button]', { timeout: 5000 }).should('not.exist')
  })
  
  it('close wordnest modal when clicking outside', function () {
    cy.contains('спортсменка', { timeout: 30000 }).click()
    cy.contains('sportswoman', { timeout: 30000 })
    cy.get('[data-cy=chat-action-menu-popup]', { timeout: 30000 }).click()
    cy.get('[data-cy=nest-button]', { timeout: 30000 }).should('be.visible').click()
    
    cy.get('[data-cy=wordnest-modal]', { timeout: 30000 }).should('be.visible')

    // MUI Dialog detects an outside click on the .MuiDialog-container (it overlays the backdrop):
    // its onMouseDown flags the click as a backdrop click and the root's onClick fires onClose.
    // Click a corner of the container so we land outside the centred paper.
    cy.get('.MuiDialog-container', { timeout: 30000 })
      .filter(':visible')
      .first()
      .click('topLeft')

    cy.get('[data-cy=wordnest-modal]', { timeout: 2000 }).should('not.exist')
  })

  it('closes wordnest modal when clicking close button', function () {
    cy.contains('спортсменка', { timeout: 30000 }).click()
    cy.contains('sportswoman', { timeout: 30000 })
    
    cy.get('[data-cy=chat-action-menu-popup]', { timeout: 30000 }).click()
    cy.get('[data-cy=nest-button]', { timeout: 30000 }).should('be.visible').click()

    cy.get('[data-cy=wordnest-modal]', { timeout: 30000 })
      .should('be.visible')
      .within(() => {
        cy.get('[data-cy=wordnest-close]', { timeout: 30000 })
          .should('exist')
          .click()
      })

    cy.get('[data-cy=wordnest-modal]', { timeout: 2000 }).should('not.exist')
  })
})
