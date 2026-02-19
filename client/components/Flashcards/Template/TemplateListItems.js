import React from 'react'
import { Icon } from 'semantic-ui-react'
import { sanitizeHtml } from 'Utilities/common'

const TemplateListItems = ({ values, handleDelete, bigScreen = false, italics = false }) => {
  const itemClass = bigScreen ? 'pb-sm' : 'pb-nm'
  const textClass = italics ? 'pr-sm full-width italics' : 'pr-sm full-width'

  return (
    <>
      {values.map((value, index) => (
        /* eslint-disable-next-line */
        <li key={`${value}-${index}`} className={itemClass}>
          <div className="space-between align-center">
            <span className={textClass} dangerouslySetInnerHTML={sanitizeHtml(value)} />
            <Icon
              name="close"
              color="grey"
              style={{ textShadow: 'none', cursor: 'pointer', marginRight: 0 }}
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                handleDelete(index)
              }}
            />
          </div>
        </li>
      ))}
    </>
  )
}

export default TemplateListItems
