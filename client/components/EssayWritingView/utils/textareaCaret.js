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
