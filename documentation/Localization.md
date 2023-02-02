## Localization

[Localization Master Table](https://docs.google.com/spreadsheets/d/1OVtLSEpLA6gmwS1LSRGQ1P6MwmhU1xAxOe6fsetCRZk/edit#gid=0)

Translations are added to the master table which provides keys for the front- and backend.
Note: not all translations are currently found on the spreadsheet, so you should first look for them in
"./client/util/translations/revita" which contains json files for all the supported languages.

### Using the translation keys

The translations work on a key-value system. You can use the json-keys in your code and it will return the translation in the user's selected language as a value.

For examples in code, see: [in react component](https://github.com/UniversityOfHelsinkiCS/mobvita/blob/8f7c5228c0dd5e0f37421aa86d4350637bab74a0/client/components/HomeView/index.js#L144) & [in JS](https://github.com/UniversityOfHelsinkiCS/mobvita/blob/8f7c5228c0dd5e0f37421aa86d4350637bab74a0/client/components/NavBar.js#L87)

### Adding translations to the master table

To add any translations, you need to first ask for write-rights to the spreadsheet.
The json_key is used in the front end to fetch the correct translation for the user's language from the local json files.
(the po_key is used in the backend so no need to worry about that)


### Updating the local translation files

Once a new translation has been added to the spreadsheet, you must sync it with the local json files.
This is achieved using the syncTranslations.js that is found in the root of the project.

syncTranslations.js requires that you have a .env file in the root of your project with an API key.

1. Create a .env file to the root of the project

2. Add the key in to the .env file(without the brackets), see Slack for a key
```
GOOGLE_APIKEY={your key here}
```
3. run:
```
node syncTranslations.js
```

All should be done now and the json files for each language should be updated.