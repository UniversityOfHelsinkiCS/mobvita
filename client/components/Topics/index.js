import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { useIntl, FormattedMessage } from 'react-intl'
import {
    Icon, Accordion,
    AccordionTitle,
    AccordionContent
} from 'semantic-ui-react'
import TopicListItem from './TopicListItem'

const Topics = ({topicInstance, editable, setSelectedTopics, showPerf}) => {
    const intl = useIntl()
    const { lessons, lesson_topics } = useSelector(({ metadata }) => metadata)
    const { topics } = useSelector(({ lessons }) => lessons)
    const [filteredLessons, setFilteredLessons] = useState(lessons)
    const [accordionState, setAccordionState] = useState(-1)
    const [searchQuery, setSearchQuery] = useState("")
    
    const lesson2info = lessons.reduce((obj, lesson) => ({ ...obj, [lesson.ID]: lesson}), {})
    

    useEffect(() => {
        // Filter lessons based on search query
        if (searchQuery){
          const filtered = lessons.filter(lesson => {
            const lowercaseSearchQuery = searchQuery.toLowerCase();
            const nameMatch = lesson.name.toLowerCase().includes(lowercaseSearchQuery);
            const topicsMatch = lesson.topics.some(topic =>
              topic.toLowerCase().includes(lowercaseSearchQuery)
            );
            return nameMatch || topicsMatch;
          });
          
          setFilteredLessons(filtered);
        } else {
          setFilteredLessons(lessons);
        }
      }, [lessons, searchQuery]);

    const isLessonItemSelected = lesson_id => {
        const lesson_topics = lesson2info?.hasOwnProperty(lesson_id) ? lesson2info[lesson_id]['topics'] : []
        for (let lesson_topic of lesson_topics) {
          if (topicInstance.topic_ids !== undefined && topicInstance.topic_ids?.includes(lesson_topic)) {
            return true;
          }
        }
        return false;
      }
    
    const  calculateLowestScore = topics => {
    if (topics.length === 0) {
        return { score: 0, correct: 0, total: 0 }
    }
    
    const { score, correct, total } = topics.reduce((lowest, topic) => {
        const currentScore = topic.correct / topic.total;
        if (currentScore < lowest.score) {
        return { score: currentScore, correct: topic.correct, total: topic.total };
        }
        return lowest;
    }, { score: topics[0].correct / topics[0].total, correct: topics[0].correct, total: topics[0].total });
    
    return { score, correct, total };
    }

    const lessonGroups = filteredLessons && filteredLessons.reduce((x, y) => {
        (x[y.group] = x[y.group] || []).push(y);
        return x;
      }, {}) || {} 

    const handleClick = (e, props) => {
        const { index } = props
        const newIndex = accordionState === index ? -1 : index
        setAccordionState(newIndex)
    }

    const handleSearchChange = event => {
        setSearchQuery(event.target.value);
    }

    const toggleTopic = topicId => {
        let newTopics
        if (topicInstance.topic_ids.includes(topicId)) {
          newTopics = topicInstance.topic_ids.filter(id => id !== topicId)
        } else {
          newTopics = [...topicInstance.topic_ids, topicId]
        }
    
        setSelectedTopics(newTopics)
      }
    
    const includeLesson = LessonId => {
        const lessonTopics = lesson_topics.filter(lesson => lesson.lessons.includes(LessonId)).map(topic => topic.topic_id);
        let newTopics = topicInstance.topic_ids
        for (let lesson_topic of lessonTopics){
            if (!topicInstance.topic_ids.includes(lesson_topic)){
            newTopics = [...newTopics, lesson_topic]
        }
    }

    setSelectedTopics(newTopics)
    }

    const excludeLesson = LessonId => {
        const lessonTopics = lesson_topics.filter(lesson => lesson.lessons.includes(LessonId)).map(topic => topic.topic_id);
        const newTopics = topicInstance.topic_ids.filter(id => !lessonTopics.includes(id))

        setSelectedTopics(newTopics)
    } 

      const excludeAllTopics = () => {
        setSelectedTopics([])
      }

    const rowRenderer = ({ key, lesson_obj, style }) => {
        if (!lesson_obj) return null
    
        const lowestScore = calculateLowestScore(topics.filter(topic => lesson_obj.topics && lesson_obj.topics?.includes(topic.topic_id)))
        lesson_obj.correct = lowestScore.correct
        lesson_obj.total = lowestScore.total
        return (
          <div
            key={key}
            style={{ ...style, marginBottom: '1.5em' }}
          >
            <TopicListItem
              lesson={lesson_obj}
              lesson_instance={topicInstance}
              selected={isLessonItemSelected(lesson_obj.ID)}
              toggleTopic={toggleTopic}
              includeLesson={includeLesson}f104
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
          variant='primary'
          disabled={
            topicInstance.instancePending ||
            !topicInstance.topic_ids ||
            topicInstance.topic_ids.length === 0 ||
            !editable
          }
          style={{
            cursor: topicInstance.instancePending || !editable
              ? 'not-allowed' : 'pointer',
          }}
          onClick={() => excludeAllTopics()}
        >
          <Icon name="trash alternate" />
          <FormattedMessage id="exclude-all-topics" />
        </Button>

        <input
          type="text"
          placeholder={intl.formatMessage({id: "Search lessons / topics ..." }) }
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
        <Accordion fluid styled style={{background: '#fffaf0'}}>
        {
          Object.keys(lessonGroups).sort().map((group, index) => (
            <>
              <AccordionTitle
                key={`lesson-group-title-${group}`}
                active={accordionState === index}
                index={index}
                onClick={handleClick}
              >
                <h4>
                  <Icon name='dropdown' />
                  <FormattedMessage id='lesson-group' values={{group}}/>
                </h4>
              </AccordionTitle>
              <AccordionContent 
                key={`lesson-group-content-${group}`}
                active={accordionState === index}
              >
                {
                  lessonGroups[group].map((lesson) => (
                    rowRenderer({
                      key: `lesson-${lesson.ID}`,
                      lesson_obj: lesson,
                      style: {}
                    })))
                }
              </AccordionContent>
            </>))
        }     
        </Accordion>
      )}
      
    </div>
  )

}

export default Topics
