// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import AppMenu from 'Components/ui/AppMenu'
import CustomTooltip from 'Components/CustomTooltip'
import { rowStyles } from 'Components/ui/menuRow'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
import { getLessonTopics } from 'Utilities/redux/lessonsReducer'
import { colors, font } from 'Assets/mui_theme/designTokens'

// Outline pill trigger — same look as the story preview's "All Topics In Text" control.
const Trigger = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  padding: '7px 16px',
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: 999,
  fontFamily: font.family,
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer',
  backgroundColor: 'transparent',
  color: colors.ink,
  border: `1px solid ${colors.ink}`,
  transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
  '&:hover': { backgroundColor: colors.green, borderColor: colors.green, color: colors.ink },
  '& .topics-chevron': { fontSize: 20, flexShrink: 0 },
})

// A topic row laid out as a 2-column table (name | performance %). `whiteSpace: normal` +
// `minmax(0, 1fr)` let the name wrap to the next line so nothing overflows horizontally.
const TopicRow = styled('div')({
  ...rowStyles({ selected: false }),
  cursor: 'default',
  // Softer, smaller corners on the hover pill than the shared row's full pill.
  borderRadius: 12,
  padding: '9px 14px',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  alignItems: 'start',
  columnGap: 12,
  whiteSpace: 'normal',
})

const getLessonPerformance = (correct, total) => {
  if (!total) return 0
  return correct / total
}

const getPerformanceColor = (correct, total) => {
  const perc = getLessonPerformance(correct, total)
  if (perc >= 0.75) return 'green'
  if (perc >= 0.5) return 'limegreen'
  if (perc >= 0.25) return 'orange'
  if (perc > 0) return 'red'
  return colors.muted
}

const LessonPracticeTopicsHelp = ({ selectedTopics, always_show = false }) => {
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  const [open, setOpen] = useState(false)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { topics: lessonTopics } = useSelector(({ lessons }) => lessons)
  const snippets = useSelector(({ snippets }) => snippets)
  const topics =
    lessonTopics && selectedTopics
      ? lessonTopics.filter(l => selectedTopics.includes(l.topic_id))
      : []

  useEffect(() => {
    dispatch(getLessonTopics())
  }, [snippets.focused])

  // Flatten each topic's semicolon-separated concepts into rows; the performance % shows on the
  // first concept of a topic only (the number column), coloured by score.
  const topicRows = []
  topics.forEach((topic, i) => {
    const concepts = topic.topic.split(';')
    const percent = Math.round(getLessonPerformance(topic.correct, topic.total) * 100)
    const color = getPerformanceColor(topic.correct, topic.total)
    concepts.forEach((concept, k) => {
      const name = concept.charAt(0).toUpperCase() + concept.slice(1)
      topicRows.push({ key: `${i}-${k}`, name, percent: k === 0 ? percent : null, color })
    })
  })

  if (width < 1024 && !always_show) return null

  const trigger = (
    // The whole trigger carries the explanation tooltip (moved off the old info icon). `permanent`
    // so it always shows and AppMenu's injected onClick still reaches the button.
    <CustomTooltip keyId="story-top-topics-explain" placement="top" permanent>
      <Trigger type="button" data-cy="lesson-practice-topics-toggle">
        <span style={{ whiteSpace: 'nowrap' }}>
          <FormattedMessage id="topics-header" />
        </span>
        {/* Same button opens and closes the menu; the arrow flips to reflect the state. */}
        {open ? (
          <KeyboardArrowUpIcon className="topics-chevron" />
        ) : (
          <KeyboardArrowDownIcon className="topics-chevron" />
        )}
      </Trigger>
    </CustomTooltip>
  )

  return (
    <div className="lesson-topic-box">
      <AppMenu trigger={trigger} matchTriggerWidth disableScrollLock onOpenChange={setOpen}>
        <div
          data-cy="lesson-practice-topics-list"
          style={{ width: '100%', maxHeight: 260, overflowY: 'auto', overflowX: 'hidden' }}
        >
          {topicRows.map(row => (
            <TopicRow key={row.key} style={getTextStyle(learningLanguage)}>
              <span
                style={{ minWidth: 0, overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                dangerouslySetInnerHTML={{ __html: row.name }}
              />
              <span style={{ color: row.color, fontWeight: 600 }}>
                {row.percent !== null ? `${row.percent}%` : ''}
              </span>
            </TopicRow>
          ))}
        </div>
      </AppMenu>
    </div>
  )
}

export default LessonPracticeTopicsHelp
