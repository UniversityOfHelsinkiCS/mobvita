import React from 'react'
import { useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import useWindowDimensions from 'Utilities/windowDimensions'
import { FormattedMessage, useIntl } from 'react-intl'

const AnnotationTexts = ({
  handleEditButtonClick,
  handleCreateAnnotationButtonClick,
  showAnnotationForm,
  showCreateNoteButton,
  handleAnnotationDelete,
}) => {
  const intl = useIntl()
  const { user } = useSelector(({ user }) => ({ user: user.data.user }))
  const { focusedSpan } = useSelector(({ annotations }) => annotations)

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
        <div
          key={a.uid}
          className={`annotation-item ${
            showAnnotationForm && a.uid === user.oid
              ? 'annotation-item-editing'
              : 'annotation-item-listed'
          }
                `}
        >
          {a.uid === user.oid && showAnnotationForm ? (
            <div className="bold">
              <FormattedMessage id="edit-your-note" />:
            </div>
          ) : (
            <>
              <div className="space-between" style={{ marginBottom: '1em' }}>
                {displayAuthorInfo(a)}

                {a.uid === user.oid && bigScreen && (
                  <div>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => handleEditButtonClick(a.text)}
                      style={{ marginRight: '1em' }}
                    >
                      <Icon name="pencil alternate" />
                      <FormattedMessage id="edit" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={handleAnnotationDelete}
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
          )}
        </div>
      ))}
      {showCreateNoteButton && (
        <Button
          style={{ marginTop: '.75em' }}
          size="sm"
          onClick={handleCreateAnnotationButtonClick}
          data-cy="create-annotation-button"
        >
          <FormattedMessage id="create-a-note" />
        </Button>
      )}
    </div>
  )
}

export default AnnotationTexts
