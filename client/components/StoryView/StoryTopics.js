import React, { useState, useEffect } from 'react'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Box, Paper } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux'
import AppCheckbox from 'Components/ui/AppCheckbox'
import AppSelect from 'Components/ui/AppSelect'
import CustomTooltip from 'Components/CustomTooltip'
import BatchExerciseControl from 'Components/ControlledStoryEditView/BatchExerciseControl'
import Spinner from 'Components/Spinner'

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
        <Paper sx={{ padding: '1em' }}>
        <div style={{ backgroundColor: '#FFFFFF' }}>
          <div className="flex space-between">
            <div style={{ marginBottom: '.5em' }}>
              <div className="header-3" style={{ fontWeight: '500' }}>
                  <CustomTooltip permanent keyId="story-top-topics-explain">
                      <InfoOutlinedIcon
                        fontSize="small"
                        sx={{ color: 'grey', mr: '0.5em', verticalAlign: 'middle' }}
                      />
                  </CustomTooltip>{' '}
                  <FormattedMessage id="topics-header" />
                  {!loadingReady && (
                    <span style={{ marginLeft: '0.5em' }}>
                      <Spinner inline size={28} />
                    </span>
                  )}
              </div>
            </div>
            <div
              onClick={() => {
                handleTopicsBoxClick()}}
              onKeyDown={() => {handleTopicsBoxClick()}}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            >
              {showTopicsBox ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </div>
          </div>
          {showTopicsBox && (
            <>
              <div className="space-between" style={{ alignItems: 'center' }}>
                <FormattedMessage id="LABEL-sort-by" />
                <Box sx={{ flexGrow: 1, ml: '0.5em' }}>
                  <AppSelect
                    variant="contrast-outline"
                    value={sortBy}
                    options={sortOptions}
                    onChange={setSortBy}
                    matchTriggerWidth
                  />
                </Box>
              </div>
              <hr />
              <ul style={{ overflow: 'auto', maxHeight: 171, paddingLeft: 0, marginBottom: 0 }}>
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
