/**
 * Essay writing, end to end.
 *
 * The backend is real for everything except the two endpoints that spend LLM tokens: POST
 * /writing/{lang}/correction and POST /chatbot/essay are stubbed in every test, and a guard refuses
 * (and reports) any other AI route the page might reach. The correction stub is deterministic — one
 * sentence always comes back with the same correction and the same backend sentence id — which is
 * what makes the correction cache, the suggestion list and the sentence lineage assertable.
 *
 * Deletion, split and merge never reach the backend at all. What the editor builds out of them is
 * checked by intercepting the save and asserting its payload; what a teacher then sees is checked by
 * feeding the review view a saved essay through a stubbed GET. Both are pure front-end behaviour, so
 * neither needs the backend to store anything.
 */
const BASE = 'http://localhost:8000'
const LANGUAGE = 'Finnish'

const S1 = 'Minä olen kissa.'
const S1_EDITED = 'Minä olen kissat.'
const S2 = 'Koira juoksee puistossa.'
const SPLITTABLE = 'Minä olen kissa ja koira.'
const CHATBOT_REPLY = 'Because the verb has to agree with the subject.'

// What the correction stub flags, per sentence: the word, what it should have been, and the hint
// shown on the bubble. Keyed by the sentence itself, so retyping one gets the same correction back.
const CORRECTIONS = {
  [S1]: { word: 'olen', corrected: 'olin', hint: 'Wrong tense in this word.' },
  [S1_EDITED]: { word: 'kissat', corrected: 'kissa', hint: 'Wrong number in this word.' },
  [S2]: { word: 'juoksee', corrected: 'juoksi', hint: 'Wrong tense in this word.' },
  [SPLITTABLE]: { word: 'olen', corrected: 'olin', hint: 'Wrong tense in this word.' },
  'Minä olen kissa. ja koira.': { word: 'olen', corrected: 'olin', hint: 'Wrong tense.' },
  'ja koira.': { word: 'koira', corrected: 'koirat', hint: 'Wrong number.' },
}
// Any sentence the suite did not name: flag its second word, so there is always one bubble.
const FALLBACK_CORRECTION = { word: null, corrected: 'korjattu', hint: 'Check this word.' }

// Route matchers are regular expressions, not globs, because every one of these endpoints is called
// with a query string (the correction carries the cache key, the chatbot its focus key) — a glob
// that ends at the path silently matches none of them.
const CORRECTION_ROUTE = /\/api\/writing\/[^/]+\/correction(\?|$)/
const ESSAY_CHATBOT_ROUTE = /\/api\/chatbot\/essay(\?|$)/
const SESSION_ROUTE = /\/api\/writing\/[^/]+\/session(\?|$)/
const ESSAY_LIST_ROUTE = /\/api\/writing\/[^/]+\/essays(\?|$)/
const ESSAY_BY_ID_ROUTE = /\/api\/writing\/[^/]+\/essays\/[^/?]+(\?|$)/

// Anything that would reach a model. The first two are the routes this page uses and both are
// stubbed; the rest are here so that a page reaching them fails the test instead of quietly
// spending tokens.
const AI_ROUTE = /\/(correction|chatbot|generate|mc_generate)/
const isStubbedAiRoute = url => CORRECTION_ROUTE.test(url) || ESSAY_CHATBOT_ROUTE.test(url)

let unstubbedAiCalls = []

// FNV-1a, rendered as 24 hex characters so the id the stub hands back looks like the Mongo id the
// real endpoint returns — and is the same every time for the same sentence, which is what lets a
// test name the id it expects to find in a saved essay's history.
const backendSentenceId = text => {
  let hash = 2166136261

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  const block = (hash >>> 0).toString(16).padStart(8, '0')
  return `${block}${block}${block}`
}

// One token per word, with sentence-final punctuation split off as its own token — the shape the
// backend sends, and the order getWordPositionsById expects to find the words in.
const tokenize = text =>
  text
    .trim()
    .split(/\s+/)
    .flatMap(word => {
      const match = word.match(/^(.*?)([.!?]+)$/)
      return match ? [match[1], match[2]] : [word]
    })
    .filter(Boolean)

const buildCorrectionResponse = text => {
  const tokens = tokenize(text)
  const spec = CORRECTIONS[text.trim()] || FALLBACK_CORRECTION
  const namedIndex = spec.word ? tokens.indexOf(spec.word) : -1
  const errorIndex = namedIndex === -1 ? Math.min(1, tokens.length - 1) : namedIndex

  return {
    corrections: [
      {
        corrected: tokens
          .map((token, index) => (index === errorIndex ? spec.corrected : token))
          .join(' '),
        sentence_id: backendSentenceId(text.trim()),
        corrections: tokens.map((token, index) => ({
          ID: index,
          original: token,
          corrected: index === errorIndex ? spec.corrected : null,
          feedback: index === errorIndex ? { hints: [{ easy: spec.hint }] } : null,
        })),
      },
    ],
  }
}

const stubLlmEndpoints = () => {
  unstubbedAiCalls = []

  cy.intercept({ method: 'POST', url: CORRECTION_ROUTE }, request => {
    request.reply({ statusCode: 200, body: buildCorrectionResponse(request.body.text) })
  }).as('correction')

  cy.intercept({ method: 'POST', url: ESSAY_CHATBOT_ROUTE }, request => {
    request.reply({ statusCode: 200, body: { response: CHATBOT_REPLY } })
  }).as('chatbot')

  // Registered last, so it is offered every POST first. It replies only to an AI route that has no
  // stub of its own; anything else is left to fall through to the handlers above, or to the backend.
  cy.intercept('POST', '**/api/**', request => {
    if (!AI_ROUTE.test(request.url) || isStubbedAiRoute(request.url)) return

    unstubbedAiCalls.push(request.url)
    request.reply({ statusCode: 503, body: {} })
  })
}

const essayInput = () => cy.get('[data-cy=essay-writing-input] textarea:visible')
const correctionBubbles = () => cy.get('[data-cy=essay-correction-bubble]')
const caretLeft = steps => '{leftarrow}'.repeat(steps)

const visitEditor = () => {
  cy.visit(`${BASE}/essay-writing`)
  essayInput().should('exist')
}

// Which library opens is a property of the account rather than of the URL — there is no /library
// path for the essays tab, and the tab itself cannot be clicked: the assistant sidebar is open on
// this viewport and covers the tab row, which the story grid is pushed clear of but the tabs are
// not. So save the selection the way the app does after an upload, and then log in again before
// visiting: the store is seeded from the session blob in localStorage, and the library reads the
// saved selection once on mount, so a stale blob decides the tab no matter what the account says.
const openEssaysLibrary = () =>
  cy
    .loginExisting()
    .then(user =>
      cy.request({
        method: 'POST',
        url: `${BASE}/api/user/`,
        headers: { Authorization: `Bearer ${user.token}` },
        body: { last_selected_library: 'essays' },
      }),
    )
    .then(() => cy.loginExisting())
    .then(() => {
      cy.visit(`${BASE}/library`)
      cy.get('[data-cy=tab-essays]', { timeout: 60000 }).should(
        'have.attr',
        'aria-selected',
        'true',
      )
    })

const uploadEssayAs = title => {
  cy.get('[data-cy=submit-essay]').should('not.be.disabled').click()
  cy.get('[data-cy=essay-topic-input]').type(title)
  cy.get('[data-cy=essay-topic-confirm]').click()
}

describe('essay writing', function () {
  this.beforeAll(function () {
    cy.login(LANGUAGE, false, 'English')
  })

  this.beforeEach(function () {
    cy.loginExisting()
    stubLlmEndpoints()
  })

  this.afterEach(function () {
    expect(unstubbedAiCalls, 'AI endpoints reached without a stub').to.deep.equal([])
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

  context('corrections', function () {
    it('asks for a correction as soon as a sentence is finished, and shows what it flagged', function () {
      visitEditor()
      essayInput().type(S1)

      cy.wait('@correction').its('request.body.text').should('eq', S1)
      correctionBubbles().should('have.length', 1)
      correctionBubbles().first().should('contain', CORRECTIONS[S1].word)
    })

    it('reuses the cached correction when a sentence is finished again unchanged', function () {
      visitEditor()
      essayInput().type(S1)
      cy.wait('@correction')
      correctionBubbles().should('have.length', 1)

      // Breaking the sentence drops its suggestion; finishing it again is the same text as before,
      // so the cached correction is reused rather than paid for twice.
      essayInput().type('{backspace}')
      correctionBubbles().should('have.length', 0)
      essayInput().type('.')

      correctionBubbles().should('have.length', 1)
      cy.get('@correction.all').should('have.length', 1)
    })

    it('corrects each finished sentence separately', function () {
      visitEditor()
      essayInput().type(`${S1} ${S2}`)

      cy.wait('@correction').its('request.body.text').should('eq', S1)
      cy.wait('@correction').its('request.body.text').should('eq', S2)
      correctionBubbles().should('have.length', 2)
    })
  })

  context('the assistant panel', function () {
    it('opens the selected suggestion and goes back to the list from its arrow', function () {
      visitEditor()
      essayInput().type(S1)
      cy.wait('@correction')

      correctionBubbles().first().click()
      cy.get('[data-cy=essay-chatbot-focused]').should('exist')
      cy.get('[data-cy=essay-chatbot-focused]').should('contain', CORRECTIONS[S1].word)

      cy.get('[data-cy=essay-chatbot-back]').click()
      cy.get('[data-cy=essay-chatbot-focused]').should('not.exist')
    })

    it('opens the suggestion for the corrected word the caret is put on', function () {
      visitEditor()
      essayInput().type(S1)
      cy.wait('@correction')

      // "olen" sits at offsets 5-9; the caret starts at the end of the sentence.
      essayInput().type(caretLeft(S1.length - 7))
      cy.get('[data-cy=essay-chatbot-focused]').should('exist')
      cy.get('[data-cy=essay-chatbot-focused]').should('contain', CORRECTIONS[S1].word)
    })

    it('returns to the correction list when the fixed sentence is sent for correction', function () {
      visitEditor()
      essayInput().type(S1)
      cy.wait('@correction')
      correctionBubbles().first().click()
      cy.get('[data-cy=essay-chatbot-focused]').should('exist')

      // Fixing the sentence from inside it: nothing is sent while the caret stays in the sentence,
      // so the suggestion the user is reading stays open while they type.
      essayInput().type(`${caretLeft(1)}t`)
      cy.get('@correction.all').should('have.length', 1)
      cy.get('[data-cy=essay-chatbot-focused]').should('exist')

      // Leaving the sentence sends the correction, and that is what closes the suggestion.
      essayInput().blur()
      cy.wait('@correction').its('request.body.text').should('eq', S1_EDITED)
      cy.get('[data-cy=essay-chatbot-focused]').should('not.exist')
      cy.get('[data-cy=essay-chatbot-back]').should('not.exist')
      correctionBubbles().should('have.length', 1)
    })

    it('answers a question about the selected suggestion', function () {
      visitEditor()
      essayInput().type(S1)
      cy.wait('@correction')
      correctionBubbles().first().click()

      cy.get('input[name=essayChatbotInput]').type('Miksi?{enter}')
      cy.wait('@chatbot').then(({ request }) => {
        expect(request.body.message).to.eq('Miksi?')
        expect(request.body.sentence_id, 'the selected sentence is named').to.eq(
          backendSentenceId(S1),
        )
        // The focus names what the word should be, not what was typed — the chatbot is being asked
        // about the correction, not about the mistake.
        expect(request.body.focused_word).to.eq(CORRECTIONS[S1].corrected)
      })
      cy.get('[data-cy=essay-chatbot-focused]')
        .parent()
        .should('contain', CHATBOT_REPLY)
    })
  })

  context('the draft', function () {
    it('is still there after a reload, without paying for the correction again', function () {
      visitEditor()
      essayInput().type(S1)
      cy.wait('@correction')

      cy.reload()
      essayInput().should('have.value', S1)
      correctionBubbles().should('have.length', 1)
      cy.get('@correction.all').should('have.length', 1)
    })
  })

  // What the editor makes of a deletion, a split and a merge, read off the save it builds. The save
  // is intercepted, so none of this asks the backend to store anything.
  context('sentence lineage', function () {
    // The whole context runs without the backend: the writing session and the save are both served
    // from here, so what is asserted is only ever what the editor itself built.
    const stubSave = () => {
      cy.intercept({ method: 'GET', url: SESSION_ROUTE }, { session_id: 'cypress-writing-session' })
      cy.intercept({ method: 'POST', url: ESSAY_LIST_ROUTE }, request => {
        request.reply({
          statusCode: 200,
          body: { essay: { _id: '000000000000000000000001', title: request.body.title } },
        })
      }).as('saveEssay')
    }

    it('keeps a deleted sentence in the essay, flagged removed', function () {
      stubSave()
      visitEditor()
      essayInput().type(`${S1} ${S2}`)
      cy.wait('@correction')
      cy.wait('@correction')

      // Delete the second sentence outright, back to the end of the first.
      essayInput().type('{backspace}'.repeat(S2.length + 1))
      essayInput().should('have.value', S1)

      uploadEssayAs(`Deletion ${Date.now()}`)
      cy.wait('@saveEssay').its('request.body.sentences').then(sentences => {
        expect(sentences.map(sentence => sentence.original_text)).to.deep.eq([S1, S2])
        expect(sentences[0].removed, 'the surviving sentence').to.eq(false)
        expect(sentences[1].removed, 'the deleted sentence is kept, flagged').to.eq(true)
        expect(sentences[1].sentence_id).to.eq(backendSentenceId(S2))
      })
    })

    it('gives both halves of a split the sentence they came out of', function () {
      stubSave()
      visitEditor()
      essayInput().type(SPLITTABLE)
      cy.wait('@correction').its('request.body.text').should('eq', SPLITTABLE)

      // Split it in two by finishing the first half where "kissa" ends.
      essayInput().type(`${caretLeft(SPLITTABLE.length - 15)}.`)
      essayInput().should('have.value', 'Minä olen kissa. ja koira.')

      uploadEssayAs(`Split ${Date.now()}`)
      cy.wait('@saveEssay').its('request.body.sentences').then(sentences => {
        expect(sentences).to.have.length(2)
        expect(sentences.map(sentence => sentence.removed)).to.deep.eq([false, false])
        // Neither half is a new sentence: both descend from the one that was split.
        sentences.forEach(sentence => {
          expect(sentence.history, sentence.original_text).to.include(
            backendSentenceId(SPLITTABLE),
          )
        })
      })
    })

    it('keeps the sentence a merge swallowed, flagged removed', function () {
      stubSave()
      visitEditor()
      essayInput().type(`${S1} ${S2}`)
      cy.wait('@correction')
      cy.wait('@correction')

      // Merge the two by deleting the full stop between them.
      essayInput().type(`${caretLeft(S2.length + 1)}{backspace}`)
      essayInput().should('have.value', `Minä olen kissa ${S2}`)

      uploadEssayAs(`Merge ${Date.now()}`)
      cy.wait('@saveEssay').its('request.body.sentences').then(sentences => {
        const surviving = sentences.filter(sentence => !sentence.removed)
        const removed = sentences.filter(sentence => sentence.removed)

        expect(surviving).to.have.length(1)
        expect(surviving[0].original_text).to.eq(`Minä olen kissa ${S2}`)
        // The merged sentence carries the first parent; the second is kept beside it, flagged.
        expect(surviving[0].history).to.include(backendSentenceId(S1))
        expect(removed).to.have.length(1)
        expect(removed[0].original_text).to.eq(S2)
      })
    })
  })

  // These do go to the backend — saving, listing, reopening and deleting an essay carry no LLM cost.
  context('saving to My Essays', function () {
    it('uploads a new essay, lists it, and deletes it again', function () {
      const title = `Cypress essay ${Date.now()}`

      visitEditor()
      essayInput().type(`${S1} ${S2}`)
      cy.wait('@correction')
      cy.wait('@correction')
      uploadEssayAs(title)

      cy.location('pathname', { timeout: 60000 }).should('include', '/library')
      cy.get('[data-cy=tab-essays]', { timeout: 60000 }).should(
        'have.attr',
        'aria-selected',
        'true',
      )
      cy.contains('[data-cy=essay-item]', title, { timeout: 60000 }).should('exist')

      cy.contains('[data-cy=essay-item]', title).click()
      cy.get('[data-cy=essay-detail-modal-delete-button]').click()
      cy.get('[data-cy=confirm-warning-dialog]').click()
      cy.contains('[data-cy=essay-item]', title).should('not.exist')
    })

    it('saves a reopened essay back into itself instead of creating a second one', function () {
      const title = `Cypress reopened ${Date.now()}`

      visitEditor()
      essayInput().type(S1)
      cy.wait('@correction')
      uploadEssayAs(title)

      cy.contains('[data-cy=essay-item]', title, { timeout: 60000 }).click()
      cy.get('[data-cy=essay-detail-modal-edit-button]').click()

      cy.location('pathname', { timeout: 60000 }).should('include', '/essay-writing')
      essayInput().should('have.value', S1)

      // A reopened essay saves straight away — no topic dialog, and the request names the essay.
      cy.intercept({ method: 'POST', url: ESSAY_BY_ID_ROUTE }).as('updateEssay')
      essayInput().type(` ${S2}`)
      cy.wait('@correction')
      cy.get('[data-cy=submit-essay]').should('not.be.disabled').click()

      cy.wait('@updateEssay').then(({ request }) => {
        expect(request.url).to.match(ESSAY_BY_ID_ROUTE)
        expect(request.body.title).to.eq(title)
        expect(request.body.sentences.map(sentence => sentence.original_text)).to.deep.eq([S1, S2])
      })
      cy.get('[data-cy=essay-topic-input]').should('not.exist')
    })
  })
})

/**
 * The teacher's review view: the essay's original version beside its current one, with the two
 * sides cross-highlighting. The essay is served from a stub, so the versions under test are exactly
 * the ones written here — a corrected sentence, a deleted one, and a sentence that was split in two.
 * The point of the fixture is that the two sides do NOT line up by position, which is the only way
 * to tell a working pairing from one that just uses the array index.
 */
describe('essay writing — teacher review', function () {
  const ESSAY_ID = '000000000000000000000042'
  const CORRECTED_ORIGINAL = 'Mina olen kissa.'
  const CORRECTED_CURRENT = 'Minä olen kissa.'
  const DELETED = 'Tämä lause poistettiin.'
  const SURVIVING = 'Koira juoksee puistossa.'
  const SPLIT_ORIGINAL = 'Ensimmäinen puolisko ja toinen puolisko.'
  const SPLIT_FIRST = 'Ensimmäinen puolisko.'
  const SPLIT_SECOND = 'Toinen puolisko.'

  const REVIEWED_ESSAY = {
    _id: ESSAY_ID,
    title: 'Reviewed essay',
    sentences: [
      // Corrected once: the original version still holds what was first written.
      {
        original_text: CORRECTED_CURRENT,
        sentence_id: 'sentence-corrected-v2',
        history: [{ sentence_id: 'sentence-corrected-v1', original_text: CORRECTED_ORIGINAL }],
        corrections: [],
        removed: false,
      },
      // Deleted by the student: in the original version only, so it shifts the two sides apart.
      {
        original_text: DELETED,
        sentence_id: 'sentence-deleted',
        history: [],
        corrections: [],
        removed: true,
      },
      {
        original_text: SURVIVING,
        sentence_id: 'sentence-surviving',
        history: [],
        corrections: [],
        removed: false,
      },
      // Split in two: one sentence in the original version, two in the current one.
      {
        original_text: SPLIT_FIRST,
        sentence_id: 'sentence-split-a',
        history: [{ sentence_id: 'sentence-split-root', original_text: SPLIT_ORIGINAL }],
        corrections: [],
        removed: false,
      },
      {
        original_text: SPLIT_SECOND,
        sentence_id: 'sentence-split-b',
        history: [{ sentence_id: 'sentence-split-root', original_text: SPLIT_ORIGINAL }],
        corrections: [],
        removed: false,
      },
    ],
  }

  const panel = side => cy.get('.essay-teacher-panel').eq(side === 'original' ? 0 : 1)
  const sentencesIn = side => panel(side).find('[data-cy=essay-version-sentence]')
  const highlighted = () => cy.get('.essay-sentence-highlighted')

  this.beforeAll(function () {
    cy.login(LANGUAGE, true, 'English')
  })

  this.beforeEach(function () {
    cy.loginExisting()
    stubLlmEndpoints()
    cy.intercept({ method: 'GET', url: ESSAY_LIST_ROUTE }, { essays: [REVIEWED_ESSAY] }).as(
      'essayList',
    )
    cy.intercept({ method: 'GET', url: ESSAY_BY_ID_ROUTE }, { essay: REVIEWED_ESSAY }).as('essay')

    openEssaysLibrary()
    cy.contains('[data-cy=essay-item]', REVIEWED_ESSAY.title, { timeout: 60000 }).click()
    cy.get('[data-cy=essay-detail-modal-edit-button]').click()
    cy.wait('@essay')
    sentencesIn('current').should('have.length', 4)
  })

  this.afterEach(function () {
    expect(unstubbedAiCalls, 'AI endpoints reached without a stub').to.deep.equal([])
  })

  this.afterAll(function () {
    cy.cleanUsers()
  })

  it('shows every sentence written on the left and only the surviving ones on the right', function () {
    sentencesIn('original').should('have.length', 4)
    sentencesIn('original').eq(0).should('contain', 'Mina')
    sentencesIn('original').eq(1).should('have.text', DELETED)
    sentencesIn('original').eq(3).should('have.text', SPLIT_ORIGINAL)

    sentencesIn('current').eq(0).should('have.text', CORRECTED_CURRENT)
    panel('current').should('not.contain', DELETED)
  })

  it('highlights the version a sentence came from, not the one at the same position', function () {
    // Third on the right, but fourth on the left: the deleted sentence sits between them.
    sentencesIn('current').eq(1).trigger('mouseover')
    highlighted().should('have.length', 1)
    highlighted().should('have.text', SURVIVING)

    sentencesIn('current').eq(1).trigger('mouseout')
    highlighted().should('not.exist')
  })

  it('highlights the sentence a correction was made in from its original', function () {
    sentencesIn('original').eq(0).trigger('mouseover')
    highlighted().should('have.length', 1)
    highlighted().should('have.text', CORRECTED_CURRENT)
  })

  it('highlights both halves of a split from the sentence they came out of', function () {
    sentencesIn('original').eq(3).trigger('mouseover')
    highlighted().should('have.length', 2)
    highlighted().eq(0).should('have.text', SPLIT_FIRST)
    highlighted().eq(1).should('have.text', SPLIT_SECOND)
  })

  it('marks a clicked word on its own side and its sentence on the other', function () {
    sentencesIn('current').eq(0).find('.essay-word').first().click()

    panel('current').find('.essay-word-highlighted').should('have.length', 1)
    highlighted().should('have.length', 1)
    highlighted().should('have.text', CORRECTED_ORIGINAL)
  })
})
