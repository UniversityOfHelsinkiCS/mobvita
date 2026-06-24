import React, { useState, useEffect } from 'react'
import { Modal, Form, TextArea, Checkbox } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { consistsOfOnlyWhitespace } from 'Utilities/common'
import Spinner from 'Components/Spinner'

const NoteFormModal = ({ open, onClose, onSubmit, initialText = '', initialPublic = false, isEdit = false, loading = false, canMakePublic = false }) => {
  const intl = useIntl()
  const maxCharacters = 1000
  const [text, setText] = useState(initialText)
  const [isPublic, setIsPublic] = useState(initialPublic)

  useEffect(() => {
    if (open) {
      setText(initialText)
      setIsPublic(initialPublic)
    }
  }, [open, initialText, initialPublic])

  const saveDisabled = text?.length < 1 || consistsOfOnlyWhitespace(text)

  const handleSave = () => {
    if (saveDisabled || loading) return
    onSubmit(text.trim(), canMakePublic ? isPublic : false)
  }

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  return (
    <Modal
      dimmer="inverted"
      closeIcon={{ style: { top: '1.0535rem', right: '1rem' }, color: 'black', name: 'close' }}
      open={open}
      onClose={handleClose}
    >
      <Modal.Header className="bold" as="h2">
        <FormattedMessage
          id={isEdit ? 'edit-note' : 'create-a-note'}
          defaultMessage={isEdit ? 'Edit note' : 'Add a note'}
        />
      </Modal.Header>
      <Modal.Content>
        <Form>
          <TextArea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={intl.formatMessage({ id: 'write-your-note-here' })}
            maxLength={maxCharacters}
            style={{ marginTop: 0, minHeight: '10em', marginBottom: '.5rem' }}
            autoFocus
            data-cy="note-text-field"
          />
          {canMakePublic && (
            <div style={{ marginTop: '.25rem', marginBottom: '.75rem' }}>
              <Checkbox
                label={intl.formatMessage({ id: 'public-note-checkbox' })}
                checked={isPublic}
                onChange={() => setIsPublic(prev => !prev)}
                data-cy="note-public-checkbox"
              />
            </div>
          )}
        </Form>
        <Button variant="outline-secondary" size="sm" onClick={handleClose} disabled={loading}>
          <FormattedMessage id="Cancel" />
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          style={{ marginLeft: '1em', minWidth: '4.5em' }}
          disabled={saveDisabled || loading}
          data-cy="save-note-button"
        >
          {loading ? <Spinner inline /> : <FormattedMessage id="Save" />}
        </Button>
      </Modal.Content>
    </Modal>
  )
}

export default NoteFormModal
