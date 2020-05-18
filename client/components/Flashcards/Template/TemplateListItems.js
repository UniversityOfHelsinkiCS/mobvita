import React from 'react'
import { Icon } from 'semantic-ui-react'
import sanitizeHtml from 'sanitize-html'

const TemplateListItems = ({ values, handleDelete, bigScreen = false, italics = false }) => {
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

  const itemClass = bigScreen ? 'padding-bottom-1' : 'padding-bottom-2'
  const textClass = italics ? 'padding-right-1 full-width italics' : 'padding-right-1 full-width'

  return (
    <>
      {
        values.map((value, index) => (
          /* eslint-disable-next-line */
          <li key={`${value}-${index}`} className={itemClass}>
            <div className="space-between align-center">
              <span className={textClass} dangerouslySetInnerHTML={sanitize(value)} />
              <Icon
                name="close"
                color="grey"
                style={{ textShadow: 'none', cursor: 'pointer', marginRight: 0 }}
                onClick={() => handleDelete(value)}
              />
            </div>
          </li>
        ))
      }
    </>
  )
}

export default TemplateListItems
