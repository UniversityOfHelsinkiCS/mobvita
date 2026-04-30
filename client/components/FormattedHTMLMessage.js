import React from 'react'
import DOMPurify from 'dompurify'
import { useIntl } from 'react-intl'

// Add rel=noopener noreferrer to all target=_blank links after sanitization
DOMPurify.addHook('afterSanitizeAttributes', node => {
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

const DEFAULT_CONFIG = {
  ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'br', 'p', 'ul', 'ol', 'li', 'a', 'div', 'span'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
}

const buildConfig = options => {
  if (!options) return DEFAULT_CONFIG
  return {
    ALLOWED_TAGS: options.allowedTags || DEFAULT_CONFIG.ALLOWED_TAGS,
    ALLOWED_ATTR: options.allowedAttributes
      ? Object.values(options.allowedAttributes).flat()
      : DEFAULT_CONFIG.ALLOWED_ATTR,
  }
}

// ignoreTag: true tells react-intl not to parse HTML tags as ICU rich-text elements,
// so translation strings with <ul>, <li>, <b> etc. are returned as raw HTML.
const FormattedHTMLMessage = ({ tagName: Tag = 'span', sanitizeOptions, id, values, ...rest }) => {
  const intl = useIntl()
  const content = intl.formatMessage({ id }, values ?? {}, { ignoreTag: true })

  if (!content.includes('<')) {
    return <Tag {...rest}>{content}</Tag>
  }

  const sanitizedMessage = DOMPurify.sanitize(content, buildConfig(sanitizeOptions))
  return <Tag {...rest} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
}

export default FormattedHTMLMessage
