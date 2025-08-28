import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Select, Segment } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { getReadingTestQuestions, resetTests } from 'Utilities/redux/testReducer'

import { useLearningLanguage } from 'Utilities/common'
import Spinner from 'Components/Spinner'
import ReadingTest from './ReadingTest'

// import ReadingPracticeChatbot from 'Components/ChatBot/ReadingPracticeChatbot'
import DDLangIntroductory from 'Components/Tests/ReadingTest/ReadingTestIntroductory'

import './index.css'

const ReadingTestView = () => {
  const dispatch = useDispatch()
  const learningLanguage = useLearningLanguage()
  // const bigScreen = useWindowDimension().width >= 650
  const [showDDLangIntroductory, setShowDDLangIntroductory] = useState(false)
  const [showCyclePopup, setShowCyclePopup] = useState(false)
  const [cycle, setCycle] = useState(null)

  const { readingTestSessionId, pending, testDone, readingTestQuestions, allCycles } = useSelector(
    ({ tests }) => tests
  )

  useEffect(() => {
    if (testDone === undefined && readingTestQuestions.length === 0) {
      dispatch(getReadingTestQuestions(learningLanguage, true));
    }
  }, [dispatch, learningLanguage, testDone]);

  const handleCycleSubmit = () => {
    dispatch(resetTests())
    dispatch(getReadingTestQuestions(learningLanguage, false, Number(cycle)))
    setShowCyclePopup(false)
  }

  if (pending) {
    return <Spinner fullHeight />
  }

  return (
    <div className="cont-tall cont flex-col auto gap-row-sm">
      {showDDLangIntroductory && (
        <DDLangIntroductory setShowDDLangIntroductory={setShowDDLangIntroductory} />
      )}
      <div className="grow ps-nm flex-col gap-row-sm">
        {readingTestSessionId && !showCyclePopup && (
          <ReadingTest setCycle={setCycle} setShowCyclePopup={setShowCyclePopup} />
        )}
        {showCyclePopup && (
          <div className="cont mt-nm">
            <Segment style={{ minHeight: '700px', borderRadius: '20px' }}>
              <div className="align-center justify-center">
                <div className="test-container" style={{ width: '90%' }}>
                  <div className="cycle-modal-content">
                    <h2>
                      <FormattedMessage id="reading-test-cycle-popup-title" />
                    </h2>
                    <Select
                      options={allCycles?.map(cycle => ({
                        key: cycle,
                        value: cycle,
                        text: cycle,
                      }))}
                      value={cycle}
                      onChange={(e, data) => setCycle(data.value)}
                    />
                    <Button onClick={handleCycleSubmit}>
                      <FormattedMessage id="Submit" />
                    </Button>
                  </div>
                </div>
              </div>
            </Segment>
          </div>
        )}
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
