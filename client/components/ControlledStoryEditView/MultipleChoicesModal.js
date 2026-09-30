// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { FormattedMessage, useIntl } from 'react-intl'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import AppRadio from 'Components/ui/AppRadio'
import AppTextField from 'Components/ui/AppTextField'
import CustomTooltip from 'Components/CustomTooltip'
import { colors } from 'Assets/mui_theme/designTokens'
import useWindowDimension from 'Utilities/windowDimensions'
import MCFeedbackList from './MCFeedbackList'
import AddFeedbackInput from './AddFeedbackInput'

// A ready-made set reads as a row of chips; only the custom set is typed into.
const ChoiceChip = ({ value }) => (
  <Box
    sx={{
      padding: '6px 14px',
      borderRadius: 999,
      backgroundColor: colors.panel,
      border: `1px solid ${colors.cardBorder}`,
      fontSize: 15,
      color: colors.ink,
      whiteSpace: 'nowrap',
    }}
  >
    {value}
  </Box>
)

// One selectable set: its radio, then whatever the set holds. Rows on a wide screen, a column on a
// narrow one — which is all the two duplicated branches used to differ by.
const ChoiceSet = ({ checked, onSelect, dataCy, bigScreen, children }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75em',
      padding: '0.5em 0',
      borderBottom: `1px solid ${colors.cardBorder}`,
    }}
  >
    <AppRadio
      slotProps={{ input: { 'data-cy': dataCy } }}
      sx={{ p: 0, mt: '0.35em' }}
      onChange={onSelect}
      checked={checked}
    />
    <Box
      sx={{
        display: 'flex',
        flexDirection: bigScreen ? 'row' : 'column',
        flexWrap: 'wrap',
        gap: '0.5em',
        flex: 1,
        minWidth: 0,
      }}
    >
      {children}
    </Box>
  </Box>
)

const MultipleChoiceModal = ({
  open,
  setOpen,
  handleAddMultichoiceExercise,
  word,
  analyticChunkWord,
  showValidationMessage,
}) => {
  const intl = useIntl()
  const [customMultiChoice1, setCustomMultiChoice1] = useState('')
  const [customMultiChoice2, setCustomMultiChoice2] = useState('')
  const [customMultiChoice3, setCustomMultiChoice3] = useState('')
  const [chosenSet, setChosenSet] = useState(word.choices ? Object.keys(word.choices)[0] : 'custom')
  const [feedbackList, setFeedbackList] = useState([])
  const [customFeedback, setCustomFeedback] = useState('')
  const bigScreen = useWindowDimension().width >= 650

  const addFeedback = () => {
    setFeedbackList(feedbackList.concat(customFeedback))
    setCustomFeedback('')
  }

  const removeFeedback = index =>
    setFeedbackList(feedbackList.filter((feedback, feedbackIndex) => feedbackIndex !== index))

  const closeModal = () => {
    setOpen(false)
  }

  const handleSubmitChoices = async () => {
    if (chosenSet === 'custom') {
      const customSet = [
        analyticChunkWord?.surface || word.surface,
        customMultiChoice1,
        customMultiChoice2,
        customMultiChoice3,
      ]
      handleAddMultichoiceExercise(
        customSet.filter(choice => choice !== ''),
        word.surface,
        'custom_concept_id',
        feedbackList,
      )
    } else if (chosenSet === 'stress') {
      handleAddMultichoiceExercise(word.stress, word.stressed, 'Stress-*', feedbackList)
    } else {
      handleAddMultichoiceExercise(word.choices[chosenSet], word.surface, chosenSet, feedbackList)
    }
  }

  const handleFormSubmit = event => {
    event.preventDefault()
    handleSubmitChoices()
  }

  const correctChoice = analyticChunkWord?.surface || word.surface
  const customFields = [
    [customMultiChoice1, setCustomMultiChoice1],
    [customMultiChoice2, setCustomMultiChoice2],
    [customMultiChoice3, setCustomMultiChoice3],
  ].map(([value, onChange], index) => ({
    value,
    onChange,
    dataCy: `mc-modal-custom-choice-${index + 1}`,
  }))

  return (
    <AppDialog
      open={open}
      onClose={closeModal}
      title={
        // The explanation the info icon used to carry sits on the title itself.
        <CustomTooltip permanent title={intl.formatMessage({ id: 'multiple-choice-tooltip' })}>
          <span>
            <FormattedMessage id="pick-choices" />
          </span>
        </CustomTooltip>
      }
      subtitle={correctChoice}
      subtitleSx={{ color: colors.muted, fontSize: 16 }}
      titleSx={{ px: '40px', pt: '32px' }}
      contentSx={{ px: '40px', pb: '32px' }}
      closeDataCy="mc-modal-close"
      data-cy="mc-modal"
    >
      <form onSubmit={handleFormSubmit}>
        {word.choices &&
          Object.keys(word.choices).map(key => (
            <ChoiceSet
              key={key}
              dataCy={`mc-modal-choice-set-${key}`}
              bigScreen={bigScreen}
              checked={chosenSet === key}
              onSelect={() => setChosenSet(key)}
            >
              {word.choices[key]
                .filter(choice => choice !== analyticChunkWord?.surface || word.surface)
                .map(choice => (
                  <ChoiceChip key={choice} value={choice} />
                ))}
            </ChoiceSet>
          ))}

        {word.stress && word.stressed && (
          <ChoiceSet
            dataCy="mc-modal-choice-set-stress"
            bigScreen={bigScreen}
            checked={chosenSet === 'stress'}
            onSelect={() => setChosenSet('stress')}
          >
            {word.stress.map(choice => (
              <ChoiceChip key={choice} value={choice} />
            ))}
          </ChoiceSet>
        )}

        {/* The custom set: the correct form is fixed, the three distractors are typed in. */}
        <ChoiceSet
          dataCy="mc-modal-choice-set-custom"
          bigScreen={bigScreen}
          checked={chosenSet === 'custom'}
          onSelect={() => setChosenSet('custom')}
        >
          <ChoiceChip value={correctChoice} />
          {customFields.map(field => (
            <AppTextField
              key={field.dataCy}
              value={field.value}
              onChange={({ target }) => field.onChange(target.value)}
              inputProps={{ 'data-cy': field.dataCy }}
              sx={{ flex: bigScreen ? '1 1 120px' : '1 1 auto', minWidth: 120 }}
            />
          ))}
        </ChoiceSet>

        {showValidationMessage && (
          <Box sx={{ color: colors.error, mt: '0.75em' }} data-cy="mc-modal-validation-message">
            <FormattedMessage id="multiple-choice-validation" />
          </Box>
        )}

        <AddFeedbackInput
          addFeedback={addFeedback}
          customFeedback={customFeedback}
          setCustomFeedback={setCustomFeedback}
        />
        <MCFeedbackList feedbackList={feedbackList} removeFeedback={removeFeedback} />

        <AppButton type="submit" data-cy="mc-modal-submit" sx={{ width: '100%', height: 36 }}>
          <FormattedMessage id="Submit" defaultMessage="Submit" />
        </AppButton>
      </form>
    </AppDialog>
  )
}

export default MultipleChoiceModal
