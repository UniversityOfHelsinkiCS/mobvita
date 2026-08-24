/// <reference types="cypress" />

/**
 * DESIGN SCREENSHOT CRAWLER — not part of deployment/CI.
 *
 * Runs one scenario per role (student + teacher by default). Each logs in fresh, walks a curated set
 * of pages (plus, optionally, links discovered on each page), and saves a full-page screenshot of
 * every page it reaches. On each page it can also click a few "active elements" (buttons) and
 * screenshot the result. Every shot is named with its position in the crawl tree, into a per-mode
 * subfolder, and ONE combined manifest (`site-tree.json`/`.txt`, tagged by mode) records all scenarios.
 *
 * Output: cypress/design-screenshots/design_screenshots.cy.js/<mode>/…  + site-tree.{json,txt}
 *
 * Run it (dev server must be up on :8000):
 *   npm run design:screenshots          # headless Chrome — BOTH roles
 *   npm run design:screenshots:teacher  # teacher only
 *   npm run design:screenshots:open     # interactive
 *
 * Tunables via Cypress env (e.g. `--env mode=teacher,maxPages=40`):
 *   mode               'student' | 'teacher' — run only that role  (default: run BOTH)
 *                      teacher runs with student-view OFF (teacherView defaults on for teachers)
 *   maxPages           hard cap on total pages visited            (default 30)
 *   discoverDepth      how many link-hops past the seed pages       (default 0 = seeds only)
 *   clickElements      also click active elements on each page      (default false)
 *   maxElements        max active elements clicked per page         (default 5)
 *   flatten            un-pin the fixed navbar for full-page shots  (default false)
 *   preloadMs          wait before checking load state, per page     (default 2000)
 *   settleMs           pause after load, before capturing            (default 1500)
 *   maxShotWidth       cap on captured width                         (default 2560)
 *   maxShotHeight      cap on captured height                        (default 4000)
 *   learningLanguage   language to log in with                      (default 'Finnish')
 */

const env = Cypress.env()
// By default run BOTH scenarios for the full picture; `--env mode=student|teacher` runs just one.
const MODES = env.mode ? [env.mode === 'teacher' ? 'teacher' : 'student'] : ['student', 'teacher']
const MAX_PAGES = Number(env.maxPages ?? 30)
const DISCOVER_DEPTH = Number(env.discoverDepth ?? 0)
const CLICK_ELEMENTS = env.clickElements === true || env.clickElements === 'true'
const FLATTEN_FIXED = env.flatten === true || env.flatten === 'true'
const SIDEBAR_VARIANT =
  env.sidebarVariant === undefined
    ? true
    : env.sidebarVariant !== false && env.sidebarVariant !== 'false'
const MAX_ELEMENTS = Number(env.maxElements ?? 5)
const LEARNING_LANGUAGE = env.learningLanguage ?? 'Finnish'
const PRELOAD_MS = Number(env.preloadMs ?? 2000) // let async content start loading / spinner mount
const SETTLE_MS = Number(env.settleMs ?? 1500) // pause after the spinner clears, before capturing
const SPINNER_TRIES = 30 // × 500ms = up to 15s waiting for a page to finish loading
const VIEWPORT_W = 1920
const VIEWPORT_H = 1080
// We screenshot in ONE viewport-sized shot (no full-page stitching), growing the viewport to the
// page's real width/height first. Caps avoid over-large viewports; bigger pages are cut, not tiled.
const MAX_SHOT_HEIGHT = Number(env.maxShotHeight ?? 4000)
const MAX_SHOT_WIDTH = Number(env.maxShotWidth ?? 2560)
const OUT_DIR = 'cypress/design-screenshots'

// Loading indicators used across the app (AppSpinner uses aria-label="loading"; MUI spinner + legacy).
const SPINNER_SELECTOR = '[aria-label="loading"], .MuiCircularProgress-root, .lds-roller'
// The fixed navbar (react-headroom). A `.headroom-wrapper` already reserves its height, so we can
// un-pin `.headroom` to `absolute` and it shows once at the top instead of repeating on every
// stitched slice of the full-page screenshot. Content containers are never touched.
const NAVBAR_SELECTOR = '.headroom'
// Small floating widgets that would also repeat down a tall capture — hidden for the shot.
const HIDE_ON_CAPTURE =
  '.scroll-to-top, .logout-button, .dictionary-button, .draggable-encouragement, .draggable-encouragement-mobile'

// Curated, parameter-free pages shared by both roles (depth 0). Routes needing an :id/:storyId
// (individual stories, crosswords, lesson/group practice) and auth/utility routes are excluded.
// Note: /adaptive-test and /reading-test open a test flow — kept for the start screen; drop them
// if they get in the way.
const COMMON_PATHS = [
  // Home / onboarding
  '/home',
  '/welcome',
  '/learningLanguage', // learning-language picker (redesigned)
  '/interfaceLearningLanguage', // interface-language picker (redesigned)
  // Library
  '/library',
  '/library/private',
  '/library/group',
  // Lessons
  '/lessons/library',
  // Flashcards
  '/flashcards',
  // Grammar / concepts reference
  '/concepts',
  // Tests
  '/tests',
  '/reading-test',
  '/adaptive-test',
  // Achievements
  '/achievements',
  // Profile
  '/profile/main',
  '/profile/account',
  '/profile/progress',
  '/profile/progress/flashcards',
  '/profile/progress/grammar',
  '/profile/settings',
  '/profile/following',
  // Help
  '/help',
  // Dev-only design-system reference page
  '/design',
]

// Role-specific groups pages — teacher gets the analytics/people management views.
const STUDENT_PATHS = ['/groups/student', '/groups/student/people']
const TEACHER_PATHS = ['/groups/teacher', '/groups/teacher/analytics', '/groups/teacher/people']
const seedPaths = isTeacher => [...COMMON_PATHS, ...(isTeacher ? TEACHER_PATHS : STUDENT_PATHS)]

// Never navigate into / click these — they log out, leave the app, or are pure API endpoints.
const BLOCKED = [/\/logout/i, /^\/api\//i, /^\/email-confirm/i, /^\/reset-password/i]
const BLOCKED_CY = [/logout/i, /sign-?out/i, /delete/i, /remove/i]

const slug = path =>
  (
    path
      .replace(/^\//, '')
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '') || 'root'
  ).slice(0, 60)

const isInternal = href => {
  try {
    const u = new URL(href, 'http://localhost:8000')
    if (u.origin !== 'http://localhost:8000') return false
    if (BLOCKED.some(re => re.test(u.pathname))) return false
    return u.pathname
  } catch (e) {
    return false
  }
}

// Every scenario's page records land here, tagged by mode, and a single combined manifest is written
// once at the end (see the root after() below). Generalizes to any number of scenarios.
const allRecords = [] // { mode, order, depth, path, parent, screenshot, links, elements, variants }

// One suite per mode. By default both run (student then teacher); each gets a fresh login and its own
// crawl state, but they all contribute to the one shared manifest.
MODES.forEach(mode => {
  const isTeacher = mode === 'teacher'

  describe(`Design screenshot crawler (${mode})`, () => {
    const visited = new Set()
    let order = 0

    before(() => {
      cy.viewport(VIEWPORT_W, VIEWPORT_H)
      cy.visit('/')
      // teacher: is_teacher=true; teacherView defaults on for teachers, so student view is OFF.
      cy.login(LEARNING_LANGUAGE, isTeacher)
    })

    it(`crawls the app and collects design screenshots (${mode})`, () => {
      // Build the initial work queue from the seed pages (depth 0).
      const queue = seedPaths(isTeacher).map(path => ({ path, depth: 0, parent: null }))
      crawl(queue)
    })

    // --- crawl engine ---------------------------------------------------------------------------

    function crawl(queue) {
      if (!queue.length || order >= MAX_PAGES) return
      const { path, depth, parent } = queue.shift()
      if (visited.has(path)) return crawl(queue)
      visited.add(path)
      const myOrder = order++
      // Mode-scoped subfolder (Cypress creates nested dirs from `/` in the name) keeps
      // student/teacher screenshot sets separate.
      const name = `${mode}/${String(myOrder).padStart(2, '0')}__d${depth}__${slug(path)}`
      const record = {
        mode,
        order: myOrder,
        depth,
        path,
        parent,
        screenshot: name,
        links: [],
        elements: [],
      }

      cy.log(`(${myOrder}) visiting ${path}`)
      cy.visit(path, { failOnStatusCode: false })
      dismissOnboarding()
      capture(name)
      captureSidebarClosed(name, record)

      // Collect internal links for discovery + record them as tree info.
      cy.document().then(doc => {
        const found = new Set()
        doc.querySelectorAll('a[href]').forEach(a => {
          const p = isInternal(a.getAttribute('href'))
          if (p) found.add(p)
        })
        record.links = [...found]
        if (depth < DISCOVER_DEPTH) {
          record.links.forEach(p => {
            if (!visited.has(p)) queue.push({ path: p, depth: depth + 1, parent: path })
          })
        }
      })

      // Click a few active elements on this page and screenshot the result.
      if (CLICK_ELEMENTS) clickElements(path, name, record)

      allRecords.push(record)

      cy.then(() => crawl(queue))
    }

    // Screenshot the effect of clicking up to MAX_ELEMENTS interactive elements on a page.
    // Each click re-visits the page first so state never carries over between elements.
    function clickElements(path, baseName, record) {
      const SELECTOR = 'button:visible:not([disabled]), [role="button"]:visible'
      cy.get('body').then($body => {
        const $els = $body.find(SELECTOR)
        const targets = []
        $els.each((i, el) => {
          if (targets.length >= MAX_ELEMENTS) return
          const cyAttr = el.getAttribute('data-cy') || ''
          const label = cyAttr || (el.innerText || '').trim().slice(0, 30)
          if (!label) return
          if (BLOCKED_CY.some(re => re.test(cyAttr))) return
          targets.push({ index: i, label })
        })
        record.elements = targets.map(t => t.label)

        targets.forEach((t, n) => {
          const elName = `${baseName}__el${String(n).padStart(2, '0')}__${slug(t.label)}`
          // Fresh page each time so a previous click can't hide/detach this element.
          cy.visit(path, { failOnStatusCode: false })
          dismissOnboarding()
          cy.wait(500)
          cy.get('body').then($b => {
            const $again = $b.find(SELECTOR)
            if (t.index >= $again.length) return
            cy.wrap($again.eq(t.index)).click({ force: true })
            capture(elName)
          })
        })
      })
    }

    // Inject CSS that hides the scrollbars so they don't show in the shot. Hiding the vertical gutter
    // also reflows content to full width, which removes the horizontal scrollbar too. Reset on next
    // cy.visit() reload, so no explicit teardown is needed.
    function hideScrollbars() {
      cy.document().then(doc => {
        if (doc.getElementById('cy-hide-scrollbars')) return
        const style = doc.createElement('style')
        style.id = 'cy-hide-scrollbars'
        style.textContent =
          '*{scrollbar-width:none!important;-ms-overflow-style:none!important}' +
          '::-webkit-scrollbar{width:0!important;height:0!important;display:none!important}'
        doc.head.appendChild(style)
      })
    }

    // Capture routine — one non-stitched shot. Full-page (stitched) captures overlap on this app's
    // layout, so instead we grow the viewport to the page height and take a single `viewport` shot.
    function capture(name) {
      cy.wait(PRELOAD_MS) // give async data a moment to request before we check for spinners
      waitForLoaded()
      hideScrollbars()
      cy.wait(SETTLE_MS)
      cy.document().then(doc => {
        const el = doc.documentElement
        const body = doc.body
        const fullH = Math.max(el.scrollHeight, el.offsetHeight, body ? body.scrollHeight : 0)
        const fullW = Math.max(el.scrollWidth, el.offsetWidth, body ? body.scrollWidth : 0)
        const height = Math.min(Math.max(fullH, VIEWPORT_H), MAX_SHOT_HEIGHT)
        const width = Math.min(Math.max(fullW, VIEWPORT_W), MAX_SHOT_WIDTH)
        cy.viewport(width, height)
      })
      waitForLoaded() // resizing can trigger a little lazy rendering
      cy.wait(SETTLE_MS)
      cy.scrollTo('topLeft', { ensureScrollable: false })
      if (FLATTEN_FIXED) freezeFixed()
      cy.screenshot(name, { capture: 'viewport', overwrite: true, scale: false })
      if (FLATTEN_FIXED) restoreFixed()
      cy.viewport(VIEWPORT_W, VIEWPORT_H) // back to normal for navigation
    }

    // If the sidebar is open (content carries `.sidebar-pushed`), click the hamburger to close it and
    // take a second shot of the sidebar-closed layout.
    function captureSidebarClosed(baseName, record) {
      if (!SIDEBAR_VARIANT) return
      cy.get('body').then($body => {
        const $ham = $body.find('.sidebar-hamburger')
        const open = $body.find('.sidebar-pushed').length > 0
        if (!$ham.length || !open) return
        cy.wrap($ham.first()).click({ force: true })
        cy.wait(600) // sidebar close animation
        const variant = `${baseName}__sidebar-closed`
        record.variants = [...(record.variants || []), variant]
        capture(variant)
      })
    }

    // Poll until no loading spinner is visible (or we run out of tries), so pages aren't shot mid-load.
    function waitForLoaded(triesLeft = SPINNER_TRIES) {
      cy.document().then(doc => {
        const spinning = [...doc.querySelectorAll(SPINNER_SELECTOR)].some(
          el => el.offsetParent !== null,
        )
        if (spinning && triesLeft > 0) {
          cy.wait(500)
          waitForLoaded(triesLeft - 1)
        }
      })
    }

    // full-page screenshots stitch multiple viewports, so the fixed navbar repeats down the image.
    // Un-pin just the navbar (→ absolute, once at top) and hide floating widgets. Content is untouched,
    // and modals/dialogs are left alone so element-click captures keep their overlays.
    let frozen = []
    function freezeFixed() {
      cy.document().then(doc => {
        frozen = []
        doc.querySelectorAll(NAVBAR_SELECTOR).forEach(node => {
          frozen.push([node, node.getAttribute('style')])
          node.style.position = 'absolute'
          node.style.top = '0'
          node.style.left = '0'
          node.style.right = '0'
        })
        doc.querySelectorAll(HIDE_ON_CAPTURE).forEach(node => {
          frozen.push([node, node.getAttribute('style')])
          node.style.display = 'none'
        })
      })
    }

    function restoreFixed() {
      cy.then(() => {
        frozen.forEach(([node, prev]) => {
          if (prev === null) node.removeAttribute('style')
          else node.setAttribute('style', prev)
        })
        frozen = []
      })
    }

    // Best-effort dismissal of onboarding modals that can appear after login / language use.
    function dismissOnboarding() {
      const DISMISS = [
        '[data-cy=interface-language-continue-button]',
        '[data-cy=set-cefr-role-student-button]',
        '[data-cy=beta-language-modal-continue]',
        '[data-cy=beta-language-modal-close]',
        '[aria-label=close]',
      ]
      cy.get('body').then($body => {
        DISMISS.forEach(sel => {
          const $el = $body.find(sel)
          if ($el.length && $el.is(':visible')) {
            cy.wrap($el.first()).click({ force: true })
            cy.wait(300)
          }
        })
      })
    }
  })
})

// Runs once after every scenario suite — write the single combined manifest for all modes.
after(() => {
  cy.writeFile(`${OUT_DIR}/site-tree.json`, JSON.stringify(allRecords, null, 2))
  const lines = []
  let lastMode = null
  allRecords.forEach(m => {
    if (m.mode !== lastMode) {
      lines.push(`${lastMode === null ? '' : '\n'}=== ${m.mode} ===`)
      lastMode = m.mode
    }
    const indent = '  '.repeat(m.depth)
    const kids = m.elements.length ? `  (+${m.elements.length} element shots)` : ''
    lines.push(`${indent}[${String(m.order).padStart(2, '0')}] ${m.path} -> ${m.screenshot}.png${kids}`)
  })
  cy.writeFile(`${OUT_DIR}/site-tree.txt`, lines.join('\n'))
})
