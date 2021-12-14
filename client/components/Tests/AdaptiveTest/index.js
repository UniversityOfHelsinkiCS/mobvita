import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { InitAdaptiveTest, resetTests } from 'Utilities/redux/testReducer'
import { useLearningLanguage } from 'Utilities/common'
import Spinner from 'Components/Spinner'
import ReportButton from 'Components/ReportButton'
import StartModal from 'Components/TimedActivityStartModal'
import TestView from './AdaptiveTest'
import ResultModal from './ResultModal'

const AdaptiveTestView = () => {
  const dispatch = useDispatch()
  const learningLanguage = useLearningLanguage()
  const { adaptiveTestSessionId, pending, language, cefrLevel, adaptiveTestResults } = useSelector(
    ({ tests }) => tests
  )

  const [startModalOpen, setStartModalOpen] = useState(false)

  const startTest = () => {
    setStartModalOpen(true)
    dispatch(InitAdaptiveTest(learningLanguage))
  }

  useEffect(() => {
    if (language !== learningLanguage) {
      dispatch(resetTests())
    }
  }, [learningLanguage])

  if (pending) {
    return <Spinner fullHeight />
  }

  return (
    <div className="cont-tall cont flex-col auto gap-row-sm">
      <div className="grow ps-nm flex-col gap-row-sm mt-md">
        {!adaptiveTestSessionId && (
          <div className="my-xl pb-xl align-center">
            <Button size="lg" onClick={startTest} data-cy="start-test">
              <FormattedMessage id="start-a-new-test" />
            </Button>
          </div>
        )}
        {adaptiveTestResults && (
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
