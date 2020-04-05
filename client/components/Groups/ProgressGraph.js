import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { learningLanguageSelector } from 'Utilities/common'
import { getStudentProgress } from 'Utilities/redux/groupProgressReducer'
import { Dropdown } from 'react-bootstrap'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'


const ProgressGraph = ({ students, groupId }) => {
  const [currentStudent, setCurrentStudent] = useState(students[0])
  const { progress, pending } = useSelector(({ studentProgress }) => studentProgress)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getStudentProgress(currentStudent._id, groupId, learningLanguage))
  }, [currentStudent])

  if (pending || !progress) {
    return 'loading...'
  }

  const options = {
    title: { text: currentStudent.email },
    series: [{ data: progress.exercise_history.map(e => e.score) }],
    chart: { height: '35%' },
    legend: { enabled: false },
    credits: { enabled: false },
  }
  console.log(options.series)
  return (
    <div className="group-container">
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
