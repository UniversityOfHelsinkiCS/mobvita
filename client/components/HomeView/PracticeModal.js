import React, { useState, useEffect, useLayoutEffect } from 'react'
import { Modal } from 'semantic-ui-react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { capitalize, images } from 'Utilities/common'
import CheckboxGroup from 'Components/CheckboxGroup'
import { FormattedMessage } from 'react-intl'
import { Button, Spinner } from 'react-bootstrap'

const extractFilters = object =>
  Object.entries(object)
    .filter(entry => entry[1])
    .map(([key]) => capitalize(key))

const PracticeModal = ({ open, setOpen }) => {
  const history = useHistory()
  const [libraries, setLibraries] = useState({
    public: true,
    private: true,
    group: true,
  })
  const [categories, setCategories] = useState({
    culture: true,
    politics: true,
    science: true,
    sport: true,
    uncategorized: true,
  })
  const [filteredStories, setFilteredStories] = useState([])

  const [randomStoryIndex, setRandom] = useState(0)

  const { stories, pending } = useSelector(({ stories }) => ({
    stories: stories.data,
    pending: stories.pending,
  }))

  const { user, refreshed } = useSelector(({ user }) => ({
    user: user.data,
    refreshed: user.refreshed,
  }))

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
      setTemp(
        setTimeout(() => {
          setWaiting(false)
        }, 500)
      )
    }

    return clearTimeout(temp)
  }, [pending, refreshed])

  // preload practice modal images
  useLayoutEffect(() => {
    new Image().src = images.dices
    new Image().src = images.sport1
    new Image().src = images.culture1
    new Image().src = images.politics1
    new Image().src = images.science1
  }, [])

  useEffect(() => {
    const librariesToShow = extractFilters(libraries)
    const categoriesToShow = extractFilters(categories)

    const filtered = stories
      .filter(story => {
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
      })
      .filter(story => {
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
    let jump = false
    for (const value of Object.values(libraries)) {
      if (!value) jump = true
    }
    for (const value of Object.values(categories)) {
      if (!value) jump = true
    }
    if (jump && filteredStories.length > 0) {
      // console.log(jump)
      // console.log(`/stories/${filteredStories[randomStoryIndex]._id}/practice`)
      history.push(`/stories/${filteredStories[randomStoryIndex]._id}/practice`)
    }
  }, [filteredStories, randomStoryIndex])

  let filteredLink = ''

  if (filteredStories.length > 0) {
    filteredLink = `/stories/${filteredStories[randomStoryIndex]._id}/practice`
  }

  const handleLibraryChange = library => {
    const initLibraries = {
      private: false,
      public: false,
      group: false,
    }
    const initCategories = {
      culture: true,
      politics: true,
      science: true,
      sport: true,
      uncategorized: true,
    }
    setLibraries({ ...initLibraries, [library]: true })
    setCategories(initCategories)
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
    setOpen(false)
  }

  const handleCategoryChange = category => {
    const initCategories = {
      culture: false,
      politics: false,
      science: false,
      sport: false,
      uncategorized: false,
    }
    const initLibraries = {
      private: true,
      public: true,
      group: true,
    }
    setLibraries(initLibraries)
    setCategories({
      ...initCategories,
      [category]: true,
    })
  }

  return (
    <Modal
      dimmer="inverted"
      open={open}
      onClose={handleClose}
      closeIcon={{ style: { top: '1rem', right: '2.5rem' }, color: 'black', name: 'close' }}
    >
      <Modal.Header>
        <FormattedMessage id="practice-random-story-from" />
      </Modal.Header>
      <Modal.Content className="practiceModal">
        <div className="flex justify-center">
          <Link to={filteredLink} style={{ width: '50%' }}>
            {waiting ? (
              <div className="flex justify-center">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <Button
                disabled={!filteredLink}
                className="practice-modal-tile-btn"
                style={{
                  backgroundImage: `url(${images.dices})`,
                  width: '100%',
                }}
                data-cy="start-random"
              >
                <span style={{ fontWeight: '1000' }}>
                  <FormattedMessage id="(from)all-stories" />
                  {` (${filteredStories.length})`}
                </span>
              </Button>
            )}
          </Link>
        </div>

        <div className="pt-sm pb-sm">
          <br />
          <br />
          <div className="label">
            <FormattedMessage id="(from)library" />:
          </div>
          <br />
          <CheckboxGroup
            values={libraries}
            onClick={handleLibraryChange}
            additionalClass="wrap-and-grow"
            reverse
          />
        </div>
        <div>
          <br />
          <br />
          <div className="label">
            <FormattedMessage id="(from)category" />:
          </div>
          <br />
          <div
            className="checkbox-group"
            style={{ flexWrap: 'wrap' }}
            data-cy="practice-categories"
          >
            {Object.entries(categories)
              .sort()
              .slice(0, 4)
              .map(([name, enabled]) => (
                <Button
                  className={`practice-modal-tile-btn ${!enabled ? 'disabled' : ''}`}
                  style={{
                    backgroundImage: `url(${images[name + 1]})`,
                  }}
                  onClick={() => handleCategoryChange(name)}
                  key={name}
                >
                  <span style={{ fontWeight: '1000' }}>
                    <FormattedMessage id={capitalize(name)} />
                  </span>
                </Button>
              ))}
            <br />
          </div>
          {false && (
            <Button
              block
              onClick={() => handleCategoryChange('uncategorized')}
              variant={categories.uncategorized ? 'btn btn-toggle-on' : 'btn btn-toggle-off'}
              data-cy="other-category"
            >
              <FormattedMessage id="Uncategorized" />
            </Button>
          )}
        </div>
        <div />
      </Modal.Content>
    </Modal>
  )
}

export default PracticeModal
