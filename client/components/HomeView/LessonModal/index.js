import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, ModalContent, CardGroup, CardContent, Card, Icon, Popup } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'

import { images, cefrNumberToLevel } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import { setLessonInstance } from 'Utilities/redux/lessonInstanceReducer'

const LessonModal = ({ open, setOpen }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const {
    grade,
    current_cefr: currentCefr,
    vocabulary_score: vocabularyScore,
  } = useSelector(state => state.user.data.user)
  const { lessons, lesson_semantics: lessonSemantics } = useSelector(({ metadata }) => metadata)

  const bigScreen = useWindowDimensions().width > 600

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

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      dimmer="inverted"
      style={{ maxWidth: '590px' }}
    >
      <ModalContent style={{ background: 'rgb(230, 235, 233)' }}>
        <CardGroup itemsPerRow={bigScreen ? 2 : 1}>
          <Card>
            <CardContent>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '50px 200px',
                  gridTemplateRows: '50px 50px 40px',
                }}
              >
                <img
                  src={images.readingBook}
                  alt="open book"
                  style={{ maxWidth: '40px', maxHeight: '40px' }}
                />
                <h3 style={{ alignSelf: 'center', fontWeight: '700' }}>Jump right in!</h3>
                <Popup
                  trigger={
                    <Icon name="info circle" style={{ gridColumn: '2 / 3', GridRow: '2 / 3' }} />
                  }
                  content="Start practicing with lessons for your current language level"
                  inverted
                  basic
                />
                <Button
                  variant="primary"
                  style={{ gridColumn: '2 / 3', GridRow: '3 / 4', width: '80%' }}
                  type="button"
                  onClick={handleStartClick}
                >
                  <FormattedMessage id="start" />
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '50px 200px',
                  gridTemplateRows: '50px 50px 40px',
                }}
              >
                <img
                  src={images.settingsIcon}
                  alt="open book"
                  style={{ maxWidth: '40px', maxHeight: '40px' }}
                />
                <h3 style={{ alignSelf: 'center', fontWeight: '700' }}>Customize</h3>
                <Popup
                  trigger={
                    <Icon name="info circle" style={{ gridColumn: '2 / 3', GridRow: '2 / 3' }} />
                  }
                  content="Create your own custom lesson where you decide what to practice"
                  inverted
                  basic
                />
                <Button
                  variant="secondary"
                  style={{ gridColumn: '2 / 3', GridRow: '3 / 4', width: '80%' }}
                  type="button"
                  onClick={() => history.push('/lessons/library')}
                >
                  <FormattedMessage id="lesson-setup" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardGroup>
      </ModalContent>
    </Modal>
  )
}

export default LessonModal
