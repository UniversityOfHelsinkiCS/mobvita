import React from 'react'
import { useSelector } from 'react-redux'
import { Icon, Popup } from 'semantic-ui-react'
import {  FormattedHTMLMessage } from 'react-intl'
import {
  useLearningLanguage,
  getTextStyle,
} from 'Utilities/common'
import { Speaker } from './dictComponents'

const Lemma = ({
    lemma,
    sourceWord,
    handleSourceWordClick,
    handleKnowningClick,
    handleNotKnowningClick,
    userUrl,
    inflectionRef,
    preferred,
  }) => {
    const learningLanguage = useLearningLanguage()
    const { maskSymbol } = useSelector(({ translation }) => translation)
  
    return (
      <div className="flex space-between" style={getTextStyle(learningLanguage)}>
        <div className="flex">
          <Speaker word={lemma} />
          {maskSymbol || (
            <a href={userUrl} target="_blank" rel="noopener noreferrer">
              {lemma}
            </a>
          )}
          {inflectionRef && (
            <a href={inflectionRef.url} target="_blank" rel="noopener noreferrer" className="flex">
              <Icon name="external" style={{ marginLeft: '1rem' }} />
            </a>
          )}
        </div>
        {preferred && (
          <div className="flex-col" style={{ alignItems: 'center' }}>
            <Popup
              position="top center"
              content={<FormattedHTMLMessage id="i-know-tooltip" />}
              trigger={
                <Icon
                  name="check"
                  onClick={handleKnowningClick}
                  style={{ cursor: 'pointer', marginLeft: '2em' }}
                />
              }
            />
            <Popup
              position="top center"
              content={<FormattedHTMLMessage id="i-dont-know-tooltip" />}
              trigger={
                <Icon
                  name="question"
                  onClick={handleNotKnowningClick}
                  style={{ cursor: 'pointer', marginLeft: '2em', marginTop: '.75em' }}
                />
              }
            />
          </div>
        )}
      </div>
    )
}

export default Lemma