import React from 'react'
import { Icon } from 'semantic-ui-react'
import sanitizeHtml from 'sanitize-html'

const TemplateListItems = ({ values, handleDelete }) => {
  const defaultOptions = {
    allowedTags:
      ['b', 'i', 'em', 'strong', 'br', 'mark', 'small', 'sub', 'sup', 'ins', 'del'],
  }

  const sanitize = dirty => ({
    __html: sanitizeHtml(
      dirty,
      defaultOptions,
    ),
  })

  return (
    <>
      {
        values.map((value, index) => (
          /* eslint-disable-next-line */
          <li key={`${value}-${index}`} className="test">
            <span dangerouslySetInnerHTML={sanitize(value)} />
            <Icon
              name="close"
              color="grey"
              style={{ textShadow: 'none', lineHeight: '1.5rem', cursor: 'pointer' }}
              onClick={() => handleDelete(value)}
            />
          </li>
        ))
      }
    </>
  )
}

export default TemplateListItems
