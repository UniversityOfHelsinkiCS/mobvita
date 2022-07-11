import React, { useEffect, useState } from 'react'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { Modal, Popup, Icon } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { updateEnableRecmd } from 'Utilities/redux/userReducer'
import { Link, useHistory } from 'react-router-dom'
import { Form } from 'react-bootstrap'

const FlashcardsEncouragement = ({ open, setOpen, allCorrect, enable_recmd }) => {
  const history = useHistory()
  const intl = useIntl()
  const dispatch = useDispatch()
  const [upperBound, setUpperBound] = useState(3)
  const [recmdList, setRecmdList] = useState([])
  const blueFlashcards = history.location.pathname.includes('fillin')
  const { pending } = useSelector(({ user }) => user)

  console.log(history.location.pathname)

  const fillList = () => {
    let initList = []

    if (blueFlashcards) {
      if (allCorrect) {
        initList = initList.concat(
          <div className="pt-lg">
            <FormattedHTMLMessage id="all-correct-flashcards" />
            &nbsp;
            <Link to="/profile/progress">
              <FormattedMessage id="review-progress" />
            </Link>
            ?
          </div>
        )
      } else {
        initList = initList.concat(
          <div className="pt-lg">
            <FormattedHTMLMessage id="some-incorrect-flashcards" />
            &nbsp;
            <Link to={`${history.location.pathname}-retry`}>
              <FormattedMessage id="flashcards-try-again" />
            </Link>
            ?
          </div>
        )
      }
    }

    return initList
  }

  const closeModal = () => {
    setOpen(false)
  }

  useEffect(() => {
    setRecmdList(fillList())
  }, [allCorrect])

  const updatePreferences = () => {
    dispatch(updateEnableRecmd(!enable_recmd))
  }

  return (
    <Modal
      basic
      open={open}
      size="small"
      centered={false}
      dimmer="blurring"
      closeIcon={{ style: { top: '2.5rem', right: '2.5rem' }, color: 'black', name: 'close' }}
      onClose={closeModal}
    >
      <Modal.Content>
        <div className="encouragement" style={{ padding: '1.5rem', color: '#000000' }}>
          {recmdList.map((recommendation, index) => index < upperBound && recommendation)}
          <div className="flex pt-lg">
            <Form.Group>
              <Form.Check
                style={{ marginTop: '0.15em' }}
                type="checkbox"
                inline
                onChange={updatePreferences}
                checked={!enable_recmd}
                disabled={pending}
              />
            </Form.Group>
            <span style={{ color: '#708090' }}>
              <FormattedMessage id="never-show-recommendations" />
            </span>
            <Popup
              content={intl.formatMessage({ id: 'disable-recmd-tooltip' })}
              trigger={<Icon style={{ marginLeft: '0.5em' }} name="info circle" color="grey" />}
            />
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default FlashcardsEncouragement
