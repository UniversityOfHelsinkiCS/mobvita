import React from 'react'
import { Checkbox } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' /* , margin: '40px 0' */ }}>
      <Checkbox
        toggle
        label={
          <label>
            Practice <b>Listening</b>
          </label>
        }
        checked={task_audio}
        onChange={() => dispatch(updateAudioTask(!task_audio))}
      />
      <Checkbox
        label="Listen to words with context"
        checked={word_audio}
        onChange={() => dispatch(updateWordAudio(!word_audio))}
        disabled={!task_audio}
        style={{ marginLeft: '37px' }}
      />
      <Checkbox
        label="Listen to phrases without context"
        checked={chunk_audio}
        onChange={() => dispatch(updateChunkAudio(!chunk_audio))}
        disabled={!task_audio}
        style={{ marginLeft: '37px' }}
      />
      <Checkbox
        label="Listen to phrases with context"
        checked={chunk_context_audio}
        onChange={() => dispatch(updateChunkContextAudio(!chunk_context_audio))}
        disabled={!task_audio}
        style={{ marginLeft: '37px' }}
      />
    </div>
  )
}

export default ListeningExerciseSettings
