const TEXTAREA_CARET_STYLE_PROPERTIES = [
  'boxSizing',
  'width',
  'height',
  'overflowX',
  'overflowY',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'lineHeight',
  'fontFamily',
  'textAlign',
  'textTransform',
  'textIndent',
  'letterSpacing',
  'wordSpacing',
  'tabSize',
]

export const getTextareaCaretCoordinates = (textarea, offset) => {
  if (!textarea || typeof window === 'undefined' || typeof document === 'undefined') {
    return null
  }

  const textareaStyle = window.getComputedStyle(textarea)
  const mirror = document.createElement('div')

  TEXTAREA_CARET_STYLE_PROPERTIES.forEach(property => {
    mirror.style[property] = textareaStyle[property]
  })

  mirror.style.position = 'absolute'
  mirror.style.visibility = 'hidden'
  mirror.style.whiteSpace = 'pre-wrap'
  mirror.style.overflowWrap = 'break-word'
  mirror.style.top = '0'
  mirror.style.left = '-9999px'
  mirror.textContent = textarea.value.slice(0, offset)

  const marker = document.createElement('span')
  marker.textContent = textarea.value.slice(offset, offset + 1) || '.'
  mirror.appendChild(marker)

  document.body.appendChild(mirror)

  const coordinates = {
    fontFamily: textareaStyle.fontFamily,
    fontSize: textareaStyle.fontSize,
    left: marker.offsetLeft - textarea.scrollLeft,
    lineHeight: textareaStyle.lineHeight,
    top: marker.offsetTop - textarea.scrollTop,
  }

  document.body.removeChild(mirror)

  return coordinates
}

// Measures the on-screen rectangles for multiple text ranges using a hidden textarea mirror.
// Each range is wrapped in a <span> and measured with getClientRects(), avoiding caret wrap bugs.
// Returns rects relative to the textarea's padding box (scroll already subtracted).
export const getTextareaRangeRects = (textarea, ranges) => {
  if (
    !textarea ||
    !ranges ||
    !ranges.length ||
    typeof window === 'undefined' ||
    typeof document === 'undefined'
  ) {
    return []
  }

  const textareaStyle = window.getComputedStyle(textarea)
  const mirror = document.createElement('div')

  TEXTAREA_CARET_STYLE_PROPERTIES.forEach(property => {
    mirror.style[property] = textareaStyle[property]
  })

  mirror.style.position = 'absolute'
  mirror.style.visibility = 'hidden'
  mirror.style.whiteSpace = 'pre-wrap'
  mirror.style.overflowWrap = 'break-word'
  mirror.style.top = '0'
  mirror.style.left = '-9999px'

  const value = textarea.value
  const sortedRanges = [...ranges].sort((first, second) => first.start - second.start)
  const measuredSpans = []
  let cursor = 0

  sortedRanges.forEach(range => {
    const start = Math.max(range.start, cursor)
    const end = Math.max(range.end, start)

    if (start > cursor) {
      mirror.appendChild(document.createTextNode(value.slice(cursor, start)))
    }

    const span = document.createElement('span')
    span.textContent = value.slice(start, end)
    mirror.appendChild(span)
    measuredSpans.push({ range, span })
    cursor = end
  })

  mirror.appendChild(document.createTextNode(value.slice(cursor)))
  document.body.appendChild(mirror)

  const mirrorRect = mirror.getBoundingClientRect()
  const borderLeft = parseFloat(textareaStyle.borderLeftWidth) || 0
  const borderTop = parseFloat(textareaStyle.borderTopWidth) || 0
  const { scrollLeft, scrollTop } = textarea

  const result = measuredSpans.map(({ range, span }) => ({
    key: range.key,
    type: range.type,
    rects: Array.from(span.getClientRects())
      .map(rect => ({
        left: rect.left - mirrorRect.left - borderLeft - scrollLeft,
        top: rect.top - mirrorRect.top - borderTop - scrollTop,
        width: rect.width,
        height: rect.height,
      }))
      .filter(rect => rect.width > 0),
  }))

  document.body.removeChild(mirror)

  return result
}
