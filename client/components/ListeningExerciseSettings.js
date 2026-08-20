import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import React from 'react'
import { FormControlLabel } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import AppSwitch from 'Components/ui/AppSwitch'
import AppCheckbox from 'Components/ui/AppCheckbox'
import { colors } from 'Assets/mui_theme/designTokens'
import {
  updateWordAudio,
  updateChunkAudio,
  updateChunkContextAudio,
  updateAudioTask,
} from 'Utilities/redux/userReducer'

const labelSx = { color: colors.ink }

const ListeningExerciseSettings = () => {
  const dispatch = useDispatch()

  const { data: userData } = useSelector(({ user }) => user)
  const { user } = userData
  const { word_audio, chunk_audio, chunk_context_audio, task_audio } = user

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <FormControlLabel
        control={
          <AppSwitch checked={task_audio} onChange={() => dispatch(updateAudioTask(!task_audio))} />
        }
        label={<FormattedHTMLMessage id="practice-listening-cloze-exercises" />}
        sx={{ '& .MuiFormControlLabel-label': { marginLeft: '0.5em', ...labelSx } }}
      />
      <FormControlLabel
        control={
          <AppCheckbox
            checked={word_audio}
            onChange={() => dispatch(updateWordAudio(!word_audio))}
            disabled={!task_audio}
          />
        }
        label={<FormattedHTMLMessage id="select-word-audio-exercise-type" />}
        disabled={!task_audio}
        sx={{ marginLeft: '37px', '& .MuiFormControlLabel-label': labelSx }}
      />
      <FormControlLabel
        control={
          <AppCheckbox
            checked={chunk_audio}
            onChange={() => dispatch(updateChunkAudio(!chunk_audio))}
            disabled={!task_audio}
          />
        }
        label={<FormattedHTMLMessage id="select-chunk-audio-excercise-type" />}
        disabled={!task_audio}
        sx={{ marginLeft: '37px', '& .MuiFormControlLabel-label': labelSx }}
      />
      <FormControlLabel
        control={
          <AppCheckbox
            checked={chunk_context_audio}
            onChange={() => dispatch(updateChunkContextAudio(!chunk_context_audio))}
            disabled={!task_audio}
          />
        }
        label={<FormattedHTMLMessage id="select-chunk-context-audio-exercise-type" />}
        disabled={!task_audio}
        sx={{ marginLeft: '37px', '& .MuiFormControlLabel-label': labelSx }}
      />
    </div>
  )
}

export default ListeningExerciseSettings
