import React from 'react'
import { useDispatch } from 'react-redux'
import { Icon, Popup } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { setFocusedWord, setHighlightedWord } from 'Utilities/redux/annotationsReducer'

const AnnotationList = ({ handleAnnotationBoxCollapse, annotations, highlightedWord }) => {
  const intl = useIntl()
  const dispatch = useDispatch()

  const filterOutWordsWithOnlyRemovedAnnotations = annotations => {
    return annotations.filter(
      w => w.annotation[0].annotation !== '<removed>' && w.annotation[0].length !== 1
    )
  }

  return (
    <div>
      <div
        className="space-between"
        onClick={handleAnnotationBoxCollapse}
        onKeyDown={handleAnnotationBoxCollapse}
        role="button"
        tabIndex={0}
      >
        <div>
          <div className="header-3">
            <FormattedMessage id="notes" />{' '}
            <Popup
              position="top center"
              content={intl.formatMessage({ id: 'notes-popup-info-text' })}
              trigger={<Icon name="info circle" size="small" />}
            />
          </div>
        </div>
        <Icon name="angle up" size="large" />
      </div>
      <div style={{ marginTop: '1em' }}>
        {filterOutWordsWithOnlyRemovedAnnotations(annotations).map((word, index) => (
          <div>
            {index + 1} -{' '}
            <span
              onClick={() => dispatch(setFocusedWord(word))}
              onMouseOver={() => dispatch(setHighlightedWord(word))}
              onFocus={() => dispatch(setHighlightedWord(word))}
              onKeyDown={() => dispatch(setFocusedWord(word))}
              role="button"
              tabIndex={0}
              className={word?.ID === highlightedWord?.ID ? 'notes-highlighted-word' : ''}
            >
              {word.surface}
            </span>
          </div>
        ))}
      </div>
      {highlightedWord && (
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={() => dispatch(setHighlightedWord(null))}
          style={{ marginTop: '1em' }}
        >
          <FormattedMessage id="cancel-highlighting" />
        </Button>
      )}
    </div>
  )
}

export default AnnotationList
