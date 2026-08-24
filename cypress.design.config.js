const { defineConfig } = require('cypress')

/**
 * Standalone Cypress config for the DESIGN SCREENSHOT CRAWLER.
 *
 * This is intentionally separate from cypress.config.js so it is NOT part of the
 * deployment/CI test run (that run uses cypress.config.js → cypress/e2e/**). It only runs when
 * explicitly invoked with `--config-file cypress.design.config.js` (see the `design:*` npm scripts).
 *
 * It crawls the app as a student, screenshotting each page, and writes the screenshots plus a
 * site-tree manifest into `cypress/design-screenshots/` for reviewing the 2026 redesign.
 */
module.exports = defineConfig({
  projectId: 'q9wzp2',
  defaultCommandTimeout: 60000,
  responseTimeout: 60000,
  pageLoadTimeout: 120000,
  retries: { runMode: 0, openMode: 0 },
  video: false,
  screenshotOnRunFailure: false,
  screenshotsFolder: 'cypress/design-screenshots',
  trashAssetsBeforeRuns: true,
  blockHosts: ['www.googletagmanager.com', 'www.google-analytics.com'],
  e2e: {
    baseUrl: 'http://localhost:8000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/design/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // Force 1:1 pixels and let Chrome hide scrollbars for us, so screenshots are true-size and clean.
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push('--hide-scrollbars')
          launchOptions.args.push('--force-device-scale-factor=1')
          launchOptions.args.push('--high-dpi-support=1')
          launchOptions.args.push('--window-size=1920,1080')
        }
        return launchOptions
      })
      return require('./cypress/plugins/index.js')(on, config)
    },
  },
})
