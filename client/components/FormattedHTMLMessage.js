import React from 'react'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify'
import { FormattedMessage } from 'react-intl'

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

const FormattedHTMLMessage = ({ tagName: Tag, sanitizeOptions, ...props }) => (
  <FormattedMessage {...props}>
    {message => {
      if (Array.isArray(message) || React.isValidElement(message)) {
        return <Tag>{message}</Tag>
      }

      const content = String(message ?? '')

      if (!content.includes('<')) {
        return <Tag>{content}</Tag>
      }

      const sanitizedMessage = DOMPurify.sanitize(content, buildConfig(sanitizeOptions))

      return <Tag dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    }}
  </FormattedMessage>
)

FormattedHTMLMessage.propTypes = {
  tagName: PropTypes.elementType,
  sanitizeOptions: PropTypes.object,
}

FormattedHTMLMessage.defaultProps = {
  tagName: 'span',
  sanitizeOptions: undefined,
}

export default FormattedHTMLMessage
