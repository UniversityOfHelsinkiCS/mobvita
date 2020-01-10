import React, { useState, useEffect } from 'react'
import { Modal, Button, Checkbox, Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const extractFilters = object => Object
  .entries(object)
  .filter(entry => entry[1])
  .map(([key]) => key)

const CheckboxGroup = ({ values, onChange }) => (
  Object.entries(values).map(([key, val]) => (
    <Checkbox
      key={key}
      onChange={onChange(key)}
      label={key}
      checked={val}
    />
  ))
)

const PracticeModal = ({ trigger }) => {
  const [libraries, setLibraries] = useState(
    {
      Private: true,
      Public: true,
    },
  )
  const [categories, setCategories] = useState(
    {
      Science: true,
      Politics: true,
      Culture: true,
      Sports: true,
    },
  )
  const [filteredStories, setFilteredStories] = useState([])

  const [randomStoryIndex, setRandom] = useState(0)
  const [language, setLanguage] = useState('')
  const { stories, pending } = useSelector(({ stories }) => ({ stories: stories.data, pending: stories.pending }))

  useEffect(() => {
    const filtered = stories.filter((story) => {
      const storyLibrary = story.public ? 'Public' : 'Private'
      const librariesToShow = extractFilters(libraries)

      return librariesToShow.includes(storyLibrary)
    }).filter((story) => {
      const categoriesToShow = extractFilters(categories)

      return categoriesToShow.includes(story.category)
    })

    setFilteredStories(filtered)

    const currentLanguage = window.location.pathname.split('/')[2]
    setLanguage(currentLanguage)
    if (filtered.length > 0) {
      const random = Math.ceil(Math.random() * filtered.length) - 1
      setRandom(random)
    }
  }, [stories, libraries, categories])

  if (pending) return null

  let filteredLink = null

  if (filteredStories.length > 0) {
    filteredLink = `/stories/${language}/${filteredStories[randomStoryIndex]._id}/practice`
  }

  const handleCategoryChange = category => (_, data) => {
    setCategories({ ...categories, [category]: data.checked })
  }

  const handleLibraryChange = library => (_, data) => {
    setLibraries({ ...libraries, [library]: data.checked })
  }


  return (
    <Modal
      closeIcon
      trigger={trigger}
    >
      <Modal.Header>Choose practice</Modal.Header>
      <Modal.Content className="practiceModal">

        <Container>
          <Button disabled={!filteredLink} color="teal" as={Link} to={filteredLink}>
            {`Start random story from ${filteredStories.length} stories`}
          </Button>
        </Container>


        <div style={{ padding: '1em' }}>
          <div>Story library</div>
          <CheckboxGroup values={libraries} onChange={handleLibraryChange} />
        </div>
        <div style={{ padding: '1em' }}>
          <div>Story category</div>
          <div>
            <CheckboxGroup values={categories} onChange={handleCategoryChange} />
          </div>
        </div>
        <div style={{ padding: '1em' }} />
      </Modal.Content>
    </Modal>
  )
}

export default PracticeModal
