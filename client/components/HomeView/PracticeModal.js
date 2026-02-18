import React, { useState, useEffect, useLayoutEffect } from 'react'
import { Modal } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { capitalize, images } from 'Utilities/common'
import { FormattedMessage } from 'react-intl'
import Spinner from 'Components/Spinner'

const extractFilters = object =>
  Object.entries(object)
    .filter(entry => entry[1])
    .map(([key]) => capitalize(key))

const PracticeModalButton = ({ handleClick, name, extraImgSrc, storyNum }) => {
  const imgSrc = extraImgSrc ?? `${name}1`

  return (
    <button style={{ marginRight: "auto" }} data-cy={name} className="practice-now-modal-btn" type="button" onClick={handleClick}>
      <div className="align-center flex-col space-between">
        <div style={{ marginBottom: '1em' }}>
          <FormattedMessage id={capitalize(name)} /> {storyNum && <span> ({storyNum})</span>}
        </div>
        <img src={images[imgSrc]} alt={name} style={{ maxWidth: '45%', maxHeight: '45%' }} />
      </div>
    </button>
  )
}

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
    new Image().src = images.library

    new Image().src = images.dices
    new Image().src = images.public1
    new Image().src = images.group1
    new Image().src = images.private1

    new Image().src = images.culture1
    new Image().src = images.politics1
    new Image().src = images.science1
    new Image().src = images.sport1
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
      history.push(`/stories/${filteredStories[randomStoryIndex]._id}/preview`) //practice-preview
    }
  }, [filteredStories, randomStoryIndex])

  let filteredLink = ''

  if (filteredStories.length > 0) {
    filteredLink = `/stories/${filteredStories[randomStoryIndex]._id}/preview`
  }

  const handleLibraryChange = library => {
    const initLibraries = {
      public: false,
      private: false,
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
      public: true,
      private: true,
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
      public: true,
      private: true,
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
      <Modal.Content style={{ background: 'rgb(230, 235, 233)' }}>
        <div className="flex-col" style={{ gap: '3em' }}>
          <div>
            <div className="practice-now-modal-label" style={{ width: '85%' }}>
              <FormattedMessage id="practice-random-story-from-library" />
            </div>

            <div className="practice-now-modal-group-cont" data-cy="practice-libraries">
              {waiting ? (
                <button type="button" className="practice-now-modal-btn">
                  <div className="align-center flex-col space-between">
                    <Spinner inline />
                  </div>
                </button>
              ) : (
                <PracticeModalButton
                  handleClick={() => history.push(filteredLink)}
                  name="All-Stories"
                  extraImgSrc="dices"
                  storyNum={filteredStories.length}
                />
              )}
              {Object.entries(libraries).map(([key, _]) => (
                <PracticeModalButton
                  key={key}
                  handleClick={() => handleLibraryChange(key)}
                  name={key}
                />
              ))}
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <div className="practice-now-modal-label">
              <FormattedMessage id="or-from-category" />
            </div>
            <div className="practice-now-modal-group-cont" data-cy="practice-categories">
              {Object.entries(categories)
                .sort()
                .slice(0, 4)
                .map(([name, _]) => (
                  <PracticeModalButton
                    key={name}
                    handleClick={() => handleCategoryChange(name)}
                    name={name}
                  />
                ))}
            </div>
          </div>

          {/* <div style={{ width: '100%' }}>
            <div className="practice-now-modal-label">
              <FormattedMessage id="check-library" />
            </div>
            <div className="practice-now-modal-group-cont" data-cy="practice-library">
              <PracticeModalButton
                handleClick={() => history.push('/library')}
                name="Library"
                extraImgSrc="library"
                dataCy="check-library-button"
              />
            </div>
          </div> */}
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default PracticeModal
