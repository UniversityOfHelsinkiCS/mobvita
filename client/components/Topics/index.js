import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { useIntl, FormattedMessage } from 'react-intl'
import { Icon, Accordion, AccordionTitle, AccordionContent } from 'semantic-ui-react'
import TopicListItem from './TopicListItem'

const getLessonTopicKey = (lessonId, topic) => `${lessonId}::${topic}`

// Makes a simple string we can compare when the saved topic list changes.
const getTopicIdSignature = topicIds => (topicIds || []).join('|||')

const Topics = ({
  topicInstance,
  editable,
  setSelectedTopics,
  showPerf,
  selectedTopicKeys,
  setSelectedTopicKeys,
}) => {
  const intl = useIntl()
  const { lessons } = useSelector(({ metadata }) => metadata)
  const { topics } = useSelector(({ lessons }) => lessons)
  const [filteredLessons, setFilteredLessons] = useState(lessons)
  const [accordionState, setAccordionState] = useState(-1)
  const [searchQuery, setSearchQuery] = useState('')
  const [internalSelectedTopicKeys, setInternalSelectedTopicKeys] = useState([])
  const [lastSavedTopicIdSignature, setLastSavedTopicIdSignature] = useState('')

  const lesson2info = lessons.reduce((obj, lesson) => ({ ...obj, [lesson.ID]: lesson }), {})
  // Some parents control topic row keys themselves; otherwise Topics handles them here.
  const controlledTopicKeys = Array.isArray(selectedTopicKeys) && setSelectedTopicKeys
  const activeSelectedTopicKeys = controlledTopicKeys
    ? selectedTopicKeys
    : internalSelectedTopicKeys
  const updateSelectedTopicKeys = controlledTopicKeys
    ? setSelectedTopicKeys
    : setInternalSelectedTopicKeys
  const selectedTopicKeySet = useMemo(
    () => new Set(activeSelectedTopicKeys),
    [activeSelectedTopicKeys],
  )
  // Finds the normal topic id from a checked row key.
  const topicByKey = useMemo(() => {
    return lessons.reduce((obj, lesson) => {
      lesson.topics.forEach(topic => {
        obj[getLessonTopicKey(lesson.ID, topic)] = topic
      })
      return obj
    }, {})
  }, [lessons])

  // Turns checked row keys back into the topic id list saved by the app.
  const getTopicIdsFromKeys = topicKeys => {
    const topics = new Set()

    topicKeys.forEach(topicKey => {
      if (topicByKey[topicKey]) {
        topics.add(topicByKey[topicKey])
      }
    })

    return Array.from(topics)
  }

  // Checks the matching topic rows when we only have saved topic ids.
  const getTopicKeysFromTopicIds = topicIds => {
    const topicIdSet = new Set(topicIds || [])

    return Object.keys(topicByKey).filter(topicKey => topicIdSet.has(topicByKey[topicKey]))
  }

  // Saves the checked rows locally and sends normal topic ids to the parent.
  const saveSelectedTopicKeys = topicKeys => {
    const nextTopicIds = getTopicIdsFromKeys(topicKeys)

    updateSelectedTopicKeys(topicKeys)
    setLastSavedTopicIdSignature(getTopicIdSignature(nextTopicIds))
    setSelectedTopics(nextTopicIds, topicKeys)
  }

  // Keeps the checkboxes in sync when a parent changes topic_ids from outside Topics.
  useEffect(() => {
    if (controlledTopicKeys) return

    const topicIdSignature = getTopicIdSignature(topicInstance.topic_ids)
    if (topicIdSignature === lastSavedTopicIdSignature) return
    if (topicInstance.topic_ids?.length > 0 && Object.keys(topicByKey).length === 0) return

    setInternalSelectedTopicKeys(getTopicKeysFromTopicIds(topicInstance.topic_ids))
    setLastSavedTopicIdSignature(topicIdSignature)
  }, [controlledTopicKeys, lastSavedTopicIdSignature, topicByKey, topicInstance.topic_ids])

  useEffect(() => {
    // Filter lessons based on search query
    if (searchQuery) {
      const filtered = lessons.filter(lesson => {
        const lowercaseSearchQuery = searchQuery.toLowerCase()
        const nameMatch = lesson.name.toLowerCase().includes(lowercaseSearchQuery)
        const topicsMatch = lesson.topics.some(topic =>
          topic.toLowerCase().includes(lowercaseSearchQuery),
        )
        return nameMatch || topicsMatch
      })

      setFilteredLessons(filtered)
    } else {
      setFilteredLessons(lessons)
    }
  }, [lessons, searchQuery])

  // The lesson button is on only when every topic row in that lesson is checked.
  const isLessonItemSelected = lesson_id => {
    const lessonTopics = Object.prototype.hasOwnProperty.call(lesson2info, lesson_id)
      ? lesson2info[lesson_id].topics
      : []
    if (lessonTopics.length === 0) return false

    return lessonTopics.every(topic => selectedTopicKeySet.has(getLessonTopicKey(lesson_id, topic)))
  }

  // Shows the weakest topic score for the whole lesson card.
  const calculateLowestScore = topics => {
    if (topics.length === 0) {
      return { score: 0, correct: 0, total: 0 }
    }

    const { score, correct, total } = topics.reduce(
      (lowest, topic) => {
        const currentScore = topic.correct / topic.total
        if (currentScore < lowest.score) {
          return { score: currentScore, correct: topic.correct, total: topic.total }
        }
        return lowest
      },
      {
        score: topics[0].correct / topics[0].total,
        correct: topics[0].correct,
        total: topics[0].total,
      },
    )

    return { score, correct, total }
  }

  const lessonGroups =
    (filteredLessons &&
      filteredLessons.reduce((x, y) => {
        ;(x[y.group] = x[y.group] || []).push(y)
        return x
      }, {})) ||
    {}

  const handleClick = (e, props) => {
    const { index } = props
    const newIndex = accordionState === index ? -1 : index
    setAccordionState(newIndex)
  }

  const handleSearchChange = event => {
    setSearchQuery(event.target.value)
  }

  // Checks or unchecks just one topic row inside one lesson.
  const toggleTopic = (topicId, lessonId) => {
    const topicKey = getLessonTopicKey(lessonId, topicId)
    const newTopicKeys = new Set(activeSelectedTopicKeys)

    if (newTopicKeys.has(topicKey)) {
      newTopicKeys.delete(topicKey)
    } else {
      newTopicKeys.add(topicKey)
    }

    saveSelectedTopicKeys(Array.from(newTopicKeys))
  }

  // Checks every topic row inside one lesson card.
  const includeLesson = LessonId => {
    const lessonTopics = Object.prototype.hasOwnProperty.call(lesson2info, LessonId)
      ? lesson2info[LessonId].topics
      : []

    const newTopicKeys = new Set(activeSelectedTopicKeys)
    lessonTopics.forEach(topic => newTopicKeys.add(getLessonTopicKey(LessonId, topic)))

    saveSelectedTopicKeys(Array.from(newTopicKeys))
  }

  // Unchecks every topic row inside one lesson card.
  const excludeLesson = LessonId => {
    const lessonTopics = Object.prototype.hasOwnProperty.call(lesson2info, LessonId)
      ? lesson2info[LessonId].topics
      : []

    const lessonTopicKeys = lessonTopics.map(topic => getLessonTopicKey(LessonId, topic))
    const nextTopicKeys = activeSelectedTopicKeys.filter(
      topicKey => !lessonTopicKeys.includes(topicKey),
    )

    saveSelectedTopicKeys(nextTopicKeys)
  }

  // Clears all checked topic rows.
  const excludeAllTopics = () => {
    saveSelectedTopicKeys([])
  }

  // Builds one visible lesson card.
  const rowRenderer = ({ key, lesson_obj, style }) => {
    if (!lesson_obj) return null

    const lowestScore = calculateLowestScore(
      topics.filter(topic => lesson_obj.topics && lesson_obj.topics?.includes(topic.topic_id)),
    )
    lesson_obj.correct = lowestScore.correct
    lesson_obj.total = lowestScore.total
    return (
      <div key={key} style={{ ...style, marginBottom: '1.5em' }}>
        <TopicListItem
          lesson={lesson_obj}
          lesson_instance={topicInstance}
          selected={isLessonItemSelected(lesson_obj.ID)}
          toggleTopic={toggleTopic}
          includeLesson={includeLesson}
          excludeLesson={excludeLesson}
          selectedTopicKeys={activeSelectedTopicKeys}
          disabled={!editable}
          showPerf={showPerf}
        />
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: '2em' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.0rem' }}>
        <Button
          variant="primary"
          disabled={
            topicInstance.instancePending ||
            !topicInstance.topic_ids ||
            topicInstance.topic_ids.length === 0 ||
            !editable
          }
          style={{
            cursor: topicInstance.instancePending || !editable ? 'not-allowed' : 'pointer',
          }}
          onClick={() => excludeAllTopics()}
        >
          <Icon name="trash alternate" />
          <FormattedMessage id="exclude-all-topics" />
        </Button>

        <input
          type="text"
          placeholder={intl.formatMessage({ id: 'Search lessons / topics ...' })}
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            marginLeft: '0.5em',
            flex: '1',
            padding: '5.5px',
            borderRadius: '16px',
            border: '1px solid #ccc',
            outline: 'none',
            fontSize: '16px',
          }}
        />
      </div>

      {lessonGroups && (
        <Accordion fluid styled style={{ background: '#fffaf0' }}>
          {Object.keys(lessonGroups)
            .sort()
            .map((group, index) => (
              <React.Fragment key={`lesson-group-${group}`}>
                <AccordionTitle
                  className="level-content"
                  active={accordionState === index}
                  index={index}
                  onClick={handleClick}
                >
                  <h4 className="lesson-topic-item">
                    <Icon name="dropdown" />
                    <FormattedMessage id="lesson-group" values={{ group }} />
                  </h4>
                </AccordionTitle>
                <AccordionContent active={accordionState === index}>
                  {lessonGroups[group].map(lesson =>
                    rowRenderer({
                      key: `lesson-${lesson.ID}`,
                      lesson_obj: lesson,
                      style: {},
                    }),
                  )}
                </AccordionContent>
              </React.Fragment>
            ))}
        </Accordion>
      )}
    </div>
  )
}

export default Topics
