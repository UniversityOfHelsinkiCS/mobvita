import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { learningLanguageSelector } from 'Utilities/common'
import { getStudentProgress } from 'Utilities/redux/groupProgressReducer'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'
import { FormattedMessage, useIntl } from 'react-intl'
import { Spinner } from 'react-bootstrap'

const ProgressGraph = ({ student, groupId }) => {
  const {
    storyData,
    flashcardData,
    pending,
  } = useSelector(({ studentProgress }) => {
    const { progress, pending } = studentProgress
    const { exercise_history: exerciseHistory, flashcard_history: flashcardHistory } = progress

    const storyData = exerciseHistory
      && exerciseHistory.map(e => [moment(e.date).valueOf(), e.score])
    const flashcardData = flashcardHistory
      && flashcardHistory.map(e => [moment(e.date).valueOf(), e.score])

    // Makes sure both curves end at same date
    if (storyData[0] && flashcardData[0]) {
      if (storyData[storyData.length - 1][0] > flashcardData[flashcardData.length - 1][0]) {
        flashcardData.push([storyData[storyData.length - 1][0], flashcardData[flashcardData.length - 1][1]])
      } else {
        storyData.push([flashcardData[flashcardData.length - 1][0], storyData[storyData.length - 1][1]])
      }
    }

    return { storyData, flashcardData, pending }
  })
  const learningLanguage = useSelector(learningLanguageSelector)

  const dispatch = useDispatch()
  const intl = useIntl()

  useEffect(() => {
    if (!student) return
    dispatch(getStudentProgress(student._id, groupId, learningLanguage))
  }, [student])

  if (pending || (!storyData && !flashcardData)) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    )
  }

  const options = {
    title: { text: '' },
    series: [
      { name: intl.formatMessage({ id: 'Stories' }), data: storyData },
      { name: intl.formatMessage({ id: 'Flashcards' }), data: flashcardData, color: '#dc3545' },
    ],
    chart: { height: '35%' },
    credits: { enabled: false },
    allowDecimals: false,
    yAxis: { title: { text: intl.formatMessage({ id: 'score' }) } },
    xAxis: {
      type: 'datetime',
      labels: { format: '{value:%d/%m/%y}' },
      allowDecimals: false,
    },
  }

  return (
    <div className="group-container">
      <hr />
      <FormattedMessage id="select-a-student-from-list" />
      <div>
        {student
          && (
            <HighchartsReact
              highcharts={Highcharts}
              options={options}
              allowChartUpdate={false}
            />
          )}
      </div>
    </div>
  )
}

export default ProgressGraph
