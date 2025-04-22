import React from 'react'
import { Checkbox } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedHTMLMessage } from 'react-intl'

import {
  updateWordAudio,
  updateChunkAudio,
  updateChunkContextAudio,
  updateAudioTask,
} from 'Utilities/redux/userReducer'

const ListeningExerciseSettings = () => {
  const dispatch = useDispatch()

  const { data: userData } = useSelector(({ user }) => user)
  const { user } = userData
  const { word_audio, chunk_audio, chunk_context_audio, task_audio } = user

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Checkbox
        toggle
        label={{ children: <FormattedHTMLMessage id="practice-listening-cloze-exercises" /> }}
        checked={task_audio}
        onChange={() => dispatch(updateAudioTask(!task_audio))}
      />
      <Checkbox
        label={{ children: <FormattedHTMLMessage id="select-word-audio-exercise-type" /> }}
        checked={word_audio}
        onChange={() => dispatch(updateWordAudio(!word_audio))}
        disabled={!task_audio}
        style={{ marginLeft: '37px' }}
      />
      <Checkbox
        label={{ children: <FormattedHTMLMessage id="select-chunk-audio-excercise-type" /> }}
        checked={chunk_audio}
        onChange={() => dispatch(updateChunkAudio(!chunk_audio))}
        disabled={!task_audio}
        style={{ marginLeft: '37px' }}
      />
      <Checkbox
        label={{ children: <FormattedHTMLMessage id="select-chunk-context-audio-exercise-type" /> }}
        checked={chunk_context_audio}
        onChange={() => dispatch(updateChunkContextAudio(!chunk_context_audio))}
        disabled={!task_audio}
        style={{ marginLeft: '37px' }}
      />
    </div>
  )
}

export default ListeningExerciseSettings
