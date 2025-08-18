import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Modal, Select } from 'semantic-ui-react'
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

import './index.css'

const ReadingTestView = () => {
  const dispatch = useDispatch()
  const learningLanguage = useLearningLanguage()
  // const bigScreen = useWindowDimension().width >= 650
  const [showDDLangIntroductory, setShowDDLangIntroductory] = useState(false)
  const [showCyclePopup, setShowCyclePopup] = useState(true)
  const [cycle, setCycle] = useState('1')

  const {
    readingTestSessionId,
    pending,
    testDone,
    readingTestQuestions,
    currentReadingTestQuestion,
    currentReadingQuestionIndex,
  } = useSelector(({ tests }) => tests)

  useEffect(() => {
    if (
      !currentReadingQuestionIndex &&
      !currentReadingTestQuestion?.choices.some(choice => choice.isSelected)
    ) {
      setShowCyclePopup(true)
    }
  }, [currentReadingQuestionIndex])

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

  const handleCycleSubmit = () => {
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
      <Modal open={showCyclePopup} size="tiny" dimmer="inverted">
        <div className="cycle-modal-content">
          <h2>
            <FormattedMessage id="reading-test-cycle-popup-title" />
          </h2>
          <Select
            options={[...new Set(readingTestQuestions.map(item => item.cycle))]
              .sort((a, b) => a - b)
              .map(cycle => ({
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
      </Modal>
      <div className="grow ps-nm flex-col gap-row-sm">
        {readingTestSessionId && <ReadingTest cycle={cycle} />}
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
