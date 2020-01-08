import React, { useState } from 'react'
import { Modal, Button, Select } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
// import { getLearningLanguage } from 'Utilities/redux/languageReducer'

<<<<<<< HEAD
const PracticeModal = ({ trigger, randomStoryLink }) => {
  const [storyType, setStoryType] = useState('any')
  const [category, setCategory] = useState('any')
  const stories = useSelector(({ stories }) => stories.data)
  const user = useSelector(({ user }) => user.data.user)

  const storyTypes = ['any', 'private', 'public']
  const categories = ['any', 'Science', 'Politics', 'Sports', 'Culture']

  const filteredStories = stories.filter((story) => {
    if (storyType === 'any') {
      return true
    }

    if (storyType === 'public' && story.public === true) {
      return true
    }


    return storyType === 'private' && story.user === user.oid
  }).filter((story) => {
    if (category === 'any') {
      return true
    }

    return story.category === category
  })

  return (
    <Modal trigger={trigger}>
      <Modal.Header>Choose practice</Modal.Header>
      <Modal.Content>
        <Link to={randomStoryLink}>
          <Button>
            random story
          </Button>
        </Link>
        <div>
          <Select
            placeholder="select a story type"
            value={storyType}
            options={storyTypes.map(type => ({ key: type, value: type, text: type }))}
            onChange={(_, option) => setStoryType(option.value)}
          />
        </div>
        <div>
          <Select
            placeholder="select a category"
            value={category}
            options={categories.map(type => ({ key: type, value: type, text: type }))}
            onChange={(_, option) => setCategory(option.value)}
          />
        </div>
        <div>
          {`${filteredStories.length} stories`}
        </div>
      </Modal.Content>
    </Modal>
  )
}
=======
const PracticeModal = ({ trigger, randomStoryLink }) => (
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
>>>>>>> e7bb2f12595b557fc4c299420c12265e0c4ce970

export default PracticeModal
