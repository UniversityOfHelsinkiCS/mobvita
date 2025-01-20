import React, { useState, useEffect } from 'react'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Icon, Popup, Segment } from 'semantic-ui-react'
import { Form } from 'react-bootstrap'
import { skillLevels, hiddenFeatures } from 'Utilities/common'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import BatchExerciseControl from 'Components/ControlledStoryEditView/BatchExerciseControl'

const StoryTopics = ({ conceptCount, focusedConcept, setFocusedConcept, isControlledStoryEditor = false }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const [topTopics, setTopTopics] = useState([])
  const { width } = useWindowDimensions()
  const showTopicsBox = useSelector((state) => state.topicsBox.showTopicsBox)
  const [sortBy, setSortBy] = useState('name')
  const {addExerciseByItem, removeExerciseByItem, exerciseCount} = BatchExerciseControl()

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
  }, [sortBy])

  useEffect(() => {
    sortByName()
  }, [conceptCount])

  if (width >= 1024 && topTopics.length > 0) {
    return (
      
      <div className="story-topics-box">
        <Segment>
        <div style={{ backgroundColor: '#FFFFFF' }}>
          <div className="flex space-between">
            <div style={{ marginBottom: '.5em' }}>
              <div className="header-3" style={{ fontWeight: '500' }}>
                  <Popup
                      content={<FormattedHTMLMessage id={'story-top-topics-explain'} />}
                      trigger={<Icon style={{ paddingRight: '0.5em' }}
                                     name="info circle"
                                     size="small"
                                     color="grey"
                               />}
                  />{' '}
                  <FormattedMessage id="topics-header" />
              </div>
            </div>
            <div
              onClick={() => {
                handleTopicsBoxClick()}}
              onKeyDown={() => {handleTopicsBoxClick()}}
              role="button"
              tabIndex={0}
            >
              <Icon name={showTopicsBox ? 'angle up' : 'angle down'} size="large" />
            </div>
          </div>
          {showTopicsBox && (
            <>
              <FormattedMessage id="LABEL-sort-by" />
              <div className="space-evenly" style={{ marginTop: '.5em' }}>
                <span style={{ marginRight: '.5em' }}>
                  <input
                    type="radio"
                    style={{ marginRight: '.75em' }}
                    onChange={() => setSortBy('name')}
                    checked={sortBy=='name'}
                  />
                  <FormattedMessage id="Name" />
                </span>
                <span style={{ marginRight: '.5em' }}>
                  <input
                    type="radio"
                    style={{ marginRight: '.75em' }}
                    onChange={() => setSortBy('freq')}
                    checked={sortBy=='freq'}
                  />
                  <FormattedMessage id="sort-by-concept-freq-short" />
                </span>
                <span style={{ marginRight: '.5em' }}>
                  <input
                    type="radio"
                    style={{ marginRight: '.75em' }}
                    onChange={() => setSortBy('cefr')}
                    checked={sortBy=='cefr'}
                  />
                  <FormattedMessage id="sort-by-concept-cefr-short" />
                </span>
              </div>
              <hr />
              <ul style={{ overflow: 'auto', maxHeight: 171, paddingLeft: 0 }}>
                {topTopics.map(topic => (
                  <li className="flex space-between" key={topic[0]}>
                    <span
                      className={focusedConcept === topic[0] && 'concept-highlighted-word' || ''}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleFocusedConcept(topic[0])}
                    >
                      {isControlledStoryEditor && <Form.Check
                        style={{ verticalAlign: 'middle', marginRight: '0.5em' }}
                        type="checkbox"
                        inline
                        // label={intl.formatMessage({ id: 'teacher-view' })}
                        checked={exerciseCount[topic[0]] && exerciseCount[topic[0]] === topic[1].freq ? true : false}
                        ref={el => {
                          if (el) el.indeterminate = exerciseCount[topic[0]] && (
                            exerciseCount[topic[0]] / topic[1].freq !== 1 && exerciseCount[topic[0]] / topic[1].freq !== 0) ? true : false
                        }}
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
        </Segment>
      </div>
    )
  }

  return null
}


export default StoryTopics
