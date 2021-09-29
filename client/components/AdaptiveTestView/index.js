import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import {
  getTestQuestions,
  InitAdaptiveTest,
  resetTest,
  removeFromHistory,
} from 'Utilities/redux/testReducer'

import { useLearningLanguage } from 'Utilities/common'
import useWindowDimension from 'Utilities/windowDimensions'
import moment from 'moment'
import Spinner from 'Components/Spinner'
import ReportButton from 'Components/ReportButton'
import TestView from './AdaptiveTest'
import TestReport from './TestReport'

const AdaptiveTestIndex = () => {
  const dispatch = useDispatch()
  const learningLanguage = useLearningLanguage()
  const [sessionToDelete, setSessionToDelete] = useState(false)
  const { sessionId, report, pending, language, history } = useSelector(({ tests }) => tests)
  const bigScreen = useWindowDimension().width >= 650

  const startTest = () => {
    // dispatch(getTestQuestions(learningLanguage, selectedGroup, true))
    dispatch(InitAdaptiveTest(learningLanguage))
  }

  // const continueTest = () => {
  //   dispatch(getTestQuestions(learningLanguage, selectedGroup))
  // }

  const handleSessionDeleteClick = sessionId => {
    setSessionToDelete(sessionId)
  }

  const deleteSession = () => {
    dispatch(removeFromHistory(learningLanguage, sessionToDelete))
  }

  // useEffect(() => {
  //   if (!sessionId) {
  //     dispatch(getGroups())
  //     dispatch(getHistory(learningLanguage, startDate, endDate))
  //   }
  // }, [sessionId])

  useEffect(() => {
    if (language !== learningLanguage) {
      dispatch(resetTest())
    }
  }, [learningLanguage])

  if (pending) {
    return <Spinner fullHeight />
  }

  return (
    <div className="cont-tall cont flex-col auto gap-row-sm">
      <div className="grow ps-nm flex-col gap-row-sm">
        {!sessionId && (
          <div className="pl-nm pt-nm">
            <Button onClick={startTest} data-cy="start-test">
              <FormattedMessage id="start-a-new-test" />
            </Button>
          </div>
        )}
        {report && <TestReport />}
        {sessionId && <TestView />}
        <ReportButton extraClass="align-self-end mb-sm" />
      </div>
    </div>
  )
}

export default AdaptiveTestIndex
