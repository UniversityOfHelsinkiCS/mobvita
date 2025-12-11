import React from 'react'
import { useDispatch } from 'react-redux'
import { Button, Popup } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import { images } from 'Utilities/common'

const WordNestButton = ({
  lemma,
  onClick,
  showPopup = true,
  popupMessageId = 'explain-wordnest-modal',
  style = {},
  size = 'mini',
  dataCy = 'nest-button',
}) => {
  const dispatch = useDispatch()
  const intl = useIntl()

  const handleClick = () => {
    console.log('WordNestButton clicked for lemma:', lemma)
    if (onClick) return onClick(lemma)
    dispatch({ type: 'OPEN_WORD_NEST_MODAL', payload: lemma })
  }

  const btn = (
    <Button
      style={{ padding: '5px', ...style }}
      basic
      size={size}
      onClick={handleClick}
      data-cy={dataCy}
    >
      <img src={images.network} alt="network icon" width="32" />
    </Button>
  )

  if (!showPopup) return btn

  return <Popup content={intl.formatMessage({ id: popupMessageId })} trigger={btn} />
}

export default WordNestButton