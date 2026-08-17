import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import AppButton from 'Components/AppButton'
import useWindowDimensions from 'Utilities/windowDimensions'
import { FormattedMessage, useIntl } from 'react-intl'
import AnswerAnnotationForm from './AnswerAnnotationForm'

const AnnotationTexts = ({
  handleEditButtonClick,
  handleCreateAnnotationButtonClick,
  showAnnotationForm,
  showCreateNoteButton,
  setOpenWarning,
  setThreadId,
}) => {
  const intl = useIntl()
  const user = useSelector(({ user }) => user.data.user)
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

  const handleDeleteButtonClick = deletedId => {
    setThreadId(deletedId)
    setOpenWarning(true)
  }

  return (
    <div>
      {focusedSpan?.annotationTexts.map((a, index) => (
        // console.log(a),
        <div
          key={a.uid}
          className={`annotation-item ${
            showAnnotationForm && a.uid === user.oid
              ? `annotation-item-editing${index > 0 && '-reply'}`
              : `annotation-item-listed${index > 0 && '-reply'}`
          }`}
        >
          <>
            <div className="space-between" style={{ marginBottom: '1em' }}>
              {displayAuthorInfo(a)}
              {a.uid === user.oid && bigScreen && (
                <div>
                  <AppButton
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => handleEditButtonClick(a.text, a.name, a.thread_id)}
                    style={{ marginRight: '1em' }}
                    data-cy="edit-annotation-button"
                  >
                    <EditIcon />
                    <FormattedMessage id="edit" />
                  </AppButton>
                  <AppButton
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDeleteButtonClick(a.thread_id)}
                    data-cy="delete-annotation-button"
                  >
                    <DeleteOutlinedIcon />
                    <FormattedMessage id="Delete" />
                  </AppButton>
                </div>
              )}
            </div>
            <div className="annotation-text-content">{a.text}</div>
          </>
          {index < focusedSpan.annotationTexts.length - 1 && <hr />}
        </div>
      ))}
      <>
        <AppButton
          style={{ marginTop: '.75em' }}
          size="sm"
          onClick={() => setShowAnswerForm(!showAnswerForm)}
          data-cy="reply-annotation-button"
        >
          <FormattedMessage id={showAnswerForm ? 'Cancel' : 'reply-note'} />
        </AppButton>
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
