import React from 'react'
import { useIntl } from 'react-intl'
import SanitizedHTML from 'Components/SanitizedHTML'

// ignoreTag: true tells react-intl not to parse HTML tags as ICU rich-text elements,
// so translation strings with <ul>, <li>, <b> etc. are returned as raw HTML.
const FormattedHTMLMessage = ({ tagName: Tag = 'span', sanitizeOptions, id, values, ...rest }) => {
  const intl = useIntl()
  const content = intl.formatMessage({ id }, values ?? {}, { ignoreTag: true })

  return (
    <SanitizedHTML
      html={content}
      sanitizeOptions={sanitizeOptions}
      tagName={Tag}
      {...rest}
    />
  )
}

export default FormattedHTMLMessage
