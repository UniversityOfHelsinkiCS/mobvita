import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import CustomTooltip from 'Components/CustomTooltip'
import AppButton from 'Components/AppButton'
import { FormattedMessage, useIntl } from 'react-intl';
import { setFocusedSpan, setHighlightRange } from 'Utilities/redux/annotationsReducer'

const ListView = ({ handleAnnotationBoxCollapse }) => {
  const intl = useIntl()
  const dispatch = useDispatch()

  const { spanAnnotations, highlightRange } = useSelector(({ annotations }) => annotations)

  const wordShouldBeHighlighted = span => {
    return span.startId === highlightRange?.start && span.endId === highlightRange?.end
  }

  return (
    <div>
      <div
        className="space-between"
        data-cy="annotation-list-collapse-toggle"
        onClick={handleAnnotationBoxCollapse}
        onKeyDown={handleAnnotationBoxCollapse}
        role="button"
        tabIndex={0}
      >
        <div>
          <div className="header-3" style={{ fontWeight: '500' }}>
            <CustomTooltip permanent placement="top" keyId="annotations-popup-info-text">
              <InfoOutlinedIcon fontSize="small" sx={{ color: 'grey' }} />
            </CustomTooltip>{' '}
            <FormattedMessage id="notes-header" />
          </div>
        </div>
        <KeyboardArrowUpIcon fontSize="large" />
      </div>
      <div style={{ marginTop: '1em' }}>
        {spanAnnotations.map((span, index) => (
          <div
            key={`${span.startId}-${span.endId}`}
            style={{
              marginBottom: '.5em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <b>{index + 1}</b> -{' '}
            <span
              onClick={() => dispatch(setFocusedSpan(span))}
              onMouseOver={() => dispatch(setHighlightRange(span.startId, span.endId))}
              onFocus={() => dispatch(setHighlightRange(span.startId, span.endId))}
              onKeyDown={() => dispatch(setFocusedSpan(span))}
              role="button"
              tabIndex={0}
              className={wordShouldBeHighlighted(span) ? 'notes-highlighted-word' : ''}
              data-cy={`${span.startId}-${span.annotationString}`}
            >
              {span.annotationString}
            </span>
          </div>
        ))}
      </div>
      {highlightRange?.start !== null && (
        <AppButton
          size="sm"
          variant="outline-secondary"
          data-cy="annotation-list-cancel-highlighting"
          onClick={() => dispatch(setHighlightRange(null, null))}
          style={{ marginTop: '1em' }}
        >
          <FormattedMessage id="cancel-highlighting" />
        </AppButton>
      )}
    </div>
  )
}

export default ListView
