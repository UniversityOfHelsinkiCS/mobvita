import React, { useState, useEffect } from 'react'
import { Modal, Button, Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { capitalize, learningLanguageSelector } from 'Utilities/common'
import { getStories } from 'Utilities/redux/storiesReducer'
import CheckboxGroup from 'Components/CheckboxGroup'
import { FormattedMessage } from 'react-intl'

const extractFilters = object => Object
  .entries(object)
  .filter(entry => entry[1])
  .map(([key]) => capitalize(key))

const PracticeModal = ({ trigger }) => {
  const [libraries, setLibraries] = useState(
    {
      private: true,
      public: true,
      group: true,
    },
  )
  const [categories, setCategories] = useState(
    {
      science: true,
      politics: true,
      culture: true,
      sport: true,
      uncategorized: true,
    },
  )
  const [filteredStories, setFilteredStories] = useState([])

  const [randomStoryIndex, setRandom] = useState(0)

  const { stories, pending } = useSelector(({ stories }) => (
    {
      stories: stories.data,
      pending: stories.pending,
    }
  ))

  const language = useSelector(learningLanguageSelector)
  const user = useSelector(({ user }) => user.data)

  const dispatch = useDispatch()

  useEffect(() => {
    const librariesToShow = extractFilters(libraries)
    const categoriesToShow = extractFilters(categories)

    const filtered = stories.filter((story) => {
      if (story.public) {
        return librariesToShow.includes('Public')
      }

      if (story.sharedwith && story.sharedwith.includes(user.user.oid)) {
        return librariesToShow.includes('Private')
      }

      if (story.user !== user.user.oid) {
        return librariesToShow.includes('Group')
      }

      return librariesToShow.includes('Private')
    }).filter((story) => {
      if (categoriesToShow.includes('Uncategorized') && !story.category) {
        return true
      }

      return categoriesToShow.includes(story.category)
    })

    if (filtered.length > 0) {
      const random = Math.ceil(Math.random() * filtered.length) - 1
      setRandom(random)
    }

    setFilteredStories(filtered)
  }, [stories, libraries, categories])

  useEffect(() => {
    dispatch(getStories(language, {
      sort_by: 'date',
      order: -1,
      page: 0,
      page_size: 20,
    }))
  }, [])

  if (pending) return null

  let filteredLink = ''

  if (filteredStories.length > 0) {
    filteredLink = `/stories/${filteredStories[randomStoryIndex]._id}/practice`
  }

  const handleCategoryChange = category => () => {
    setCategories({ ...categories, [category]: !categories[category] })
  }

  const handleLibraryChange = library => () => {
    setLibraries({ ...libraries, [library]: !libraries[library] })
  }

  const handleClose = () => {
    setLibraries({
      private: true,
      public: true,
    })
    setCategories({
      science: true,
      politics: true,
      culture: true,
      sport: true,
    })
  }

  return (
    <Modal
      dimmer="inverted"
      closeIcon
      trigger={trigger}
      onClose={handleClose}
    >
      <Modal.Header><FormattedMessage id="practice" /></Modal.Header>
      <Modal.Content className="practiceModal">

        <Container>
          <Button data-cy="start-random" fluid disabled={!filteredLink} color="teal" as={Link} to={filteredLink}>
            {`Start random story from ${filteredStories.length} stories`}
          </Button>
        </Container>


        <div style={{ padding: '1em' }}>
          <div><FormattedMessage id="Library" /></div>
          <CheckboxGroup values={libraries} onClick={handleLibraryChange} />
        </div>
        <div style={{ padding: '1em' }}>
          <div><FormattedMessage id="Category" /></div>
          <div>
            <CheckboxGroup values={categories} onClick={handleCategoryChange} />
          </div>
        </div>
        <div style={{ padding: '1em' }} />
      </Modal.Content>
    </Modal>
  )
}

export default PracticeModal
