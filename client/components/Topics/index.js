import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { useIntl, FormattedMessage } from 'react-intl'
import { Icon, Accordion, AccordionTitle, AccordionContent } from 'semantic-ui-react'
import TopicListItem from './TopicListItem'

const Topics = ({ topicInstance, editable, setSelectedTopics, showPerf }) => {
  const intl = useIntl()
  const { lessons } = useSelector(({ metadata }) => metadata)
  const { topics } = useSelector(({ lessons }) => lessons)
  const [filteredLessons, setFilteredLessons] = useState(lessons)
  const [accordionState, setAccordionState] = useState(-1)
  const [searchQuery, setSearchQuery] = useState('')

  const lesson2info = lessons.reduce((obj, lesson) => ({ ...obj, [lesson.ID]: lesson }), {})
  const selectedTopicSet = useMemo(
    () => new Set(topicInstance.topic_ids || []),
    [topicInstance.topic_ids],
  )

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

  // The lesson button is on only when every topic in that lesson is checked.
  const isLessonItemSelected = lesson_id => {
    const lessonTopics = Object.prototype.hasOwnProperty.call(lesson2info, lesson_id)
      ? lesson2info[lesson_id].topics
      : []
    if (lessonTopics.length === 0) return false

    return lessonTopics.every(topic => selectedTopicSet.has(topic))
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

  // Checks or unchecks one topic id everywhere it appears.
  const toggleTopic = topicId => {
    const newTopicIds = new Set(topicInstance.topic_ids || [])

    if (newTopicIds.has(topicId)) {
      newTopicIds.delete(topicId)
    } else {
      newTopicIds.add(topicId)
    }

    setSelectedTopics(Array.from(newTopicIds))
  }

  // Checks every topic id inside one lesson card.
  const includeLesson = LessonId => {
    const lessonTopics = Object.prototype.hasOwnProperty.call(lesson2info, LessonId)
      ? lesson2info[LessonId].topics
      : []

    const newTopicIds = new Set(topicInstance.topic_ids || [])
    lessonTopics.forEach(topic => newTopicIds.add(topic))

    setSelectedTopics(Array.from(newTopicIds))
  }

  // Unchecks every topic id inside one lesson card.
  const excludeLesson = LessonId => {
    const lessonTopics = Object.prototype.hasOwnProperty.call(lesson2info, LessonId)
      ? lesson2info[LessonId].topics
      : []

    const nextTopicIds = (topicInstance.topic_ids || []).filter(id => !lessonTopics.includes(id))

    setSelectedTopics(nextTopicIds)
  }

  // Clears all checked topics.
  const excludeAllTopics = () => {
    setSelectedTopics([])
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
