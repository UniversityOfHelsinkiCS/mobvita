import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import AppButton from 'Components/AppButton'
import { flashcardColors } from 'Utilities/common'
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'

const FlashcardHintModal = ({ lemma, open, setOpen, hints, displayedHints, setDisplayedHints }) => {
  const dummyHints = [
    'STM:n Pohjola: Norjan hurja tartuntaennuste kuvaa tilannetta, jossa mitään ei rajoiteta – hätäjarrun kahva saa vielä hetken odottaa\n\n##R#\n\nRokotetutkimuskeskuksen johtaja Mika Rämet näkee, että käytännössä kaikki suomalaiset tulevat <strong>altistumaan</strong> koronaviruksen jollekin muunnokselle.',
    'Kuva: Juuso Stoor / Yle\n\nNeljä (4) suurinta <stron…ää tänä viikonloppuna puoluevaltuuston kokouksen.',
    'Jere Forsberg (vasemmalla), Esa-\n\nPekka Mattila, A…i, Aino Tapola ja <strong>Harri</strong> Sopanen.',
  ]

  const [hintIndex, setHintIndex] = useState(0)

  useEffect(() => {
    if (open && !displayedHints.includes(hintIndex)) {
      setDisplayedHints(displayedHints.concat(hintIndex))
    }
  }, [open])

  const handlePreviousClick = () => {
    if (!displayedHints.includes(hintIndex - 1)) {
      setDisplayedHints(displayedHints.concat(hintIndex - 1))
    }
    setHintIndex(hintIndex - 1)
  }

  const handleNextClick = () => {
    if (!displayedHints.includes(hintIndex + 1)) {
      setDisplayedHints(displayedHints.concat(hintIndex + 1))
    }
    setHintIndex(hintIndex + 1)
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            width: '640px',
            maxWidth: 'calc(100vw - 32px)',
          },        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: '1px solid rgba(34, 36, 38, 0.15)',
          padding: '12px 48px 12px 16px',
          textAlign: 'center',
        }}
      >
        <FormattedHTMLMessage id="flashcard-hint-dialog-header" values={{ lemma }} />
        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
          sx={{
            color: '#000000',
            position: 'absolute',
            right: '8px',
            top: '8px',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: '1em 1.5em !important' }}>
        <div className="flex-col space-between" style={{ height: '300px' }}>
          <div dangerouslySetInnerHTML={{ __html: hints[hintIndex] }} />
          {hints.length > 1 && (
            <div className="flex justify-center gap-col-sm">
              <AppButton disabled={hintIndex === 0} onClick={handlePreviousClick}>
                <FormattedMessage id="previous" />
              </AppButton>
              <AppButton disabled={hintIndex === hints.length - 1} onClick={handleNextClick}>
                <FormattedMessage id="next" />
              </AppButton>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

const FlashcardHint = ({ lemma, hints, stage, displayedHints, setDisplayedHints }) => {
  const [showHintModal, setShowHintModal] = useState(false)
  const { foreground } = flashcardColors

  if (!hints || !hints[0]) return <div className="flashcard-hint" />

  return (
    <div className="flashcard-hint">
      <FlashcardHintModal
        lemma={lemma}
        open={showHintModal}
        setOpen={setShowHintModal}
        hints={hints}
        displayedHints={displayedHints}
        setDisplayedHints={setDisplayedHints}
      />
      <button
        type="button"
        className="flashcard-blended-input flashcard-hint-button"
        onClick={() => setShowHintModal(true)}
        style={{ color: foreground[stage] }}
      >
        <FormattedMessage id="Hint" />
      </button>
    </div>
  )
}

export default FlashcardHint
