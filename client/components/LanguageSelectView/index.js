import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Container, Segment, Loader, Dimmer } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import {
  images,
  capitalize,
  supportedLearningLanguages,
  dictionaryLanguageSelector,
  hiddenFeatures,
  translatableLanguages,
  betaLanguages,
} from 'Utilities/common'
import {
  updateLearningLanguage,
  updateDictionaryLanguage,
  resetLearningLanguageChanged,
} from 'Utilities/redux/userReducer'
import InterfaceLanguageView from './InterfaceLanguageView'

const LanguageGroup = ({ languages, handleLearningLanguageChange }) => (
  <div className="language-group">
    {languages.map(lang => (
      <div
        key={lang}
        role="button"
        tabIndex={0}
        onClick={() => handleLearningLanguageChange(lang)}
        onKeyPress={() => handleLearningLanguageChange(lang)}
        className="language"
      >
        <img
          src={images[`flag${capitalize(lang.split('-').join(''))}`]}
          className="language-image"
          alt={lang}
        />
        <span className="language-name">
          <FormattedMessage
            id={lang
              .split('-')
              .map(l => capitalize(l))
              .join('-')}
          />
          {betaLanguages.includes(lang) && (
            <sup>
              <b>&beta;</b>
            </sup>
          )}
        </span>
      </div>
    ))}
  </div>
)

const LearningLanguageSelectView = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const user = useSelector(({ user }) => user)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { pending, learningLanguageChanged } = user

  const [showInterfaceModal, setShowInterfaceModal] = useState(false)

  useEffect(() => {
    if (!user.data.user?.interfaceLanguage) {
      setShowInterfaceModal(true)  
    } else {
      setShowInterfaceModal(false)
    }
  }, [user])

  useEffect(() => {
    if (learningLanguageChanged) {
      history.push('/home') 
      dispatch(resetLearningLanguageChanged())
    }
  }, [learningLanguageChanged])

  const checkForTranslatableLanguages = lang => {
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

  const handleLearningLanguageChange = lang => {
    checkForTranslatableLanguages(capitalize(lang))
    dispatch(updateLearningLanguage(lang))
  }

  return (
    <Container textAlign="center">
      <Dimmer active={pending}>
        <Loader />
      </Dimmer>
      <div className="header-2 mt-lg bold" data-cy="choose-lang">
        <FormattedMessage id="what-language-would-you-like-to-learn" />
      </div>
      <Segment>
        <LanguageGroup
          languages={supportedLearningLanguages.major}
          handleLearningLanguageChange={handleLearningLanguageChange}
        />
        <hr />
        <LanguageGroup
          languages={supportedLearningLanguages.majorBeta}
          handleLearningLanguageChange={handleLearningLanguageChange}
        />
        <hr />
        <LanguageGroup
          languages={supportedLearningLanguages.minor}
          handleLearningLanguageChange={handleLearningLanguageChange}
        />
        {hiddenFeatures && (
          <div>
            <hr />
            <LanguageGroup
              languages={supportedLearningLanguages.experimental}
              handleLearningLanguageChange={handleLearningLanguageChange}
            />
          </div>
        )}
      </Segment>

      {/* Interface Language View */}
      {showInterfaceModal && <InterfaceLanguageView setShowLangModal={setShowInterfaceModal} showInterfaceModal={showInterfaceModal} />}
    </Container>
  )
}

export default LearningLanguageSelectView
