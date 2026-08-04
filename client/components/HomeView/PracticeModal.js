import React, { useState, useEffect, useLayoutEffect } from 'react'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector, shallowEqual } from 'react-redux'
import { capitalize, images } from 'Utilities/common'
import { FormattedMessage } from 'react-intl'
import Spinner from 'Components/Spinner'
import AppDialog from 'Components/ui/AppDialog'
import { colors, font } from 'Assets/mui_theme/designTokens'

const extractFilters = object =>
  Object.entries(object)
    .filter(entry => entry[1])
    .map(([key]) => capitalize(key))

// Which custom icon each library / category pill uses (keys into the shared `images` map).
const LIBRARY_ICON = { public: 'globe02', private: 'lock01', group: 'users01Pick' }
const CATEGORY_ICON = {
  culture: 'brush01Pick',
  politics: 'globe04',
  science: 'microscope',
  sport: 'trophy01Pick',
}

// A "Pick a story" pill: icon on the left, label (+ optional count). Matches the 2026 modal design.
const PickButton = ({ handleClick, name, iconKey, storyNum }) => (
  <Box
    component="button"
    type="button"
    data-cy={name}
    onClick={handleClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.7em',
      width: '100%',
      padding: '0.7em 1.1em',
      borderRadius: '999px',
      border: '1px solid #E3E0D2',
      backgroundColor: '#fff',
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: font.family,
      transition: 'background-color 0.15s ease, border-color 0.15s ease',
      '&:hover': { backgroundColor: colors.card, borderColor: colors.focus },
    }}
  >
    {iconKey && (
      <img src={images[iconKey]} alt="" style={{ width: 24, height: 24, flexShrink: 0 }} />
    )}
    <span style={{ fontSize: 17, fontWeight: 600, color: colors.ink }}>
      <FormattedMessage id={capitalize(name)} />
      {storyNum != null && (
        <span style={{ color: colors.muted, fontWeight: 500 }}> ({storyNum})</span>
      )}
    </span>
  </Box>
)

const PracticeModal = ({ open, setOpen }) => {
  const navigate = useNavigate()
  const [libraries, setLibraries] = useState({
    public: true,
    private: true,
    group: true })
  const [categories, setCategories] = useState({
    culture: true,
    politics: true,
    science: true,
    sport: true,
    uncategorized: true })
  const [filteredStories, setFilteredStories] = useState([])

  const [randomStoryIndex, setRandom] = useState(0)

  const { stories, pending } = useSelector(({ stories }) => ({
    stories: stories.data,
    pending: stories.pending }), shallowEqual)

  const { user, refreshed } = useSelector(({ user }) => ({
    user: user.data,
    refreshed: user.refreshed }), shallowEqual)

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

  // preload practice modal icons
  useLayoutEffect(() => {
    ;['star06Pick', 'lock01', 'globe02', 'users01Pick', 'brush01Pick', 'globe04', 'microscope', 'trophy01Pick'].forEach(
      key => {
        new Image().src = images[key]
      }
    )
  }, [])

  useEffect(() => {
    const librariesToShow = extractFilters(libraries)
    const categoriesToShow = extractFilters(categories)
    const safeStories = Array.isArray(stories) ? stories : []
    const userOid = user?.user?.oid

    const filtered = safeStories
      .filter(story => {
        if (!story) return false

        if (story.public) {
          return librariesToShow.includes('Public')
        }

        if (userOid && story.sharedwith && story.sharedwith.includes(userOid)) {
          return librariesToShow.includes('Private')
        }

        if (userOid && story.user !== userOid) {
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
      navigate(`/stories/${filteredStories[randomStoryIndex]._id}/preview`) //practice-preview
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
      group: false }
    const initCategories = {
      culture: true,
      politics: true,
      science: true,
      sport: true,
      uncategorized: true }
    setLibraries({ ...initLibraries, [library]: true })
    setCategories(initCategories)
  }

  const handleClose = () => {
    setLibraries({
      public: true,
      private: true,
      group: true })
    setCategories({
      culture: true,
      politics: true,
      science: true,
      sport: true,
      uncategorized: true })
    setOpen(false)
  }

  const handleCategoryChange = category => {
    const initCategories = {
      culture: false,
      politics: false,
      science: false,
      sport: false,
      uncategorized: false }
    const initLibraries = {
      public: true,
      private: true,
      group: true }
    setLibraries(initLibraries)
    setCategories({
      ...initCategories,
      [category]: true })
  }

  const sectionLabel = { fontFamily: font.family, fontSize: 14, color: colors.ink, marginBottom: '0.9em' }
  const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75em' }

  return (
    <AppDialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      title={<FormattedMessage id="pick-a-story" defaultMessage="Pick a story" />}
    >
      <div className="flex-col" style={{ gap: '1.75em', display: 'flex', flexDirection: 'column' }}>
        <div>
          <div style={sectionLabel}>
            <FormattedMessage id="practice-random-story-from-library" />
          </div>

          <div style={gridStyle} data-cy="practice-libraries">
            {waiting ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.7em 1.1em',
                  borderRadius: '999px',
                  border: '1px solid #E3E0D2',
                  backgroundColor: '#fff',
                }}
              >
                <Spinner inline />
              </Box>
            ) : (
              <PickButton
                handleClick={() => navigate(filteredLink)}
                name="All-Stories"
                iconKey="star06Pick"
                storyNum={filteredStories.length}
              />
            )}
            {['private', 'public', 'group'].map(key => (
              <PickButton
                key={key}
                handleClick={() => handleLibraryChange(key)}
                name={key}
                iconKey={LIBRARY_ICON[key]}
              />
            ))}
          </div>
        </div>

        <div>
          <div style={sectionLabel}>
            <FormattedMessage id="or-from-category" />
          </div>
          <div style={gridStyle} data-cy="practice-categories">
            {Object.entries(categories)
              .sort()
              .slice(0, 4)
              .map(([name]) => (
                <PickButton
                  key={name}
                  handleClick={() => handleCategoryChange(name)}
                  name={name}
                  iconKey={CATEGORY_ICON[name]}
                />
              ))}
          </div>
        </div>
      </div>
    </AppDialog>
  )
}

export default PracticeModal
