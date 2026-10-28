import { useEffect, useState } from 'react'

let lemmatize = null
let loading = null

// Fetches the English lemmatizer once; its ~500 KB dictionary is why it is not in the bundle.
const loadLemmatizer = () => {
  loading ??= import('lemmatizer')
    .then(module => {
      lemmatize = module.lemmatizer
      return lemmatize
    })
    .catch(() => {
      loading = null
      return null
    })
  return loading
}

// The English lemmatizer once loaded, returning words unchanged until then; nothing is fetched
// while `enabled` is false, so users who never look up an English gloss never download it.
const useLemmatizer = enabled => {
  const [loaded, setLoaded] = useState(() => lemmatize)

  useEffect(() => {
    if (!enabled || loaded) return undefined
    let active = true
    loadLemmatizer().then(fn => {
      if (active && fn) setLoaded(() => fn)
    })
    return () => {
      active = false
    }
  }, [enabled, loaded])

  return loaded ?? (word => word)
}

export default useLemmatizer
