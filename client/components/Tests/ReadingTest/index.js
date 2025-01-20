import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import {
  getReadingTestQuestions,
} from 'Utilities/redux/testReducer'

import { useLearningLanguage } from 'Utilities/common'
import Spinner from 'Components/Spinner'
import ReadingTest from './ReadingTest'

// import ReadingPracticeChatbot from 'Components/ChatBot/ReadingPracticeChatbot'
import DDLangIntroductory from 'Components/Tests/ReadingTest/ReadingTestIntroductory'



const ReadingTestView = () => {
  const dispatch = useDispatch()
  const learningLanguage = useLearningLanguage()
  // const bigScreen = useWindowDimension().width >= 650
  const [showDDLangIntroductory, setShowDDLangIntroductory] = useState(false)

  const { readingTestSessionId, pending, testDone, readingTestQuestions } = useSelector(
    ({ tests }) => tests
  )


  useEffect(() => {
    const hasUnseenQuestions = readingTestQuestions?.some((element) => element.seen === false);
  
    if (testDone === undefined && readingTestQuestions.length === 0) {
      dispatch(getReadingTestQuestions(learningLanguage, true));
    } else if (
      testDone === true &&
      hasUnseenQuestions === false &&
      readingTestQuestions.length > 0
    ) {
      dispatch(getReadingTestQuestions(learningLanguage, false));
    }
  }, [dispatch, learningLanguage, testDone]);
  
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
      {/* <ReadingPracticeChatbot /> */}
    </div>
  )
}

export default ReadingTestView
