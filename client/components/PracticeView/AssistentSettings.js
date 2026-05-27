import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { Popup } from 'semantic-ui-react'
import SettingsIcon from 'Components/PracticeView/SettingsIcon'
import { updateDictionaryLanguage } from 'Utilities/redux/userReducer'
import { getTranslationAction } from 'Utilities/redux/translationReducer'
import { useLearningLanguage, translatableLanguages } from 'Utilities/common'

const AssistentSettings = ({ className = '' }) => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const intl = useIntl()
  const learningLanguage = useLearningLanguage()

  // Safe optional chaining for Redux state
  const translationLanguageCode = useSelector(
    ({ user }) => user?.data?.user?.last_trans_language || 'English'
  )
  const translation = useSelector(({ translation }) => translation.data)

  const dictionaryOptions = translatableLanguages[learningLanguage]
    ? translatableLanguages[learningLanguage].map(element => ({
        key: element,
        value: element,
        text: intl.formatMessage({ id: element }),
      }))
    : []

  const handleDropdownChange = (value) => {
    if (translation) {
      const lemmas = translation?.map(t => t?.lemma).join('+')
      if (lemmas !== '') {
        dispatch(getTranslationAction({ learningLanguage, dictionaryLanguage: value, wordLemmas: lemmas }))
      }
    }
    dispatch(updateDictionaryLanguage(value))
    setOpen(false) // Close popup after selection
  }

  const popupContent = (
    <div style={{ padding: '0.5em 1em', minWidth: '180px' }}>
      {dictionaryOptions.length > 0 ? (
        <>
          <div style={{ fontWeight: 'bold', marginBottom: '0.5em', color: '#555' }}>
            <FormattedMessage id="select-dictionary-language"  />
          </div>
          <select
            disabled={dictionaryOptions.length <= 1}
            value={translationLanguageCode}
            data-cy="dictionary-dropdown"
            style={{
              width: '100%',
              padding: '0.4em 0.6em',
              border: '1px solid #ccc',
              borderRadius: '10px',
              backgroundColor: 'white',
              color: '#333',
              fontSize: '0.9rem',
              cursor: dictionaryOptions.length <= 1 ? 'not-allowed' : 'pointer',
            }}
            onChange={(e) => handleDropdownChange(e.target.value)}
            onClick={(e) => e.stopPropagation()} // Prevent popup from closing on dropdown click
          >
            {dictionaryOptions.map(option => (
              <option key={option.key} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        </>
      ) : (
        <div style={{ color: '#888', fontSize: '0.9rem' }}>
          No dictionary languages available
        </div>
      )}
    </div>
  )

  return (
    <Popup
      open={open}
      on="click" 
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}      
      trigger={
                <span 
          data-cy="ai-assistant-settings-popup"
          style={{ display: 'inline-block', cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setOpen(prev => !prev)
            }
          }}
        >
          <SettingsIcon className={className} />
        </span>

      }
      content={popupContent}
      position="bottom right"
      basic
      flowing
      hideOnScroll      
      style={{  borderRadius: '10px', padding: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}
    />
  )
}

export default AssistentSettings