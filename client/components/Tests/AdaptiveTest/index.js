import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { InitAdaptiveTest, resetTests } from 'Utilities/redux/testReducer'

import { useLearningLanguage } from 'Utilities/common'
import useWindowDimension from 'Utilities/windowDimensions'
import Spinner from 'Components/Spinner'
import ReportButton from 'Components/ReportButton'
import TestView from './AdaptiveTest'
// import TestReport from './TestReport'

const AdaptiveTestView = () => {
  const dispatch = useDispatch()
  const learningLanguage = useLearningLanguage()
  const { adaptiveTestSessionId, pending, language } = useSelector(({ tests }) => tests)
  // const bigScreen = useWindowDimension().width >= 650

  const startTest = () => {
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
      <div className="grow ps-nm flex-col gap-row-sm">
        {!adaptiveTestSessionId && (
          <div className="pl-nm pt-nm">
            <Button onClick={startTest} data-cy="start-test">
              <FormattedMessage id="start-a-new-test" />
            </Button>
          </div>
        )}
        {/* {report && <TestReport />} */}
        {adaptiveTestSessionId && <TestView />}
        <ReportButton extraClass="align-self-end mb-sm" />
      </div>
    </div>
  )
}

export default AdaptiveTestView
