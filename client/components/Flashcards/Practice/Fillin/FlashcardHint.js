import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import { flashcardColors } from 'Utilities/common'
import { Modal } from 'semantic-ui-react'

const FlashcardHintModal = ({ open, setOpen, hints, displayedHints, setDisplayedHints }) => {
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
    <Modal
      dimmer="inverted"
      centered={false}
      size="small"
      closeIcon={{ style: { top: '1.0535rem', right: '1rem' }, color: 'black', name: 'close' }}
      open={open}
      onClose={() => setOpen(false)}
    >
      <Modal.Header>
        <FormattedMessage id="Hint" />
      </Modal.Header>
      <Modal.Content>
        <div style={{ minHeight: '80px' }} dangerouslySetInnerHTML={{ __html: hints[hintIndex] }} />
        {hints.length > 1 && (
          <div className="flex justify-center mt-nm gap-col-sm">
            <Button disabled={hintIndex === 0} onClick={handlePreviousClick}>
              <FormattedMessage id="previous" />
            </Button>
            <Button disabled={hintIndex === hints.length - 1} onClick={handleNextClick}>
              <FormattedMessage id="next" />
            </Button>
          </div>
        )}
      </Modal.Content>
    </Modal>
  )
}

const FlashcardHint = ({ hints, stage, displayedHints, setDisplayedHints }) => {
  const [showHintModal, setShowHintModal] = useState(false)
  const { foreground } = flashcardColors

  if (!hints || !hints[0]) return <div className="flashcard-hint" />

  return (
    <div className="flashcard-hint">
      <FlashcardHintModal
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
