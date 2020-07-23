/* eslint-disable */
const fs = require('fs')

const newKey = process.argv[2]

translations = {}

if (!newKey) {
  console.log('give translation as arg')
  process.exit(1)
}

for (trPair of process.argv.slice(3)) {
  const [lang, val] = trPair.split('=')
  translations[lang] = val.replace(/['"]+/g, '')
}



const langs = ['fi', 'en', 'it', 'ru', 'sv']
for (lang of langs) {
  const fileName = `./client/util/translations/revita/${lang}/LC_MESSAGES/messages.json`
  const file = require(fileName)

  file[newKey] = translations[lang] || ''

  fs.writeFile(fileName, JSON.stringify(file, null, '    '), function writeJSON(err) {
    if (err) return console.log(err)
    console.log(`writing to ${fileName}`)
  })
}

