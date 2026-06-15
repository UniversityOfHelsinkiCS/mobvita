import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { Icon, Popup, Placeholder, PlaceholderLine } from 'semantic-ui-react';

import {
  useLearningLanguage,
  getTextStyle,
} from 'Utilities/common';
import { Speaker } from './dictComponents';

const Lemma = ({
  lemma,
  sourceWord,
  handleSourceWordClick,
  handleKnowningClick,
  handleNotKnowningClick,
  handleWordNestClick, // Handles the Word Nest click
  userUrl,
  inflectionRef,
  preferred,
  translations, // Array of translation words
  style, // Added: Accepts custom styles (like background color)
  className, // Added: Accepts custom classes
  showInflactionLink = true
}) => {
  const learningLanguage = useLearningLanguage();
  const { maskSymbol, pending } = useSelector(({ translation }) => translation);

  const title = (
    <>
      {pending ? (
        <div style={{ height: '10px', width: '80px' }}>
          <Placeholder>
            <PlaceholderLine />
          </Placeholder>
        </div>
      ) : (
        <Popup
          content={<FormattedHTMLMessage id="explain-lemma-goto-dictionary" />}
          trigger={
            <a href={userUrl} target="_blank" rel="noopener noreferrer" className="lemma-word">
              {lemma}
            </a>
          }
        />
      )}
    </>
  );

  return (
    // Merging custom classes and styles with the base layout
    <div 
      className={`translation-lemma-card ${className || ''}`} 
      style={{ ...getTextStyle(learningLanguage), ...style }}
    >
      {/* First Column (Left) */}
      <div className="card-column left-column">
        {/* Top Row: Speaker, Word, Inflection Icon */}
        <div className="card-row top-row">
          <Speaker word={lemma} />
          {maskSymbol || title}
          {showInflactionLink && inflectionRef && (
            <Popup 
              content={<FormattedHTMLMessage id="explain-goto-inflection-table" />}
              trigger={(
                <a href={inflectionRef.url} target="_blank" rel="noopener noreferrer" style={{ display: 'contents' }}>
                  <Icon name="external" style={{ marginLeft: '1rem' }} />
                </a>
              )} 
            />
          )}
        </div>
        
        {/* Bottom Row: Translations List */}
        <div className="card-row bottom-row">
          {translations && translations.length > 0 && (
            <ul className="translation-glosses">
              {translations.map((translation, index) => (
                <li key={index}>{translation}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Second Column (Right) */}
      {(preferred || handleWordNestClick) && (
        <div className="card-column right-column">
          {preferred && (
            <>
              <Popup
                position="top center"
                content={<FormattedHTMLMessage id="explain-i-know-word" />}
                trigger={
                  <Icon
                    name="check"
                    onClick={handleKnowningClick}
                    style={{ cursor: 'pointer' }}
                  />
                }
              />
              <Popup
                position="top center"
                content={<FormattedHTMLMessage id="explain-i-dont-know-word" />}
                trigger={
                  <Icon
                    name="question"
                    onClick={handleNotKnowningClick}
                    style={{ cursor: 'pointer' }}
                  />
                }
              />
            </>
          )}
          
          {/* Word Nest Button */}
          {handleWordNestClick && (
            <Popup
              position="top center"
              content={<FormattedMessage id="display-word-nest" defaultMessage="Word Nest" />}
              trigger={
                <button
                  type="button"
                  className="wordnest-icon-button"
                  aria-label="Word Nest"
                  onClick={handleWordNestClick}
                >
                  <img src="/client/assets/images/network.svg" alt="word nest" width="28" />
                </button>
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Lemma;
