import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import { Paper } from '@mui/material'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { resetAnnotations } from 'Utilities/redux/annotationsReducer'
import { getFrozenSnippetsPreview } from 'Utilities/redux/controlledPracticeReducer'
import { getTextStyle, learningLanguageSelector, getMode } from 'Utilities/common'
import PreviousSnippets from '../ControlledStoryEditView/PreviousSnippets'
import ScrollArrow from '../ScrollArrow'

const ControlledStoryEditView = () => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()
  const { id } = useParams()
  const mode = getMode()

  const { focused: story, pending } = useSelector(({ stories }) => stories)

  useEffect(() => {
    dispatch(getStoryAction(id, mode))
    dispatch(getFrozenSnippetsPreview(id))
  }, [learningLanguage])

  useEffect(() => {
    dispatch(resetAnnotations())
  }, [])

  if (!story) return null


  return (
    <div className="cont-tall pt-sm flex-col space-between">
      <div className="justify-center">
        <div className="cont">
          <Paper sx={{ padding: '1em' }}>
            <h3
              style={{
                ...getTextStyle(learningLanguage, 'title'),
                width: '100%',
                paddingRight: '1em',
                marginBottom: 0,
              }}
              data-cy="controlled-story-preview-title"
            >
              {!pending && `${story.title}`}
            </h3>
            {story.url && !pending ? (
              <a target="blank" href={story.url} data-cy="controlled-story-preview-source-link">
                <FormattedMessage id="Source" />
              </a>
            ) : null}
            <PreviousSnippets />

            <ScrollArrow />
          </Paper>
        </div>
      </div>
    </div>
  )
}

export default ControlledStoryEditView
