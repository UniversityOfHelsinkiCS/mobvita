import React from 'react'
import { Header, Image, Modal, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import { getLearningLanguage } from 'Utilities/redux/languageReducer'

const PracticeModal = ({ trigger, randomStoryLink }) => {
  return (
    <Modal trigger={trigger}>
      <Modal.Header>Choose practice</Modal.Header>
      <Modal.Content>
        <Link to={randomStoryLink}>
          <Button>
            random story
          </Button>
        </Link>
      </Modal.Content>
      <Modal.Actions>
        
      </Modal.Actions>
    </Modal>
  )
}

export default PracticeModal
