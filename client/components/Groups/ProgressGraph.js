import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { learningLanguageSelector, hiddenFeatures } from 'Utilities/common'
import { getStudentProgress } from 'Utilities/redux/groupProgressReducer'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'
import { FormattedMessage, useIntl } from 'react-intl'
import { Spinner } from 'react-bootstrap'
import DatePicker from 'react-datepicker'

const ProgressGraph = ({ student, groupId }) => {
  const [startDate, setStartDate] = useState(moment().subtract(2, 'month').toDate())
  const [endDate, setEndDate] = useState(moment().toDate())

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


    // Extend the curves to selected end date
    if (storyData && storyData[0] && storyData[storyData.length - 1][0] < endDate) {
      storyData.push([moment(endDate).valueOf(), storyData[storyData.length - 1][1]])
    }
    if (flashcardData && flashcardData[0] && flashcardData[flashcardData.length - 1][0] < endDate) {
      flashcardData.push([moment(endDate).valueOf(), flashcardData[flashcardData.length - 1][1]])
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

  const series = [{ name: intl.formatMessage({ id: 'Stories' }), data: storyData }]
  if (hiddenFeatures) {
    series.push({
      name: intl.formatMessage({ id: 'Flashcards' }),
      data: flashcardData,
      color: '#dc3545',
    })
  }

  const options = {
    title: { text: '' },
    series,
    chart: { height: '35%' },
    credits: { enabled: false },
    allowDecimals: false,
    yAxis: { title: { text: intl.formatMessage({ id: 'score' }) } },
    xAxis: {
      type: 'datetime',
      labels: { format: '{value:%m/%d}' },
      allowDecimals: false,
      min: moment(startDate).valueOf(),
      max: moment(endDate).valueOf(),
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        marker: { enabled: true },
      },
    },
  }

  return (
    <div className="group-container">
      <hr />
      <div className="flex padding-left-1">
        <div className="gap-1">
          <FormattedMessage id="date-start" />
          <DatePicker
            dateFormat="yyyy/MM/dd"
            maxDate={Math.min(moment().valueOf(), endDate)}
            selected={startDate}
            onChange={date => setStartDate(date)}
          />
        </div>
        <div className="gap-1 padding-left-3">
          <FormattedMessage id="date-end" />
          <DatePicker
            dateFormat="yyyy/MM/dd"
            minDate={startDate}
            maxDate={moment().valueOf()}
            selected={endDate}
            onChange={date => setEndDate(date)}
          />
        </div>
      </div>
      <div>
        {student
          ? (
            <HighchartsReact
              highcharts={Highcharts}
              options={options}
            />
          ) : <FormattedMessage id="select-a-student-from-list" />
        }
      </div>
    </div>
  )
}

export default ProgressGraph
