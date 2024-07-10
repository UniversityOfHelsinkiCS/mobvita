import React, { useEffect, useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import {
  getReadingTestQuestions,
  resetTests,
} from 'Utilities/redux/testReducer'

import { useLearningLanguage } from 'Utilities/common'
import useWindowDimension from 'Utilities/windowDimensions'
import moment from 'moment'
import Spinner from 'Components/Spinner'
import ReportButton from 'Components/ReportButton'
import ReadingTest from './ReadingTest'

const ReadingTestView = () => {
  const dispatch = useDispatch()
  const learningLanguage = useLearningLanguage()
  const [sessionToDelete, setSessionToDelete] = useState(false)
  const { readingTestSessionId, report, pending, language, history } = useSelector(
    ({ tests }) => tests
  )
  const bigScreen = useWindowDimension().width >= 650

  useEffect(() => {
    dispatch(getReadingTestQuestions(learningLanguage, true))
  }, [dispatch, learningLanguage])
  
  if (pending) {
    return <Spinner fullHeight />
  }

  return (
    <div className="cont-tall cont flex-col auto gap-row-sm">
      <div className="grow ps-nm flex-col gap-row-sm">
        {readingTestSessionId && <ReadingTest />}
      </div>
    </div>
  )
}

export default ReadingTestView
