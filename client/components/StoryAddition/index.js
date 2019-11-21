import React, { useState, useEffect, Fragment } from 'react'
import { Modal, Button, Input } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import isUrl from 'is-url'
import { capitalize } from 'Utilities/common'

import { postStory } from 'Utilities/redux/storiesReducer'

const StoryAddition = () => {
  const [url, setURL] = useState('')
  const [language, setLanguage] = useState('')
  const [modalOpen, setModal] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    const currentLanguage = window.location.pathname.split('/')[2]
    setLanguage(capitalize(currentLanguage))
  }, [])

  const handleSave = () => {
    const newStory = {
      url,
      language
    }
    setModal(false)
    dispatch(postStory(newStory))
  }

  return (
    <Fragment>
      <Button fluid onClick={() => setModal(true)}> add new story </Button>
      <Modal open={modalOpen} onClose={() => setModal(false)} style={{ maxHeight: '20em' }}>
        <Modal.Header>
          Add new story
      </Modal.Header>
        <Input label={'new story url'} fluid onChange={e => setURL(e.target.value)} style={{padding:'10px'}}/>
        <Modal.Actions>
          <Button onClick={() => setModal(false)}>cancel</Button>
          <Button positive disabled={!isUrl(url)} onClick={handleSave}>add story</Button>
        </Modal.Actions>
      </Modal>
    </Fragment>
  )
}

export default StoryAddition