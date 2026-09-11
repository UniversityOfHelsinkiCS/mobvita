// React must remain in scope because Vite compiles this project's JSX with the classic runtime.
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useIntl } from 'react-intl'
import AppButton from 'Components/AppButton'
import AppTable from 'Components/ui/AppTable'
import AppTextField from 'Components/ui/AppTextField'
import Spinner from 'Components/Spinner'
import { callApi } from 'Utilities/apiConnection'
import { getLevelLabel, getUsefulContributions, percentage, resemblanceAfterFixes } from './utils'
import './WritingClinic.scss'

const SHORT_EXAMPLE = 'Minä on kaksi koiraa. Minä pidän paljon suomen kieli, mutta se on vaikea.'
const LONG_EXAMPLE =
  'Viime kesänä minä mennä mökille perhe kanssa. Me uimme järvi ja saunoimme joka ilta. ' +
  'Kesä loma oli hyvä, koska luonto on vihreä ja päivä ovat pitkiä.'

const WritingClinic = () => {
  const intl = useIntl()
  const requestRef = useRef(0)
  const [text, setText] = useState('')
  const [meta, setMeta] = useState(null)
  const [metaError, setMetaError] = useState('')
  const [data, setData] = useState(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(new Set())

  const msg = (id, defaultMessage, values) => intl.formatMessage({ id, defaultMessage }, values)

  useEffect(() => {
    let active = true
    callApi('/writing-clinic/meta')
      .then(response => {
        if (active) setMeta(response.data)
      })
      .catch(() => {
        if (active) {
          setMetaError(
            msg(
              'writing-clinic-meta-error',
              'Writing Clinic is currently unavailable. Please try again later.',
            ),
          )
        }
      })
    return () => {
      active = false
    }
  }, [])

  const analyze = async event => {
    event.preventDefault()
    const value = text.trim()
    if (!value || pending) return

    const requestId = ++requestRef.current
    setPending(true)
    setError('')
    setData(null)
    setSelected(new Set())

    try {
      const response = await callApi('/writing-clinic/analyze', 'post', { text: value })
      if (requestRef.current === requestId) setData(response.data)
    } catch (requestError) {
      if (requestRef.current !== requestId) return
      const responseData = requestError.response?.data
      const detail = typeof responseData === 'string' ? responseData : responseData?.detail
      setError(detail || msg('writing-clinic-analysis-error', 'Analysis failed. Please try again.'))
    } finally {
      if (requestRef.current === requestId) setPending(false)
    }
  }

  const plan = data?.plan || {}
  const useful = useMemo(() => getUsefulContributions(plan), [plan])
  const resemblance = data ? resemblanceAfterFixes(plan, selected) : null

  const toggleFix = type => {
    setSelected(current => {
      const next = new Set(current)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  const selectFixes = types => setSelected(new Set(types))

  return (
    <div className="cont-tall flex-col space-between">
      <div className="justify-center">
        <div className="cont writing-clinic-page">
          <h1 className="writing-clinic-heading">
            {msg('writing-clinic-title', 'Writing Clinic')}
          </h1>

          <form className="writing-clinic-card" onSubmit={analyze}>
            <h2 className="writing-clinic-card-title">
              {msg('writing-clinic-prompt-title', 'Write something in Finnish')}
            </h2>
            <p className="writing-clinic-subtitle">
              {msg(
                'writing-clinic-prompt-description',
                'Your text is corrected sentence by sentence, scored for level, and labelled by ' +
                  'error type. Your text is not stored.',
              )}
            </p>
            <AppTextField
              multiline
              minRows={6}
              value={text}
              onChange={event => setText(event.target.value)}
              placeholder={msg(
                'writing-clinic-placeholder',
                'Minä on kaksi koiraa. Viime kesänä minä mennä mökille…',
              )}
              inputProps={{
                maxLength: 20000,
                'aria-label': msg('writing-clinic-text', 'Text to analyse'),
              }}
            />
            <div className="writing-clinic-actions">
              <AppButton type="submit" variant="primary" disabled={!text.trim() || pending}>
                {pending ? <Spinner inline /> : msg('writing-clinic-analyze', 'Analyse')}
              </AppButton>
              <span>{msg('writing-clinic-try-example', 'Try an example:')}</span>
              <AppButton
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setText(SHORT_EXAMPLE)}
              >
                {msg('writing-clinic-short-example', 'Short')}
              </AppButton>
              <AppButton
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setText(LONG_EXAMPLE)}
              >
                {msg('writing-clinic-long-example', 'Longer')}
              </AppButton>
            </div>
            {metaError && (
              <div className="writing-clinic-note warning" role="alert">
                {metaError}
              </div>
            )}
            {meta && !meta.gec_configured && (
              <div className="writing-clinic-note warning" role="status">
                {msg(
                  'writing-clinic-gec-unavailable',
                  'Text correction is not configured on the analysis service.',
                )}
              </div>
            )}
            {error && (
              <div className="writing-clinic-note warning" role="alert">
                {error}
              </div>
            )}
          </form>

          {data && (
            <WritingClinicResults
              data={data}
              meta={meta}
              selected={selected}
              useful={useful}
              resemblance={resemblance}
              toggleFix={toggleFix}
              selectFixes={selectFixes}
              msg={msg}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const WritingClinicResults = ({
  data,
  meta,
  selected,
  useful,
  resemblance,
  toggleFix,
  selectFixes,
  msg,
}) => {
  const plan = data.plan || {}
  const hasPlan = plan.available && plan.logit_now !== undefined
  const levelLabel = level => getLevelLabel(data, level)
  const levels = meta?.levels || [1, 2, 3, 4, 5, 6]
  const contributions = plan.contributions || []
  const selectedErrors = contributions
    .filter(item => selected.has(item.type))
    .reduce((sum, item) => sum + (item.count || 0), 0)
  const gain = hasPlan ? (resemblance - plan.p_now) * 100 : 0
  const maximumEffect = Math.max(
    ...contributions.map(item => Math.abs(item.delta_alone || 0)),
    0.01,
  )

  const levelClass = level => {
    if (data.straddle && (level === data.level || level === data.level_upper)) return 'straddle'
    if (level === data.level) return 'current'
    if (level === data.next_level) return 'target'
    return ''
  }

  return (
    <div aria-live="polite">
      <section className="writing-clinic-card">
        <h2 className="writing-clinic-card-title">
          {msg('writing-clinic-current-level', 'Your level right now')}
        </h2>
        <p className="writing-clinic-subtitle">
          {data.straddle
            ? msg('writing-clinic-level-straddle', 'This text is between {lower} and {upper}.', {
                lower: levelLabel(data.level),
                upper: levelLabel(data.level_upper),
              })
            : msg(
                'writing-clinic-level-description',
                'Assessed from the whole text by the level model.',
              )}
        </p>
        <div className="writing-clinic-levels">
          {levels.map(level => (
            <div key={level} className={`writing-clinic-level ${levelClass(level)}`}>
              <strong>{levelLabel(level)}</strong>
              <small>
                {level === data.level
                  ? msg('writing-clinic-you-are-here', 'You are here')
                  : level === data.next_level
                    ? msg('writing-clinic-your-target', 'Your target')
                    : '\u00a0'}
              </small>
            </div>
          ))}
        </div>

        <div className="writing-clinic-facts">
          <Fact
            label={msg('writing-clinic-errors-found', 'Errors found')}
            value={data.total_errors}
            detail={msg('writing-clinic-in-words', 'in {count} words', { count: data.word_count })}
          />
          <Fact
            label={msg('writing-clinic-one-error-every', 'One error every')}
            value={data.words_per_error ?? '–'}
            detail={msg('writing-clinic-words-unit', 'words')}
          />
          <Fact
            label={msg('writing-clinic-typical-current', 'Typical at {level}', {
              level: levelLabel(data.level),
            })}
            value={data.peer_error_rate ?? '–'}
            detail={msg('writing-clinic-per-100-words', 'per 100 words')}
          />
          <Fact
            label={msg('writing-clinic-typical-target', 'Typical at {level}', {
              level: levelLabel(data.next_level),
            })}
            value={data.target_error_rate ?? '–'}
            detail={msg('writing-clinic-per-100-words', 'per 100 words')}
          />
        </div>

        {hasPlan ? (
          <ResemblanceMeter data={data} plan={plan} resemblance={resemblance} msg={msg} />
        ) : (
          <div className="writing-clinic-note warning">
            {msg(
              'writing-clinic-no-plan',
              'There is not enough reference data to create an improvement plan.',
            )}
          </div>
        )}
      </section>

      {hasPlan && contributions.length > 0 && (
        <section className="writing-clinic-card">
          <h2 className="writing-clinic-card-title">
            {msg('writing-clinic-pick-fixes', 'Pick what to fix')}
          </h2>
          <p className="writing-clinic-subtitle">
            {msg(
              'writing-clinic-pick-description',
              'Select any combination to see its exact effect on the score above.',
            )}
          </p>
          <div className="writing-clinic-selection-actions">
            <AppButton
              size="sm"
              variant="outline"
              onClick={() => selectFixes(useful.slice(0, 3).map(item => item.type))}
            >
              {msg('writing-clinic-select-top', 'Select top 3')}
            </AppButton>
            <AppButton
              size="sm"
              variant="outline"
              onClick={() => selectFixes(useful.map(item => item.type))}
            >
              {msg('writing-clinic-select-all', 'Select everything')}
            </AppButton>
            <AppButton size="sm" variant="outline" onClick={() => selectFixes([])}>
              {msg('writing-clinic-clear', 'Clear')}
            </AppButton>
          </div>
          {useful.map(item => (
            <button
              key={item.type}
              type="button"
              className={`writing-clinic-fix ${selected.has(item.type) ? 'selected' : ''}`}
              aria-pressed={selected.has(item.type)}
              onClick={() => toggleFix(item.type)}
            >
              <span className="writing-clinic-fix-check" aria-hidden="true">
                {selected.has(item.type) ? '✓' : ''}
              </span>
              <span className="writing-clinic-fix-copy">
                <span className="writing-clinic-fix-name">{item.label}</span>
                <span className="writing-clinic-fix-detail">
                  {msg('writing-clinic-error-count-rate', '{count} errors · {rate} per 100 words', {
                    count: item.count,
                    rate: item.your_rate,
                  })}
                </span>
              </span>
              <span className="writing-clinic-fix-gain">
                +{((item.delta_alone || 0) * 100).toFixed(1)}
              </span>
            </button>
          ))}
          <div className="writing-clinic-note">
            {selected.size
              ? msg(
                  'writing-clinic-selection-summary',
                  'Fixing {errors} errors across {types} types changes the score by {gain} ' +
                    'percentage points.',
                  {
                    errors: selectedErrors,
                    types: selected.size,
                    gain: `${gain >= 0 ? '+' : ''}${gain.toFixed(1)}`,
                  },
                )
              : msg(
                  'writing-clinic-nothing-selected',
                  'Nothing selected. Select an error type to see the effect.',
                )}
          </div>
        </section>
      )}

      {contributions.length > 0 && (
        <section className="writing-clinic-card">
          <h2 className="writing-clinic-card-title">
            {msg('writing-clinic-why-order', 'Why that order')}
          </h2>
          <p className="writing-clinic-subtitle">
            {msg(
              'writing-clinic-order-description',
              'An error matters when you make it often and it strongly separates the two levels.',
            )}
          </p>
          <AppTable plain>
            <TableHead>
              <TableRow>
                <TableCell>{msg('writing-clinic-error-type', 'Error type')}</TableCell>
                <TableCell align="right">
                  {msg('writing-clinic-frequency', 'Per 100 words')}
                </TableCell>
                <TableCell align="right">
                  {msg('writing-clinic-level-marker', 'Level marker')}
                </TableCell>
                <TableCell>{msg('writing-clinic-effect', 'Effect')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contributions.map(item => (
                <TableRow key={item.type}>
                  <TableCell>{item.label}</TableCell>
                  <TableCell align="right">{item.your_rate}</TableCell>
                  <TableCell align="right">{Math.abs(item.weight || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`writing-clinic-bar ${item.counterproductive ? 'negative' : ''}`}
                    >
                      <span
                        style={{
                          width: `${(Math.abs(item.delta_alone || 0) / maximumEffect) * 100}%`,
                        }}
                      />
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </AppTable>
        </section>
      )}

      <PeerComparison data={data} levelLabel={levelLabel} msg={msg} />
      <Corrections data={data} msg={msg} />
    </div>
  )
}

const Fact = ({ label, value, detail }) => (
  <div className="writing-clinic-fact">
    <span>{label}</span>
    <strong>{value}</strong>
    <span>{detail}</span>
  </div>
)

const ResemblanceMeter = ({ data, plan, resemblance, msg }) => {
  const current = Math.max(0, Math.min(1, plan.p_now || 0))
  const after = Math.max(0, Math.min(1, resemblance ?? current))
  const lower = Math.min(current, after)
  const width = Math.abs(after - current)
  return (
    <div className="writing-clinic-meter">
      <div className="writing-clinic-meter-heading">
        <span>
          {msg('writing-clinic-resemblance', 'Similarity to {level} error patterns', {
            level: getLevelLabel(data, data.next_level),
          })}
        </span>
        <span className="writing-clinic-meter-value">{percentage(after)}%</span>
      </div>
      <div
        className="writing-clinic-meter-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Number(percentage(after))}
      >
        <span className="writing-clinic-meter-current" style={{ width: `${current * 100}%` }} />
        <span
          className="writing-clinic-meter-selection"
          style={{ left: `${lower * 100}%`, width: `${width * 100}%` }}
        />
        <span
          className="writing-clinic-meter-ceiling"
          style={{ left: `${Math.min(1, plan.p_ceiling || 0) * 100}%` }}
        />
      </div>
      <div className="writing-clinic-note">
        {msg(
          'writing-clinic-similarity-note',
          'This is a similarity score, not a prediction of your next level.',
        )}
      </div>
      {plan.ceiling_reachable === false && (
        <div className="writing-clinic-note warning">
          {msg(
            'writing-clinic-ceiling-note',
            'Grammar accuracy alone cannot close the full distance. Vocabulary and sentence ' +
              'structure also matter.',
          )}
        </div>
      )}
    </div>
  )
}

const PeerComparison = ({ data, levelLabel, msg }) => (
  <section className="writing-clinic-card">
    <h2 className="writing-clinic-card-title">
      {msg('writing-clinic-peer-title', 'Compared with other {level} writers', {
        level: levelLabel(data.level),
      })}
    </h2>
    <p className="writing-clinic-subtitle">
      {msg(
        'writing-clinic-peer-description',
        'See where your writing differs from people at your current level.',
      )}
    </p>
    <div className="writing-clinic-two-column">
      <PeerList
        title={msg('writing-clinic-weaknesses', 'You make more of these than most')}
        items={data.weaknesses}
        empty={msg('writing-clinic-nothing-stands-out', 'Nothing stands out')}
        meta={item =>
          msg('writing-clinic-more-than-percent', 'More than {percent}% of writers', {
            percent: Number(item.percentile || 0).toFixed(0),
          })
        }
      />
      <PeerList
        title={msg('writing-clinic-strengths', 'You do better than most on these')}
        items={data.strengths}
        empty={msg('writing-clinic-nothing-stands-out', 'Nothing stands out')}
        meta={item => item.band || item.note || ''}
      />
    </div>
    {data.cohort_reliable === false && (
      <div className="writing-clinic-note warning">
        {msg(
          'writing-clinic-cohort-warning',
          'There are too few reference essays at this level for a reliable comparison.',
        )}
      </div>
    )}
    {data.unrecognised_tags > 0 && (
      <div className="writing-clinic-note warning">
        {msg(
          'writing-clinic-unrecognised',
          '{count} errors had an unrecognised type and were excluded.',
          { count: data.unrecognised_tags },
        )}
      </div>
    )}
  </section>
)

const PeerList = ({ title, items = [], empty, meta }) => (
  <div>
    <strong>{title}</strong>
    <ul className="writing-clinic-peer-list">
      {items.length ? (
        items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            <span>{item.label}</span>
            <span className="writing-clinic-peer-meta">{meta(item)}</span>
          </li>
        ))
      ) : (
        <li>{empty}</li>
      )}
    </ul>
  </div>
)

const Corrections = ({ data, msg }) => {
  const sentences = data.upstream?.sentences || []
  if (!sentences.length) return null
  return (
    <section className="writing-clinic-card">
      <h2 className="writing-clinic-card-title">
        {msg('writing-clinic-corrections', 'The corrections')}
      </h2>
      <p className="writing-clinic-subtitle">
        {msg(
          'writing-clinic-corrections-description',
          'What the correction model changed, sentence by sentence.',
        )}
      </p>
      <AppTable plain>
        <TableHead>
          <TableRow>
            <TableCell>{msg('writing-clinic-you-wrote', 'You wrote')}</TableCell>
            <TableCell>{msg('writing-clinic-corrected', 'Corrected')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sentences.map((sentence, index) => (
            <TableRow key={sentence.id || index}>
              <TableCell>{sentence.source}</TableCell>
              <TableCell>
                {sentence.changed
                  ? sentence.corrected
                  : msg('writing-clinic-no-change', 'No change')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </AppTable>
    </section>
  )
}

export default WritingClinic
