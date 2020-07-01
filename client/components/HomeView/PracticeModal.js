import React, { useState, useEffect } from 'react'
import { Modal } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { capitalize } from 'Utilities/common'
import CheckboxGroup from 'Components/CheckboxGroup'
import { FormattedMessage } from 'react-intl'
import { Button, Spinner } from 'react-bootstrap'


const extractFilters = object => Object
  .entries(object)
  .filter(entry => entry[1])
  .map(([key]) => capitalize(key))

const PracticeModal = ({ trigger }) => {
  const [libraries, setLibraries] = useState(
    {
      public: true,
      private: true,
      group: true,
    },
  )
  const [categories, setCategories] = useState(
    {
      culture: true,
      politics: true,
      science: true,
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

  const { user, refreshed } = useSelector(({ user }) => (
    {
      user: user.data,
      refreshed: user.refreshed,
    }
  ))

  const [waiting, setWaiting] = useState(true)
  const [temp, setTemp] = useState(null)

  /**
   * This useEffect is needed because of case where refreshed=true,pending=false.
   * If removed, cypress tests will fail because the button disappears in the middle of testing.
   */
  useEffect(() => {
    if (refreshed && !pending) {
      if (temp) {
        clearTimeout(temp)
      }
      setTemp(setTimeout(() => {
        setWaiting(false)
      }, 500))
    }
  }, [pending, refreshed])


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


  let filteredLink = ''

  if (filteredStories.length > 0) {
    filteredLink = `/stories/${filteredStories[randomStoryIndex]._id}/practice`
  }

  const handleLibraryChange = (library) => {
    setLibraries({ ...libraries, [library]: !libraries[library] })
  }

  const handleClose = () => {
    setLibraries({
      private: true,
      public: true,
      group: true,
    })
    setCategories({
      culture: true,
      politics: true,
      science: true,
      sport: true,
      uncategorized: true,
    })
  }

  const toggleCategory = (category) => {
    setCategories({ ...categories, [category]: !categories[category] })
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

        <div>
          <Link to={filteredLink}>
            {waiting ? (
              <Spinner animation="border" variant="primary" />
            )
              : (
                <Button variant="primary" data-cy="start-random" disabled={!filteredLink}>
                  <FormattedMessage id="practice-random-story" />{` (${filteredStories.length} `}<FormattedMessage id="stories-selected" />{")"}
                </Button>
              )
            }
          </Link>
        </div>

        <div>
          <div><FormattedMessage id="Library" /></div>
          <CheckboxGroup
            values={libraries}
            onClick={handleLibraryChange}
            additionalClass="wrap-and-grow"
            reverse
          />
        </div>
        <div>
          <div><FormattedMessage id="Category" /></div>
          <CheckboxGroup
            values={categories}
            onClick={toggleCategory}
            dataCy="practice-categories"
            additionalClass="wrap-and-grow"
          />
        </div>
        <div />
      </Modal.Content>
    </Modal>
  )
}

export default PracticeModal
