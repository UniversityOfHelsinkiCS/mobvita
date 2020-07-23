/* eslint-disable */
const fs = require('fs');
const { google } = require('googleapis');

const apiClient = google.auth.fromAPIKey(process.env.GOOGLE_APIKEY)
addTranslations(apiClient)

function addTranslations(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1OVtLSEpLA6gmwS1LSRGQ1P6MwmhU1xAxOe6fsetCRZk',
    range: 'A900:H2000',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    console.log(rows)
    const translations = {}


    for (row of rows) {
      translations[row[0]] = {
        en: row[2] || '',
        it: row[3] || '',
        fi: row[4] || '',
        ru: row[5] || '',
        sv: row[6] || ''
      }
    }

    makeTranslations(translations)
  });
}

function makeTranslations(translations) {

  const languages = ['fi', 'en', 'sv', 'ru', 'it']
  for (lang of languages) {
    const fileName = `./client/util/translations/revita/${lang}/LC_MESSAGES/messages.json`
    const file = require(fileName)

    for ([key, langs] of Object.entries(translations)) {
      file[key] = langs[lang]
    }

    fs.writeFile(fileName, JSON.stringify(file, null, '    '), function writeJSON(err) {
      if (err) return console.log(err)
      console.log(`writing to ${fileName}`)
    })
  }
}

