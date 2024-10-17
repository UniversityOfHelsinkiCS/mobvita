import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Dropdown, Input } from 'semantic-ui-react'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { Button } from 'react-bootstrap'
import { importStoriesFromGroup } from 'Utilities/redux/groupsReducer'
import { getAllStories } from 'Utilities/redux/storiesReducer'

const ImportStoryModal = ({ open, setOpen, groupId }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const { groups, pending, storyImported } = useSelector(({ groups }) => groups)
  const [selectedGroups, setSelectedGroups] = useState([])
  const [message, setMessage] = useState('')
  const group = groups.find(group => group.group_id === groupId)
  const { groupName } = group

  const options = groups.filter(group => group.group_id !== groupId).map(
    group => ({key: group.group_id, text: group.groupName, value: group.group_id}))
  const submitGroupImport = async () => {
    // console.log(selectedGroups)
    // console.log(message)
    await dispatch(importStoriesFromGroup(groupId, selectedGroups, message))
    dispatch(
      getAllStories(learningLanguage, {
        sort_by: 'date',
        order: -1,
      })
    )
    setOpen(false)
    setSelectedGroups([])
    setMessage('')
  }

  return (
    <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}>
      <Modal.Header>
        <FormattedMessage id="import-story" /> : {groupName}
      </Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column', height: '260px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: '550' }}>
          <FormattedMessage id="import-story-label" />
        </h2>
        <FormattedHTMLMessage id="import-story-description" />
        <Dropdown 
          placeholder={intl.formatMessage({id: 'import-from'})} 
          fluid multiple selection 
          options={options}
          onChange={(e, { value }) => setSelectedGroups(value)}
          style={{ marginTop: '1em' }}
        />
        <span style={{marginTop: '1em'}}>
            <label style={{marginRight: '2em', fontWeight: 'bold'}}><FormattedMessage id="import-story-message" /></label>
            <Input type="text" onChange={(e)=> setMessage(e.target.value)} />
        </span>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={submitGroupImport} disabled={selectedGroups.length === 0}>
            <FormattedMessage id="import" />
        </Button>
        <Button
          style={{ marginLeft: '1em' }}
          onClick={() => {
            setOpen(false)
          }}
          variant="secondary"
        >
          <FormattedMessage id="cancel" />
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default ImportStoryModal