import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { learningLanguageSelector } from 'Utilities/common'
import { getStudentProgress } from 'Utilities/redux/groupProgressReducer'
import { Dropdown } from 'react-bootstrap'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'


const ProgressGraph = ({ students, groupId }) => {
  const [currentStudent, setCurrentStudent] = useState(students[0])
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
    if (!currentStudent) return
    dispatch(getStudentProgress(currentStudent._id, groupId, learningLanguage))
  }, [currentStudent])

  useEffect(() => {
    setCurrentStudent(students[0])
  }, [students])

  if (pending || !scores) {
    return 'loading...'
  }

  if (!currentStudent) {
    return 'no data'
  }

  const options = {
    title: { text: '' },
    series: [{ name: 'Score', data: scores }],
    chart: { height: '35%' },
    legend: { enabled: false },
    credits: { enabled: false },
    allowDecimals: false,
    yAxis: { title: { text: 'Score' } },
    // eslint-disable-next-line react/no-this-in-sfc
    xAxis: { labels: { formatter() { return moment(dates[this.value]).format('DD/MM') } } },
  }

  return (
    <div className="group-container">
      <hr />
      <Dropdown
        data-cy="select-group"
        className="auto-right"
        onSelect={key => setCurrentStudent(students.find(student => student._id === key))}
      >
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          {currentStudent.email}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {students.map(student => (
            <Dropdown.Item eventKey={student._id} key={student._id}>{student.email}</Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          allowChartUpdate={false}
        />
      </div>
    </div>
  )
}

export default ProgressGraph
