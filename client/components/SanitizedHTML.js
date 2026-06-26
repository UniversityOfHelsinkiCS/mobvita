import React from 'react'
import DOMPurify from 'dompurify'

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

const SanitizedHTML = ({ tagName: Tag = 'span', html, sanitizeOptions, ...rest }) => {
  const content = html === null || html === undefined ? '' : String(html)

  if (!content.includes('<')) {
    return <Tag {...rest}>{content}</Tag>
  }

  const sanitizedHtml = DOMPurify.sanitize(content, buildConfig(sanitizeOptions))

  return <Tag {...rest} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
}

export default SanitizedHTML
