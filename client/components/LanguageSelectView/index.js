import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Container, Segment } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import {
  images,
  capitalize,
  supportedLearningLanguages,
  learningLanguageSelector,
  dictionaryLanguageSelector,
  hiddenFeatures,
  translatableLanguages,
} from 'Utilities/common'
import { updateLearningLanguage, updateDictionaryLanguage } from 'Utilities/redux/userReducer'
import { useDispatch, useSelector } from 'react-redux'

const LanguageGroup = ({ languages, handleLearningLanguageChange }) => {
  return (
    <div className="language-group">
      {languages.map(lang => (
        <div key={lang} onClick={() => handleLearningLanguageChange(lang)} className="language">
          <img
            src={images[`flag${capitalize(lang.split('-').join(''))}`]}
            className="language-image"
            alt={lang}
          />
          <span className="language-name">
            <FormattedMessage id={lang.split('-').map(l => capitalize(l)).join('-')} />
          </span>
        </div>
      ))}
    </div>
  )
}

const LearningLanguageSelectView = () => {
  const dispatch = useDispatch()

  const user = useSelector(({ user }) => user)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { pending } = user

  const [learningLanguageChanged, setLearningLanguageChanged] = useState(false)
  const [waiting, setWaiting] = useState(false)

  useEffect(() => {
    if (!pending && waiting && learningLanguage) {
      setLearningLanguageChanged(true)
      setWaiting(false)
    }
  }, [pending])

  const checkForTranslatableLanguages = (lang) => {
    if (!translatableLanguages[lang]) {
      dispatch(updateDictionaryLanguage('English'))
      return
    }
    if (translatableLanguages[lang].includes(dictionaryLanguage)) return
    if (translatableLanguages[lang].includes('English')) {
      dispatch(updateDictionaryLanguage('English'))
      return
    }
    if (translatableLanguages[lang].includes('Russian')) {
      dispatch(updateDictionaryLanguage('Russian'))
      return
    }
    if (translatableLanguages[lang].length > 0) {
      dispatch(updateDictionaryLanguage(translatableLanguages[lang][0]))
    }
  }

  const handleLearningLanguageChange = (lang) => {
    checkForTranslatableLanguages(capitalize(lang))
    dispatch(updateLearningLanguage(lang))
    setWaiting(true)
  }

  if (learningLanguageChanged) {
    return (
      <Redirect
        to={{
          pathname: '/home',
          state: { from: '/languageSelectView' },
        }}
      />
    )
  }


  return (
    <Container textAlign="center">
      <h2 data-cy="choose-lang">
        <FormattedMessage id="Learning-language" />
      </h2>
      <Segment>
        <LanguageGroup
          languages={supportedLearningLanguages.major}
          handleLearningLanguageChange={handleLearningLanguageChange}
        />
        <hr />
        <LanguageGroup
          languages={supportedLearningLanguages.minor}
          handleLearningLanguageChange={handleLearningLanguageChange}
        />
        {hiddenFeatures
          && (
            <div>
              <hr />
              <LanguageGroup
                languages={supportedLearningLanguages.experimental}
                handleLearningLanguageChange={handleLearningLanguageChange}
              />
            </div>
          )}
      </Segment>
    </Container>
  )
}
export default LearningLanguageSelectView
