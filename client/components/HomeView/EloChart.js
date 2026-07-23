import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined'
import { cefrNum2Cefr } from 'Utilities/common'
import CustomTooltip from 'Components/CustomTooltip'
import Medal from 'Components/Achievements/Medal'
import { colors, font } from 'Assets/mui_theme/designTokens'

const CARD_BG = colors.card
const TRACK = '#E4E1D3' // ring / gridline track

// Format fractional hours as "h:mm" (2.22 → "2:13").
const formatHM = hours => {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return `${h}:${String(m).padStart(2, '0')}`
}

const MEDAL_TIERS = ['bronze', 'silver', 'gold', 'platinum', 'diamond']

// CEFR badge with an XP-progress ring (progress 0..1).
const CefrRing = ({ cefr, progress }) => {
  const size = 56
  const stroke = 4
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={TRACK} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={colors.ink}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(1, Math.max(0, progress)))}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: font.family,
          fontWeight: 600,
          fontSize: 15,
          color: colors.ink,
        }}
      >
        {cefr}
      </div>
    </div>
  )
}

// Lightweight practiced-hours bar chart with 1h/2h gridlines.
const HoursBars = ({ weeks }) => {
  const CHART_H = 150
  const maxHours = Math.max(1, ...weeks.map(w => w.hours))
  const scale = Math.max(2, Math.ceil(maxHours))
  const gridlines = []
  for (let h = 1; h <= scale; h += 1) gridlines.push(h)

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {/* y-axis labels + gridlines */}
      <div style={{ position: 'relative', width: '100%', height: CHART_H, marginLeft: 34 }}>
        {gridlines.map(h => (
          <div
            key={h}
            style={{ position: 'absolute', left: 0, right: 0, bottom: (h / scale) * CHART_H }}
          >
            <span
              style={{
                position: 'absolute',
                left: -34,
                top: -9,
                fontSize: 12,
                color: colors.muted,
                fontFamily: font.family,
              }}
            >
              {h} h
            </span>
            <div style={{ borderTop: `1px solid ${TRACK}`, width: '100%' }} />
          </div>
        ))}
        {/* bars */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            gap: 8,
          }}
        >
          {weeks.map(w => (
            <div
              key={w.week}
              title={`${formatHM(w.hours)} · week ${w.week}`}
              style={{
                flex: 1,
                maxWidth: 44,
                height: `${(w.hours / scale) * 100}%`,
                minHeight: w.hours > 0 ? 8 : 0,
                backgroundColor: colors.green,
                borderRadius: 12,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const last = arr => (arr && arr.length ? arr[arr.length - 1] : null)

const statStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 16,
  fontWeight: 600,
  cursor: 'default',
}

const EloChart = ({ width }) => {
  const navigate = useNavigate()
  const user = useSelector(({ user }) => user.data.user)
  const { flashcardHistory, irtExerciseHistory, eloExerciseHistory, daysStreaked } = useSelector(
    state => state.practiceHistory
  )

  const streak = daysStreaked ?? 0
  const abilityRaw = last(irtExerciseHistory)?.score ?? last(eloExerciseHistory)?.score ?? 0
  const abilityScore = Math.round(abilityRaw * 10) / 10
  const flashcardScore = last(flashcardHistory)?.score ?? 0

  const weeklyTimes = user.weekly_times || []
  const weeks = weeklyTimes
    .map(e => ({ week: e.week, hours: e.practice_time || 0 }))
    .reverse()
    .slice(-6)

  const latestHours = weeks.length ? weeks[weeks.length - 1].hours : 0

  const cefrScore = user.current_proficiency_score ?? user.current_cefr
  const cefr = cefrNum2Cefr(cefrScore) || '—'

  const level = user.level ?? 0
  const requiredXp = (((level + 1) * 50 - 25) ** 2 - 625) / 100
  const xpProgress = requiredXp > 0 ? (requiredXp - (user.xp_to_next_level ?? 0)) / requiredXp : 0

  const earnedTiers = (user.achievements || []).reduce(
    (acc, a) => {
      MEDAL_TIERS.forEach((tier, i) => {
        if (a.level >= i + 1) acc[tier] += 1
      })
      return acc
    },
    { bronze: 0, silver: 0, gold: 0, platinum: 0, diamond: 0 }
  )
  const medals = MEDAL_TIERS.filter(tier => earnedTiers[tier] > 0)

  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        backgroundColor: CARD_BG,
        borderRadius: 30,
        padding: '24px 28px',
        fontFamily: font.family,
        color: colors.ink,
      }}
    >
      {/* Header: title + CEFR ring */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0, fontFamily: font.family, fontSize: 28, fontWeight: 500 }}>
          <FormattedMessage id="Progress" />
        </h2>
        <CefrRing cefr={cefr} progress={xpProgress} />
      </div>

      {/* Streak / ability / flashcard scores */}
      <div style={{ display: 'flex', gap: 28, marginTop: 16 }}>
        <CustomTooltip permanent placement="top" keyId="progress-streak-explanation">
          <span style={statStyle}>
            <LocalFireDepartmentIcon style={{ fontSize: 18 }} />
            {streak}
          </span>
        </CustomTooltip>
        <CustomTooltip permanent placement="top" keyId="progress-ability-explanation">
          <span style={statStyle}>
            <StarBorderIcon style={{ fontSize: 18 }} />
            {abilityScore}
          </span>
        </CustomTooltip>
        <CustomTooltip permanent placement="top" keyId="progress-flashcard-explanation">
          <span style={statStyle}>
            <StyleOutlinedIcon style={{ fontSize: 18 }} />
            {flashcardScore}
          </span>
        </CustomTooltip>
      </div>

      {/* Practiced hours */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
        <span style={{ color: colors.muted, fontSize: 15 }}>
          <FormattedMessage id="Practiced hours" />
        </span>
        <span
          style={{
            backgroundColor: colors.panel,
            color: colors.ink,
            borderRadius: 999,
            padding: '2px 12px',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {formatHM(latestHours)}
        </span>
      </div>

      <div style={{ marginTop: 12 }}>
        <HoursBars weeks={weeks} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            gap: 8,
            marginLeft: 46,
            marginTop: 6,
          }}
        >
          {weeks.map(w => (
            <span
              key={w.week}
              style={{ flex: 1, maxWidth: 44, textAlign: 'center', fontSize: 12, color: colors.muted }}
            >
              {w.week}
            </span>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div style={{ marginTop: 20 }}>
        <div style={{ color: colors.muted, fontSize: 15, marginBottom: 8 }}>
          <FormattedMessage id="Achievements" />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {medals.length ? (
            medals.map(tier => (
              <div key={tier} style={{ width: 40 }}>
                <Medal medal={tier} />
              </div>
            ))
          ) : (
            <span style={{ color: colors.muted, fontSize: 13 }}>—</span>
          )}
        </div>
      </div>

      {/* See all stats */}
      <button
        type="button"
        data-cy="see-all-stats"
        onClick={() => navigate('/profile/progress')}
        style={{
          marginTop: 20,
          width: '100%',
          padding: '12px',
          border: `1px solid ${colors.ink}`,
          borderRadius: 999,
          backgroundColor: 'transparent',
          color: colors.ink,
          fontFamily: font.family,
          fontWeight: 600,
          fontSize: 16,
          cursor: 'pointer',
        }}
      >
        <FormattedMessage id="see-all-stats" />
      </button>
    </div>
  )
}

export default EloChart
