// A card shows at most seven glosses; past that the list outgrows the space the card gives it.
export const MAX_TRANSLATIONS = 7

// The glosses a card should display: de-duplicated, capped, and tolerant of a card whose glosses
// arrive as a single string rather than an array.
const cardTranslations = glosses =>
  (Array.isArray(glosses) ? [...new Set(glosses)] : [glosses].filter(Boolean)).slice(
    0,
    MAX_TRANSLATIONS,
  )

export default cardTranslations
