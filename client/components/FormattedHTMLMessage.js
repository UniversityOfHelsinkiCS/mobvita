import React from 'react'
import PropTypes from 'prop-types'
import sanitizeHtml from 'sanitize-html'
import { FormattedMessage } from 'react-intl'

const DEFAULT_SANITIZE_OPTIONS = {
  allowedTags: ['b', 'strong', 'i', 'em', 'u', 'br', 'p', 'ul', 'ol', 'li', 'a', 'div', 'span'],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: (tagName, attribs) => {
      const safeAttrs = { ...attribs }

      if (safeAttrs.target === '_blank') {
        safeAttrs.rel = 'noopener noreferrer'
      }

      return { tagName, attribs: safeAttrs }
    },
  },
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

      const sanitizedMessage = sanitizeHtml(content, sanitizeOptions || DEFAULT_SANITIZE_OPTIONS)

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
