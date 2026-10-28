// lodash's isEmpty: nullish values, '' and [] are empty, as are Maps/Sets with no entries and
// objects with no own keys; any other primitive (numbers, booleans) also counts as empty.
const isEmpty = value => {
  if (value == null) return true
  if (typeof value === 'string' || Array.isArray(value)) return value.length === 0
  if (value instanceof Map || value instanceof Set) return value.size === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return true
}

export default isEmpty
