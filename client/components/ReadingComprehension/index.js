import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Divider, Header, Segment } from 'semantic-ui-react'
import Spinner from 'Components/Spinner'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import ReadingComprehensionQuestion from './ReadingComprehensionQuestion'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { learningLanguageSelector, getTextStyle } from 'Utilities/common'
import './ReadingComprehension.css'

const ReadingComprehensionView = ({ match }) => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)

  const { storyId } = match.params

  const { story, pending } = useSelector(({ stories }) => ({
    story: stories.focused,
    pending: stories.focusedPending,
  }))

  const [focusedConcept, setFocusedConcept] = useState(null)

  useEffect(() => {
    dispatch(getStoryAction(storyId, 'preview'))
  }, [dispatch, storyId])

  if (pending || !story) return <Spinner fullHeight />

  return (
    <main className="reading-comp">
      <Segment className="reading-comp__story" style={getTextStyle(learningLanguage)}>
        <Header
          className="space-between reading-comp__title"
          style={getTextStyle(learningLanguage, 'title')}
        >
          <span className="story-title">
            <span className="pr-sm">{story.title}</span>
          </span>
        </Header>

        <Divider />

        {story.paragraph.map((paragraph, index) => (
          <React.Fragment key={index}>
            <TextWithFeedback
              hideFeedback
              showDifficulty={false}
              mode="preview"
              snippet={paragraph}
              answers={null}
              focusedConcept={focusedConcept}
              show_preview_exer={false}
            />
            <br />
            <br />
          </React.Fragment>
        ))}
      </Segment>

      <section className="reading-comp__questions">
        <ReadingComprehensionQuestion questionNumber={0} defaultOpen={false}>
          <div>Example answer here</div>
        </ReadingComprehensionQuestion>
      </section>
    </main>
  )
}

export default ReadingComprehensionView