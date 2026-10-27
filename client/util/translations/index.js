import en from 'Utilities/translations/revita/en/LC_MESSAGES/messages'

// English ships in the main bundle as the fallback; the other languages are fetched only when used.
const loaders = {
  fi: () => import('Utilities/translations/revita/fi/LC_MESSAGES/messages'),
  it: () => import('Utilities/translations/revita/it/LC_MESSAGES/messages'),
  ru: () => import('Utilities/translations/revita/ru/LC_MESSAGES/messages'),
  sv: () => import('Utilities/translations/revita/sv/LC_MESSAGES/messages'),
  zh: () => import('Utilities/translations/revita/zh/LC_MESSAGES/messages'),
  uk: () => import('Utilities/translations/revita/uk/LC_MESSAGES/messages'),
}

const loaded = { en }

// Messages already in memory for a locale (merged over English), or undefined if not fetched yet.
export const getLoadedMessages = locale => (loaders[locale] ? loaded[locale] : en)

// Fetches a locale once and merges it over English, so missing keys fall back as before.
export const loadMessages = async locale => {
  if (getLoadedMessages(locale)) return getLoadedMessages(locale)
  const module = await loaders[locale]()
  // A stale chunk resolves empty while deployUpdates reloads the page; English bridges the gap.
  if (!module) return en
  loaded[locale] = { ...en, ...module.default }
  return loaded[locale]
}
