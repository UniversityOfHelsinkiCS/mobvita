import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { learningLanguageSelector } from 'Utilities/common'
import { getStudentProgress } from 'Utilities/redux/groupProgressReducer'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'


const ProgressGraph = ({ student, groupId }) => {
  const { dates, scores, pending } = useSelector(({ studentProgress }) => {
    const { progress, pending } = studentProgress
    const { exercise_history: exerciseHistory } = progress
    const scores = exerciseHistory.map(e => e.score)
    const dates = exerciseHistory.map(e => e.date)
    return { dates, scores, pending }
  })
  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!student) return
    dispatch(getStudentProgress(student._id, groupId, learningLanguage))
  }, [student])

  if (pending || !scores) {
    return 'loading...'
  }

  const options = {
    title: { text: '' },
    series: [{ name: 'Score', data: scores }],
    chart: { height: '35%' },
    legend: { enabled: false },
    credits: { enabled: false },
    allowDecimals: false,
    yAxis: { title: { text: 'Score' } },
    xAxis: {
      // eslint-disable-next-line react/no-this-in-sfc
      labels: { formatter() { return moment(dates[this.value]).format('DD/MM/YY') } },
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
