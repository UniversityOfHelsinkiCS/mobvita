import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React, { useMemo, useCallback, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckIcon from '@mui/icons-material/Check'
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import CustomTooltip from 'Components/CustomTooltip'
import { FormattedMessage } from 'react-intl';
import { sanitizeHtml, flashcardColors } from 'Utilities/common'
import { deleteFlashcard, recordFlashcardAnswer } from 'Utilities/redux/flashcardReducer'
import { changeFlashcardStage } from 'Utilities/redux/flashcardListReducer'


const FlashcardListItem = ({ card, handleEdit }) => {
  const { lemma, _id, stage, lan_in, lan_out } = card
  const { background } = flashcardColors

  const dispatch = useDispatch()

  const cardContainerRef = useRef(null)
  const [expanded, setExpanded] = useState(false)

  const scrollToCardTopIfOpenedAndOffscreen = useCallback(() => {
    const cardEl = cardContainerRef.current
    if (!cardEl) return

    const HEADER_OFFSET_PX = 52

    const isCollapseOpen = collapseEl =>
      Boolean(collapseEl) && collapseEl.classList.contains('MuiCollapse-entered')

    const tryScroll = () => {
      const el = cardContainerRef.current
      if (!el) return

      const collapseEl = el.querySelector('.MuiCollapse-root')
      if (!isCollapseOpen(collapseEl)) return

      const topInViewport = el.getBoundingClientRect().top

      if (topInViewport < 0) {
        const targetY = topInViewport + window.pageYOffset - HEADER_OFFSET_PX
        window.scrollTo({ top: targetY, behavior: 'smooth' })
      }
    }

    ;[0, 50, 200, 400].forEach(ms => window.setTimeout(tryScroll, ms))
  }, [])

  const handleAccordionChange = (e, isExpanded) => {
    setExpanded(isExpanded)
    if (isExpanded) scrollToCardTopIfOpenedAndOffscreen()
  }

  const handleDelete = e => {
    e.stopPropagation()
    dispatch(deleteFlashcard(_id))
  }

  const handleKnowFlashcard = e => {
    e.stopPropagation()
    const answerDetails = {
      correct: true,
      answer: null,
      exercise: 'knowing',
      hints_shown: 0,
      mode: 'trans',
      lemma,
    }
    dispatch(recordFlashcardAnswer(lan_in, lan_out, answerDetails))
    dispatch(changeFlashcardStage(_id, 4))
  }

  const handleNotKnowFlashcard = e => {
    e.stopPropagation()
    const answerDetails = {
      correct: false,
      answer: null,
      exercise: 'knowing',
      hints_shown: 0,
      mode: 'trans',
      lemma,
    }
    dispatch(recordFlashcardAnswer(lan_in, lan_out, answerDetails))
    dispatch(changeFlashcardStage(_id, 0))
  }

  const uniqueGlossListItems = useMemo(
    () => [...new Set(card.glosses)].map(gloss => <li key={gloss}>{gloss}</li>),
    [card]
  )

  const uniqueHintListItems = useMemo(
    () =>
      [...new Set(card.hint.map(hintObject => hintObject.hint))].map(hint => (
        <li key={hint} dangerouslySetInnerHTML={sanitizeHtml(hint)} />
      )),
    [card]
  )

  return (
    <Accordion
      ref={cardContainerRef}
      expanded={expanded}
      onChange={handleAccordionChange}
      disableGutters
      square
      sx={{
        backgroundColor: background[stage],
        boxShadow: 'none',
        marginBottom: '1px',
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: 'transparent',
          '& .MuiAccordionSummary-content': {
            display: 'flex',
            alignItems: 'center',
            margin: 0,
          },
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CustomTooltip placement="top" title={<FormattedHTMLMessage id="explain-i-know-word" />}>
            <span style={{ display: 'inline-flex' }}>
              <CheckIcon
                onClick={handleKnowFlashcard}
                sx={{ cursor: 'pointer' }}
              />
            </span>
          </CustomTooltip>
          <CustomTooltip placement="top" title={<FormattedHTMLMessage id="explain-i-dont-know-word" />}>
            <span style={{ display: 'inline-flex' }}>
              <HelpOutlineIcon
                onClick={handleNotKnowFlashcard}
                sx={{ cursor: 'pointer' }}
              />
            </span>
          </CustomTooltip>
        </div>

        <div
          style={{
            flex: 1,
            textAlign: 'center',
            paddingLeft: '0.5rem',
            minWidth: 0,
          }}
        >
          {lemma}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <EditOutlinedIcon
            sx={{ cursor: 'pointer' }}
            onClick={e => {
              e.stopPropagation()
              handleEdit(card)
            }}
          />

          <CustomTooltip placement="top" title={<FormattedMessage id="remove-card-tooltip" />}>
            <span style={{ display: 'inline-flex' }}>
              <DeleteOutlineIcon
                onClick={handleDelete}
                sx={{ cursor: 'pointer' }}
              />
            </span>
          </CustomTooltip>
        </div>
      </AccordionSummary>

      <AccordionDetails>
        <span className="bold">
          <FormattedMessage id="Translations" />
        </span>
        <ul>{uniqueGlossListItems}</ul>
        {card.hint.length > 0 && (
          <div>
            <span className="bold">
              <FormattedMessage id="Hints" />
            </span>
            <ul>{uniqueHintListItems}</ul>
          </div>
        )}
      </AccordionDetails>
    </Accordion>
  )
}

export default FlashcardListItem
