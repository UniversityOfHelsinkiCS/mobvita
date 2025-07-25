import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CardGroup, CardContent, Card, Icon, Popup } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'

import { images, cefrNumberToLevel } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import { setLessonInstance, setLessonStep } from 'Utilities/redux/lessonInstanceReducer'

import './LessonStartMenuStyles.css'

const LessonStartMenu = ({ setOpen }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const {
    grade,
    current_cefr: currentCefr,
    vocabulary_score: vocabularyScore,
  } = useSelector(state => state.user.data.user)
  const { lessons, lesson_semantics: lessonSemantics } = useSelector(({ metadata }) => metadata)

  const bigScreen = useWindowDimensions().width > 1000

  const recommendedGrammarLevel = cefrNumberToLevel(currentCefr) || cefrNumberToLevel(grade) || 1

  const getTopicsByLevel = () => {
    const levelTopics = lessons.reduce((groups, lesson) => {
      const groupName = lesson.group[0]
      if (!groups[groupName]) {
        groups[groupName] = []
      }
      lesson.topics.forEach(topic => {
        groups[groupName].push(topic)
      })
      return groups
    }, {})

    return levelTopics
  }

  const handleStartClick = () => {
    const payload = {
      semantic: lessonSemantics,
      vocab_diff: vocabularyScore,
      topic_ids: getTopicsByLevel()[recommendedGrammarLevel],
    }
    dispatch(setLessonInstance(payload))
    history.push('/lesson/practice')
    setOpen(false)
  }

  const handleLessonSetupClick = () => {
    dispatch(setLessonStep(0))
    setOpen(false)
  }

  return (
    <div className="lesson-start-menu-container">
      <CardGroup itemsPerRow={bigScreen ? 2 : 1}>
        <Card>
          <CardContent>
            <div className="card-content">
              <img src={images.readingBook} alt="open book" />
              <div className="card-content-header">
                <span>
                  <FormattedMessage id="lesson-quick-start-title" />
                </span>
                <Popup
                  trigger={<Icon name="info circle" />}
                  content={<FormattedMessage id="lesson-quick-start-info" />}
                  inverted
                  basic
                />
              </div>
              <Button variant="primary" type="button" onClick={handleStartClick}>
                <FormattedMessage id="start" />
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="card-content">
              <img src={images.settingsIcon} alt="open book" />
              <div className="card-content-header">
                <span>
                  <FormattedMessage id="lesson-customize-title" />
                </span>
                <Popup
                  trigger={<Icon name="info circle" />}
                  content={<FormattedMessage id="lesson-customize-info" />}
                  inverted
                  basic
                />
              </div>
              <Button variant="secondary" type="button" onClick={handleLessonSetupClick}>
                <FormattedMessage id="lesson-setup" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </CardGroup>
    </div>
  )
}

export default LessonStartMenu
