import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import React, { useState, useEffect } from 'react'
import AppButton from 'Components/AppButton'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { InitAdaptiveTest, resetTests, updateTimed } from 'Utilities/redux/testReducer'
import { useLearningLanguage } from 'Utilities/common'
import { Box, FormControlLabel } from '@mui/material'
import AlarmOutlinedIcon from '@mui/icons-material/AlarmOutlined'
import AppSwitch from 'Components/ui/AppSwitch'
import { colors, font } from 'Assets/mui_theme/designTokens'
import Spinner from 'Components/Spinner'
import HelperSidebar from 'Components/PracticeView/HelperSidebar'
import ChatBubble from 'Components/ui/ChatBubble'
import TestView from './AdaptiveTest'
import ResultModal from './ResultModal'

const AdaptiveTestView = () => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const learningLanguage = useLearningLanguage()
  const {
    adaptiveTestSessionId,
    pending,
    language,
    cefrLevel,
    adaptiveTestResults,
    timedTest,
    currentAdaptiveQuestion,
  } = useSelector(({ tests }) => tests)
  const isSidebarOpen = useSelector(state => state.helperSidebar?.isOpen ?? false)

  const [isTimed, setIsTimed] = useState(timedTest)
  // The intro below replaced the TimedActivityStartModal: starting fetches the first question
  // straight away, with no dialog in between.
  const startTest = () => {
    dispatch(InitAdaptiveTest(learningLanguage))
  }

  useEffect(() => {
    dispatch(updateTimed(isTimed))
  }, [isTimed])

  useEffect(() => {
    if (language !== learningLanguage) {
      dispatch(resetTests())
    }
  }, [learningLanguage])

  if (pending) {
    return <Spinner fullHeight spinnerColor={colors.ink} size={60} />
  }

  return (
    <div className="cont-tall flex-col">
      {/* Top-aligned, level with the helper sidebar (navbar + page padding = its `top`). Centred by
          the row, not by auto margins: an auto margin stops a flex item stretching, which let the
          card shrink to its content — full width on the intro, ~500px on the question screen.
          `flex: 1` fills up to `.cont`'s 1024px on both (the Flashcards layout). */}
      <div className="flex" style={{ alignSelf: 'stretch', justifyContent: 'center' }}>
        <div
          className={`cont flex-col gap-row-sm ${isSidebarOpen ? 'sidebar-pushed' : ''}`}
          style={{ flex: 1 }}
        >
          <Box
            sx={{
              backgroundColor: colors.card,
              borderRadius: '30px',
              padding: { xs: '1.25em', sm: '1.75em' },
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {!adaptiveTestSessionId && (
              <div data-cy="adaptive-test-intro">
                <h1
                  style={{
                    margin: '0 0 0.5em',
                    fontSize: '2.25rem',
                    fontWeight: 500,
                    lineHeight: 1.2,
                    color: colors.ink,
                  }}
                >
                  <FormattedMessage id="adaptive-test" />
                </h1>
                <div style={{ color: colors.ink, lineHeight: 1.5 }}>
                  <FormattedHTMLMessage id="adaptive-test-info-text" />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    // Timed-test switch on the left edge, Start on the right edge.
                    justifyContent: 'space-between',
                    gap: '1em 2em',
                    marginTop: '2em',
                  }}
                >
                  {/* Switch, then its label, then the timer icon. */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
                    <FormControlLabel
                      labelPlacement="end"
                      control={
                        <AppSwitch checked={timedTest} onChange={() => setIsTimed(!isTimed)} />
                      }
                      label={intl.formatMessage({ id: 'timed-adaptive-test' })}
                      sx={{
                        m: 0,
                        '& .MuiFormControlLabel-label': {
                          marginLeft: '0.5em',
                          color: colors.ink,
                          fontSize: '0.9em',
                        },
                      }}
                    />
                    <AlarmOutlinedIcon sx={{ fontSize: 22, color: colors.muted }} />
                  </div>
                  <AppButton
                    onClick={startTest}
                    data-cy="start-test"
                    sx={{ minWidth: { xs: '100%', sm: '14em' } }}
                  >
                    <FormattedMessage id="start-test" />
                  </AppButton>
                </div>
              </div>
            )}
            {!currentAdaptiveQuestion && adaptiveTestResults && (
              <ResultModal cefrLevel={cefrLevel} adaptiveTestResults={adaptiveTestResults} />
            )}
            {adaptiveTestSessionId && <TestView />}
          </Box>
        </div>
      </div>

      {/* The sidebar holds the provisional CEFR estimate during the test — no assistant. The
          backend starts returning `cefr` partway through (around the 30th answer) while questions
          keep coming, so it is labelled as approximate rather than reading like the final result. */}
      <HelperSidebar>
        {adaptiveTestSessionId && cefrLevel && (
          <div style={{ padding: '1.4rem', paddingTop: 'calc(1.4rem + 10px)' }}>
            {/* Full-width tan card (2026 design): no variant has this shape, so the bot bubble is
                restyled inline — inline style wins over the variant's. */}
            <ChatBubble
              variant="bot"
              data-cy="adaptive-test-running-cefr"
              style={{
                alignSelf: 'stretch',
                maxWidth: '100%',
                backgroundColor: colors.menuHover,
                padding: '12px 20px',
              }}
            >
              <div
                style={{
                  color: colors.ink,
                  fontFamily: font.family,
                  fontSize: 16,
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '18px',
                }}
              >
                <FormattedMessage id="your-estimated-cefr-level" />: {cefrLevel}
              </div>
              <div
                style={{
                  marginTop: 4,
                  color: colors.ink,
                  fontFamily: font.family,
                  fontSize: 16,
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '18px',
                }}
              >
                <FormattedMessage id="adaptive-test-approximate-cefr-note" />
              </div>
            </ChatBubble>
          </div>
        )}
      </HelperSidebar>
    </div>
  )
}

export default AdaptiveTestView
