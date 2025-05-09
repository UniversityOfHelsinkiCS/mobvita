/* eslint-disable */
const fs = require('fs');
const path = require('path')
const { google } = require('googleapis');
const sanitize = require('sanitize-html');
const { exit } = require('process');
require('dotenv').config()

const apiClient = new google.auth.GoogleAuth({
  keyFile: path.resolve(__dirname, 'creds.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})
addTranslations(apiClient)
const languages = ['fi', 'en', 'ru', 'it', 'zh', 'sv', 'uk']
async function addTranslations(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  Promise.all([
    sheets.spreadsheets.values.get({
      spreadsheetId: '1OVtLSEpLA6gmwS1LSRGQ1P6MwmhU1xAxOe6fsetCRZk',
      range: 'C:K',
    }),
    sheets.spreadsheets.values.get({
      spreadsheetId: '1qUitRG9RYZALDQId0CGM6tWOdmZmqCKEw6iEQcSyBMk',
      range: 'C:K',
    }),
  ]).then(results => {
    const translations = {}
    for (res of results){
      const keyMap = res.data.values[0].reduce((acc, key, i) => {
        acc[key] = i
        return acc
      }
      , {})
      const rows = res.data.values.slice(1);
      for (row of rows) {
        row.map(e => e.trim())
        if (!row[0]) continue
        const trimmedRow = row.map(e => e.trim())
        translations[trimmedRow[0]] = {}
        languages.map(lang => {
          translations[trimmedRow[0]][lang] = trimmedRow[keyMap[lang]] || trimmedRow[keyMap['en']] || ''
        })
      }
    }
    makeTranslations(translations)
  }).catch(err => {
    console.log('The API returned an error: ' + err);
  });
}

// validate html strings
// check if tags are closed properly
function validateHtml(html) {
  const config = {
    allowedAttributes: {
      a: ['href'],
      span: ['style']
    },
    '*': {
      // Match HEX and RGB
      'color': [/^.?$/],
      'text-align': [/^left$/, /^right$/, /^center$/],
      // Match any number with px, em, or %
      'font-size': [/^\d+(?:px|em|%)$/],
      'font-weight': [/^.+$/],
    },
  }
  // console.log(sanitize(html, config))
  // console.log(html)
  // console.log()
  // console.log()
  return html === sanitize(html, config)
}

function makeTranslations(translations) {
  for (lang of languages) {
    let changes = 0
    let news = 0
    const fileName = path.resolve(__dirname, `./client/util/translations/revita/${lang}/LC_MESSAGES/messages.json`)
    const file = require(fileName)

    for ([key, langs] of Object.entries(translations)) {
      const orig = file[key]
      file[key] = langs[lang]
      if (!validateHtml(file[key].replace(/\s*\/>/g, ' />'))) {
        console.log(`invalid html in ${lang} ${key} -> ${file[key]}`)
        exit(1)
      }
      else if (orig === undefined) {
        news++
      }
      else if (orig != file[key]) {
      changes++}
    }

    fs.writeFile(fileName, JSON.stringify(file, null, '    '), (err) => {
      if (err) return console.log(err)
      console.log(`writing ${news} new translations, ${changes} changes to ${fileName}`)
    })
  }
}

