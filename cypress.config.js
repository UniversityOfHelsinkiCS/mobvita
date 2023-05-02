const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'q9wzp2',
  defaultCommandTimeout: 60000,
  responseTimeout: 60000,
  blockHosts: ['www.googletagmanager.com', 'www.google-analytics.com'],
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
