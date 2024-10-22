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
import DDLangIntroductory from 'Components/Tests/ReadingTest/ReadingTestIntroductory'


const ReadingTestView = () => {
  const dispatch = useDispatch()
  const learningLanguage = useLearningLanguage()
  const [sessionToDelete, setSessionToDelete] = useState(false)
  const { readingTestSessionId, pending, testDone, readingTestQuestions } = useSelector(
    ({ tests }) => tests
  )
  const bigScreen = useWindowDimension().width >= 650
  const [showDDLangIntroductory, setShowDDLangIntroductory] = useState(false)

  useEffect(() => {
    const hasUnseenQuestions = readingTestQuestions.some((element) => !element.seen);
    const continue_test = hasUnseenQuestions && !testDone
    dispatch(getReadingTestQuestions(learningLanguage, continue_test))
  }, [dispatch, learningLanguage])
  
  if (pending) {
    return <Spinner fullHeight />
  }

  return (
    <div className="cont-tall cont flex-col auto gap-row-sm">
      {showDDLangIntroductory && <DDLangIntroductory setShowDDLangIntroductory={setShowDDLangIntroductory}/>}
      <div className="grow ps-nm flex-col gap-row-sm">
        {readingTestSessionId && <ReadingTest />}
        <div className="test-top-info space-between" style={{ marginBottom: '0.2em' }}>
          <Button
            className="show-ddlang-introductory-button btn-secondary"
            style={{ marginRight: 'auto', marginTop: '1rem' }}
            onClick={() => setShowDDLangIntroductory(true)}
          >
            <span>
              <FormattedMessage id="show-ddlang-introductory" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ReadingTestView
