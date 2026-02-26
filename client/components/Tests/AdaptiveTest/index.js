import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { InitAdaptiveTest, resetTests, updateTimed } from 'Utilities/redux/testReducer'
import { useLearningLanguage } from 'Utilities/common'
import { Checkbox } from 'semantic-ui-react'
import Spinner from 'Components/Spinner'
import ReportButton from 'Components/ReportButton'
import StartModal from 'Components/TimedActivityStartModal'
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

  const [startModalOpen, setStartModalOpen] = useState(false)
  const [isTimed, setIsTimed] = useState(timedTest)
  const startTest = () => {
    setStartModalOpen(true)
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
    return <Spinner fullHeight size={60}/>
  }

  return (
    <div className="cont-tall cont flex-col auto gap-row-sm">
      <div className="grow ps-nm flex-col gap-row-sm mt-md">
        {!adaptiveTestSessionId && (
          <div className="my-xl pb-xl align-center flex space-between">
            <Button size="lg" onClick={startTest} data-cy="start-test">
              <FormattedMessage id="start-a-new-test" />
            </Button>
            <Checkbox
              toggle
              label={intl.formatMessage({ id: 'timed-adaptive-test' })}
              checked={timedTest}
              onChange={() => setIsTimed(!isTimed)}
              style={{ paddingTop: '.5em' }}
            />
          </div>
        )}
        {!currentAdaptiveQuestion && adaptiveTestResults && (
          <ResultModal cefrLevel={cefrLevel} adaptiveTestResults={adaptiveTestResults} />
        )}
        {adaptiveTestSessionId && <TestView showingInfo={startModalOpen} />}
        {!adaptiveTestSessionId && (
          <div>
            <hr className="my-2" />
          </div>
        )}
        <StartModal
          open={startModalOpen}
          setOpen={setStartModalOpen}
          activity="adaptive-test"
          onBackClick={() => dispatch(resetTests())}
        />
        <ReportButton extraClass="align-self-end mb-sm" />
      </div>
    </div>
  )
}

export default AdaptiveTestView
