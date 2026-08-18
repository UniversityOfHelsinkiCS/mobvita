import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { sanitizeHtml } from 'Utilities/common'

const TemplateListItems = ({ values, handleDelete, italics = false }) => {
  const itemClass = 'flashcard-template-list-item'
  const textClass = italics
    ? 'flashcard-template-list-text italics'
    : 'flashcard-template-list-text'

  return (
    <>
      {values.map((value, index) => (
        /* eslint-disable-next-line */
        <li key={`${value}-${index}`} className={itemClass}>
          <div className="space-between align-center">
            <span className={textClass} dangerouslySetInnerHTML={sanitizeHtml(value)} />
            <CloseIcon
              sx={{ color: 'grey', textShadow: 'none', cursor: 'pointer', marginRight: 0 }}
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
