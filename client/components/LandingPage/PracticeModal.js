import React, { useState, useEffect } from 'react'
import { Modal, Button, Select } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PracticeModal = ({ trigger }) => {
  const [storyType, setStoryType] = useState('any')
  const [category, setCategory] = useState('any')
  const [filteredStories, setFilteredStories] = useState([])


  const user = useSelector(({ user }) => user.data.user)

  const [randomStoryIndex, setRandom] = useState(0)
  const [language, setLanguage] = useState('')
  const { stories, pending } = useSelector(({ stories }) => ({ stories: stories.data, pending: stories.pending }))

  useEffect(() => {
    const filtered = stories.filter((story) => {
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

    setFilteredStories(filtered)

    const currentLanguage = window.location.pathname.split('/')[2]
    setLanguage(currentLanguage)
    if (filtered.length > 0) {
      const random = Math.ceil(Math.random() * filtered.length) - 1
      setRandom(random)
    }
  }, [stories, storyType, category])

  if (pending) return null

  const storyTypes = ['any', 'private', 'public']
  const categories = ['any', 'Science', 'Politics', 'Sports', 'Culture']

  let filteredLink = null

  if (filteredStories.length > 0) {
    filteredLink = `/stories/${language}/${filteredStories[randomStoryIndex]._id}/practice`
  }

  const handleClose = () => {
    setStoryType('any')
    setCategory('any')
  }

  return (
    <Modal closeIcon trigger={trigger} onClose={handleClose}>
      <Modal.Header>Choose practice</Modal.Header>
      <Modal.Content>
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
        {filteredLink
          && (
          <Link to={filteredLink}>
            <Button>
              Start filtered story
            </Button>
          </Link>
          )
        }
      </Modal.Content>
    </Modal>
  )
}

export default PracticeModal
