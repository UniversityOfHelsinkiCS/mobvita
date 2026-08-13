import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { Skeleton } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckIcon from '@mui/icons-material/Check';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';
import CustomTooltip from 'Components/CustomTooltip';

import {
  useLearningLanguage,
  getTextStyle,
  images,
} from 'Utilities/common';
import { Speaker } from './dictComponents';
import './Lemma.scss';

// Mirrors the `.translation-lemma-card .right-column i.icon` rules in Lemma.scss, which used to
// style the semantic-ui <i class="icon"> elements these MUI icons replaced.
const rightColumnIconSx = {
  fontSize: '1.25rem',
  color: '#000000',
  cursor: 'pointer',
  transition: 'color 0.2s ease, transform 0.2s ease',
  '&:hover': { color: '#2563eb', transform: 'scale(1.1)' },
};

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
          <Skeleton variant="text" />
        </div>
      ) : (
        <CustomTooltip title={<FormattedHTMLMessage id="explain-lemma-goto-dictionary" />}>
          <a
            href={userUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lemma-word"
            data-cy="lemma-dictionary-link"
          >
            {lemma}
          </a>
        </CustomTooltip>
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
            <CustomTooltip title={<FormattedHTMLMessage id="explain-goto-inflection-table" />}>
              <a
                href={inflectionRef.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '1rem', color: 'inherit' }}
                data-cy="lemma-inflection-link"
              >
                <OpenInNewIcon style={{ fontSize: 18 }} />
              </a>
            </CustomTooltip>
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
              <CustomTooltip
                title={<FormattedHTMLMessage id="explain-i-know-word" />}
                placement="top"
              >
                <span style={{ display: 'inline-flex' }}>
                  <CheckIcon
                    onClick={handleKnowningClick}
                    sx={rightColumnIconSx}
                    data-cy="lemma-know-word-button"
                  />
                </span>
              </CustomTooltip>
              <CustomTooltip
                title={<FormattedHTMLMessage id="explain-i-dont-know-word" />}
                placement="top"
              >
                <span style={{ display: 'inline-flex' }}>
                  <HelpOutlinedIcon
                    onClick={handleNotKnowningClick}
                    sx={rightColumnIconSx}
                    data-cy="lemma-dont-know-word-button"
                  />
                </span>
              </CustomTooltip>
            </>
          )}
          
          {/* Word Nest Button */}
          {handleWordNestClick && (
            <CustomTooltip
              title={<FormattedMessage id="display-word-nest" defaultMessage="Word Nest" />}
              placement="top"
            >
              <button
                type="button"
                className="wordnest-icon-button"
                aria-label="Word Nest"
                onClick={handleWordNestClick}
                data-cy="lemma-word-nest-button"
              >
                <img src={images.network} alt="word nest" width="28" />
              </button>
            </CustomTooltip>
          )}
        </div>
      )}
    </div>
  );
};

export default Lemma;
