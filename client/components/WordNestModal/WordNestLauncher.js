import React, { useEffect, useMemo, useState } from 'react'
import { Button, Popup } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'
import { images } from 'Utilities/common'
import { getTranslationAction } from 'Utilities/redux/translationReducer'
import WordNestModal from 'Components/WordNestModal'

const WordNestLauncher = ({
  lemma,
  translation,
  inCrossword = false,
  popupMessageId = 'explain-wordnest-modal',
  className = '',
  buttonStyle = {},
  divStyle = { alignSelf: 'flex-start', marginLeft: '1em' },
  buttonSize = 'mini',
  dataCy = 'nest-button',
}) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [wordToCheck, setWordToCheck] = useState('')

  const joinedTranslationLemmas = useMemo(() => {
    if (!translation || translation === 'no-clue-translation') return ''
    if (!Array.isArray(translation)) return ''
    return translation
      .filter(t => t?.lemma)
      .map(t => t.lemma)
      .join('+')
  }, [translation])

  useEffect(() => {
    if (!inCrossword && joinedTranslationLemmas) {
      setWordToCheck(joinedTranslationLemmas)
    } else if (lemma) {
      setWordToCheck(lemma)
    }
  }, [inCrossword, joinedTranslationLemmas, lemma])

  const handleClick = () => {
    setWordToCheck(lemma)
    if (lemma) {
      dispatch(getTranslationAction(lemma))
    }
    setOpen(true)
  }

  return (
    <>
      <Popup
        content={intl.formatMessage({ id: popupMessageId })}
        trigger={
          <div style={divStyle}>
            <Button
              className={className}
              style={{ padding: '5px', outline: '1px solid #ccc', ...buttonStyle }}
              size={buttonSize}
              onClick={handleClick}
              data-cy={dataCy}
            >
              <img src={images.network} alt="network icon" width="32" />
            </Button>
          </div>
        }
      />

      <WordNestModal
        wordToCheck={wordToCheck}
        setWordToCheck={setWordToCheck}
        open={open}
        setOpen={setOpen}
      />
    </>
  )
}

export default WordNestLauncher