import React from 'react'
import { updateEnableRecmd } from 'Utilities/redux/userReducer'
import { clearNewVocabulary } from 'Utilities/redux/newVocabularyReducer'
import { useHistory, Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Modal } from 'semantic-ui-react'
import { Form } from 'react-bootstrap'

const RecommendationsModal = ({ open, setOpen }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const storyCompleted = history.location.pathname.includes('practice')
  const { id: storyId } = useParams()
  const { newVocabulary } = useSelector(({ newVocabulary }) => newVocabulary)
  const { pending } = useSelector(({ user }) => user)
  const { enable_recmd } = useSelector(({ user }) => user.data.user)

  const closeModal = () => {
    dispatch(clearNewVocabulary())
    setOpen(false)
  }

  const updatePreferences = () => {
    dispatch(updateEnableRecmd(!enable_recmd))
  }

  return (
    <Modal
      basic
      open={open}
      size="tiny"
      centered={false}
      dimmer="blurring"
      closeIcon={{ style: { top: '2.5rem', right: '2.5rem' }, color: 'black', name: 'close' }}
      onClose={closeModal}
    >
      <Modal.Content>
        <div className="encouragement" style={{ padding: '1.5rem', color: '#000000' }}>
          {storyCompleted && newVocabulary > 0 && (
            <div style={{ marginBottom: '.5em', marginTop: '.5em' }}>
              <FormattedHTMLMessage
                id="story-completed-to-blue-flashcards"
                values={{ nWords: newVocabulary }}
              />
              &nbsp;
              <Link to={`/flashcards/fillin/${storyId}`}>
                <FormattedMessage id="go-to-blue-flashcards" />
              </Link>
            </div>
          )}
          <div className="flex">
            <FormattedMessage id="never-show-recommendations" />
            <Form.Group>
              <Form.Check
                style={{ marginLeft: '.5em', marginTop: '.25em' }}
                type="checkbox"
                inline
                onChange={updatePreferences}
                checked={!enable_recmd}
                disabled={pending}
              />
            </Form.Group>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default RecommendationsModal
