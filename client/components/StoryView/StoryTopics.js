import React, { useState, useEffect } from 'react'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Box, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'
import { colors } from 'Assets/mui_theme/designTokens'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux'
import AppCheckbox from 'Components/ui/AppCheckbox'
import AppSelect from 'Components/ui/AppSelect'
import CustomTooltip from 'Components/CustomTooltip'
import BatchExerciseControl from 'Components/ControlledStoryEditView/BatchExerciseControl'
import Spinner from 'Components/Spinner'

// The header doubles as the control that opens the list, so it wears the design system's
// contrast-outline select pill (same shape, size and hover as AppSelect's trigger).
const TopicsTrigger = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  width: '100%',
  height: 36,
  padding: '9px 18px',
  boxSizing: 'border-box',
  borderRadius: 999,
  fontSize: 16,
  fontWeight: 500,
  textAlign: 'left',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  color: colors.ink,
  border: `2px solid ${colors.ink}`,
  transition: 'background-color 0.15s ease, border-color 0.15s ease',
  '&:hover': { backgroundColor: colors.green, borderColor: colors.green },
  '& .topics-chevron': { fontSize: 20, flexShrink: 0 },
})

const StoryTopics = ({ conceptCount, focusedConcept, setFocusedConcept, isControlledStoryEditor = false, loadingReady = true }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const [topTopics, setTopTopics] = useState([])
  const { width } = useWindowDimensions()
  const showTopicsBox = useSelector((state) => state.topicsBox.showTopicsBox)
  const [sortBy, setSortBy] = useState('cefr')
  const {addExerciseByItem, removeExerciseByItem, exerciseCount} = BatchExerciseControl()

  const sortOptions = [
    { value: 'cefr', label: intl.formatMessage({ id: 'sort-by-concept-cefr-short' }) },
    { value: 'name', label: intl.formatMessage({ id: 'sort-by-concept-name-short' }) },
    { value: 'freq', label: intl.formatMessage({ id: 'sort-by-concept-freq-short' }) },
  ]

  const toggleExerciseTopic = (item, freq) => {
    if (exerciseCount[item] && exerciseCount[item] === freq) {
      removeExerciseByItem(item)
    } else {
      addExerciseByItem(item)
    }
  }

  const handleFocusedConcept = item => {
    if (item === focusedConcept) {
      setFocusedConcept(null)
    } else {
      setFocusedConcept(item)
    }
  }
  const handleTopicsBoxClick = () => {
    if (showTopicsBox) {
      dispatch({ type: 'CLOSE_TOPICS_BOX' })
    } else {
      dispatch({ type: 'SHOW_TOPICS_BOX' })
    }
  }

  const sortByName = () => {
    const keysSorted = Object.entries(conceptCount).sort((a, b) => {
      if (b[0] === a[0])
        return b[1].level - a[1].level
      return b[0] - a[0]
    })
    setTopTopics(keysSorted)
  }

  const sortByFrequency = () => {
    const keysSorted = Object.entries(conceptCount).sort((a, b) => {
      if (b[1].freq === a[1].freq)
        return b[1].level - a[1].level
      return b[1].freq - a[1].freq
    })
    setTopTopics(keysSorted)
  }

  const sortByCefr = () => {
    const keysSorted = Object.entries(conceptCount).sort((a, b) => {
      if (b[1].level === a[1].level)
        return b[1].freq - a[1].freq
      return b[1].level - a[1].level
    })
    setTopTopics(keysSorted)
  }

  useEffect(() => {
    if (sortBy == 'freq') {
      sortByFrequency()
    } else if (sortBy == 'cefr') {
      sortByCefr()
    } else {
      sortByName()
    }
  }, [sortBy, conceptCount])

  if (width >= 1024 && topTopics.length > 0) {
    return (

      <div className="story-topics-box">
        {/* Transparent: the box sits on the sidebar / card that already supplies the colour. */}
        <Paper elevation={0} sx={{ padding: '0', backgroundColor: 'transparent' }}>
        <div>
          {/* The explanation the info icon used to carry now sits on the pill itself. */}
          <CustomTooltip permanent keyId="story-top-topics-explain">
            <TopicsTrigger type="button" onClick={handleTopicsBoxClick}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5em' }}>
                <FormattedMessage id="topics-header" />
                {!loadingReady && <Spinner inline size={20} />}
              </span>
              {showTopicsBox ? (
                <KeyboardArrowUpIcon className="topics-chevron" />
              ) : (
                <KeyboardArrowDownIcon className="topics-chevron" />
              )}
            </TopicsTrigger>
          </CustomTooltip>
          {showTopicsBox && (
            <>
              <div className="space-between" style={{ alignItems: 'center', marginTop: '0.75em' }}>
                <FormattedMessage id="LABEL-sort-by" />
                <Box sx={{ flexGrow: 1, ml: '0.5em' }}>
                  <AppSelect
                    variant="contrast-outline"
                    value={sortBy}
                    options={sortOptions}
                    onChange={setSortBy}
                    matchTriggerWidth
                    // Without this MUI hides the page scrollbar while the menu is open, and the
                    // whole layout jumps sideways by its width.
                    disableScrollLock
                  />
                </Box>
              </div>
              <hr />
              <ul style={{ overflow: 'auto', maxHeight: 270, paddingLeft: 0, marginBottom: 0, backgroundColor: 'white' }}>
                {topTopics.map(topic => (
                  <li className="flex space-between" key={topic[0]}>
                    <span
                      className={focusedConcept === topic[0] && 'concept-highlighted-word' || ''}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleFocusedConcept(topic[0])}
                    >
                      {isControlledStoryEditor && <AppCheckbox
                        sx={{ p: 0, verticalAlign: 'middle', mr: '0.5em' }}
                        checked={exerciseCount[topic[0]] && exerciseCount[topic[0]] === topic[1].freq ? true : false}
                        indeterminate={exerciseCount[topic[0]] && (
                          exerciseCount[topic[0]] / topic[1].freq !== 1 && exerciseCount[topic[0]] / topic[1].freq !== 0) ? true : false}
                        onChange={() => toggleExerciseTopic(topic[0], topic[1].freq)}
                      />}
                        { /* topic[0] */
                            <span dangerouslySetInnerHTML={{ __html: topic[0].split('—')[0].trim() }}
                            />
                        }
                    </span>
                    <span style={{ marginRight: '.5em', marginLeft: '8px' }}>
                      {topic[1].freq}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        </Paper>
      </div>
    )
  }

  return null
}


export default StoryTopics
