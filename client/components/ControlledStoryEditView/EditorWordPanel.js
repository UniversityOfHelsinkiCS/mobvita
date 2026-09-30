// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import AppButton from 'Components/AppButton'
import ChatBubble from 'Components/ui/ChatBubble'
import { sanitizeHtml } from 'Utilities/common'
import {
  requestExerciseOptions,
  requestExerciseRemoval,
  setEditorFocusedWord,
} from 'Utilities/redux/controlledPracticeReducer'

/**
 * EditorWordPanel — what the word tooltip says, in the sidebar.
 *
 * Clicking a word in the controlled-story editor still opens its tooltip; this shows the same
 * thing where there is room for it: the word's topics in a note bubble, and "click to add
 * exercise" as a button. The button asks the word itself to open its exercise-type modal (see
 * requestExerciseOptions), because the handlers that create an exercise live in the word.
 */
const EditorWordPanel = () => {
  const dispatch = useDispatch()
  const word = useSelector(({ controlledPractice }) => controlledPractice.editorFocusedWord)
  // The same test the word itself makes to know whether it is already an exercise.
  const hasExercise = useSelector(({ controlledPractice }) =>
    Boolean(controlledPractice.snippets[word?.snippet_id]?.some(t => t.ID === word?.ID)),
  )

  if (!word) return null

  const concepts = word.concepts || []

  return (
    <div style={{ margin: '20px 20px 0 20px' }}>
      {/* The word itself is a heading for the panel, not part of what the bubble says about it. */}
      <h4 className="current-word" style={{ marginBottom: '0.5em', padding: 0 }}>
        {word.surface}
      </h4>

      {/* Outside a chat column the bubble's 85% cap and 14px gutters would make it narrower than
          the buttons below it; here it spans the panel like they do. */}
      <ChatBubble
        variant="note"
        onRemove={() => dispatch(setEditorFocusedWord(null))}
        sx={{ maxWidth: '100%', marginLeft: 0, marginRight: 0 }}
      >
        {concepts.length > 0 ? (
          <>
            <FormattedMessage id="topics-header" />:
            <ul style={{ marginBottom: 0 }}>
              {concepts.map(concept => (
                <li key={concept.concept} dangerouslySetInnerHTML={sanitizeHtml(concept.concept)} />
              ))}
            </ul>
          </>
        ) : (
          <FormattedMessage id="no-topics-available" />
        )}
      </ChatBubble>

      <AppButton
        variant="tan"
        disabled={hasExercise}
        onClick={() => dispatch(requestExerciseOptions(word.ID))}
        data-cy="editor-word-panel-add-exercise"
        sx={{ width: '100%', height: 36, marginTop: '0.75em' }}
      >
        <FormattedMessage id="click-to-add-exercise" />
      </AppButton>

      {/* Replaces the in-text "click to remove the exercise" tooltip. */}
      {hasExercise && (
        <AppButton
          variant="contrast-outline"
          onClick={() => dispatch(requestExerciseRemoval(word.ID))}
          data-cy="editor-word-panel-remove-exercise"
          sx={{ width: '100%', height: 36, marginTop: '0.5em' }}
        >
          <FormattedMessage id="click-to-remove-exercise" />
        </AppButton>
      )}
    </div>
  )
}

export default EditorWordPanel
