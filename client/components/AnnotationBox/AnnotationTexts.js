import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import useWindowDimensions from 'Utilities/windowDimensions'
import { FormattedMessage, useIntl } from 'react-intl'
import AnswerAnnotationForm from './AnswerAnnotationForm'

const AnnotationTexts = ({
  handleEditButtonClick,
  handleCreateAnnotationButtonClick,
  showAnnotationForm,
  showCreateNoteButton,
  setOpenWarning,
}) => {
  const intl = useIntl()
  const { user } = useSelector(({ user }) => ({ user: user.data.user }))
  const { focusedSpan, spanAnnotations } = useSelector(({ annotations }) => annotations)
  const [showAnswerForm, setShowAnswerForm] = useState(false)
  const { width } = useWindowDimensions()
  const bigScreen = width >= 1024

  const displayAuthorInfo = annotation => {
    return (
      <div>
        {annotation.uid === user.oid ? (
          <div>
            <span style={{ fontWeight: '500' }}>{intl.formatMessage({ id: 'you' })}</span>{' '}
            {intl.formatMessage({ id: '(you)wrote' })}:
          </div>
        ) : (
          <div>
            <span style={{ fontWeight: '500' }}>{annotation.username}</span>{' '}
            {intl.formatMessage({ id: '(he/she)wrote' })}:
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {focusedSpan?.annotationTexts.map(a => (
        // console.log(a),
        <div
          key={a.uid}
          className={`annotation-item ${
            showAnnotationForm && a.uid === user.oid
              ? 'annotation-item-editing'
              : 'annotation-item-listed'
          }
                `}
        >
          <>
            <div className="space-between" style={{ marginBottom: '1em' }}>
              {displayAuthorInfo(a)}
              {a.uid === user.oid && bigScreen && (
                <div>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => handleEditButtonClick(a.text, a.name)}
                    style={{ marginRight: '1em' }}
                  >
                    <Icon name="pencil alternate" />
                    <FormattedMessage id="edit" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => setOpenWarning(true)}
                    data-cy="delete-annotation-button"
                  >
                    <Icon name="trash alternate" />
                    <FormattedMessage id="Delete" />
                  </Button>
                </div>
              )}
            </div>
            <div className="annotation-text-content">{a.text}</div>
          </>
        </div>
      ))}
      <>
        <Button
          style={{ marginTop: '.75em' }}
          size="sm"
          onClick={() => setShowAnswerForm(!showAnswerForm)}
        >
          <FormattedMessage id={showAnswerForm ? 'Cancel' : 'reply-note'} />
        </Button>
        {showAnswerForm && (
          <AnswerAnnotationForm
            focusedSpan={focusedSpan}
            spanAnnotations={spanAnnotations}
            setShowAnswerForm={setShowAnswerForm}
          />
        )}
      </>
    </div>
  )
}

export default AnnotationTexts
