/* eslint-disable */
const fs = require('fs');
const path = require('path')
const { google } = require('googleapis');
require('dotenv').config()

const apiClient = google.auth.fromAPIKey('AIzaSyBOrc3tfhvfYuIV5AT5gSOpRx2zwcSquDs')
addTranslations(apiClient)

async function addTranslations(auth) {
  const sheets = google.sheets({version: 'v4', auth});

  sheets.spreadsheets.values.get({
    spreadsheetId: '1OVtLSEpLA6gmwS1LSRGQ1P6MwmhU1xAxOe6fsetCRZk',
    range: 'B:H',
  }).then(res => {
    const rows = res.data.values.slice(1);
    const translations = {}

    for (row of rows) {
      if (!row[0]) continue
      const eng = row[2] || ''
      translations[row[0]] = {
        en: eng,
        it: row[3] || eng,
        fi: row[4] || eng,
        ru: row[5] || eng,
        sv: row[6] || eng,
      }
    }
    
    makeTranslations(translations)
  }).catch(err => {
    console.log('The API returned an error: ' + err);
  });
}

function makeTranslations(translations) {
  const languages = ['fi', 'en', 'sv', 'ru', 'it']
  for (lang of languages) {
    let changes = 0
    let news = 0
    const fileName = path.resolve(__dirname, `./client/util/translations/revita/${lang}/LC_MESSAGES/messages.json`)
    const file = require(fileName)

    for ([key, langs] of Object.entries(translations)) {
      const orig = file[key]
      file[key] = langs[lang]
      if (orig === undefined) {
        news++
      } else if (orig != file[key]) {
        changes++
      }
     else if (lang == 'it'){
        console.log('---')
        console.log(orig)
        console.log(file[key])}
    }

    fs.writeFile(fileName, JSON.stringify(file, null, '    '), (err) => {
      if (err) return console.log(err)
      console.log(`writing ${news} new translations, ${changes} changes to ${fileName}`)
    })
  }
}

