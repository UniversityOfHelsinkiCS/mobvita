import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table, Spinner } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { CSVLink } from 'react-csv'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import { capitalize, supportedLearningLanguages, newCapitalize } from '../../util/common'


import 'react-datepicker/dist/react-datepicker.css'


const PickDate = ({ date, setDate }) => (
  <DatePicker
    selected={date}
    onChange={date => setDate(date)}
    dateFormat="yyyy/MM/dd"
  />
)


const Summary = ({ groupName, isTeaching, getSummary, learningLanguage }) => {
  const [sorter, setSorter] = useState({})
  const [columns, setColumns] = useState([])
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days').toDate())
  const [endDate, setEndDate] = useState(moment().toDate())

  const summary = useSelector(({ summary: { summary } }) => {
    if (!summary) return null

    const { field, direction } = sorter

    if (field) {
      return summary.sort((a, b) => {
        if (a[field] < b[field]) return direction[field] === 1 ? -1 : 1
        if (a[field] > b[field]) return direction[field] === 1 ? 1 : -1
        return 0
      })
    }

    return summary
  })
  const { colOrder } = useSelector(({ summary }) => summary)

  useEffect(() => {
    if (summary && colOrder && summary.length > 0) {
      const temp = Object.values(colOrder)

      let directionsObj = {}
      temp.forEach((column) => {
        directionsObj = {
          ...directionsObj,
          [column]: 1,
        }
      })

      setSorter({
        field: 'email',
        direction: directionsObj,
      })

      setColumns(temp)
    }
  }, [summary])

  const pending = useSelector(({ summary }) => summary.pending)

  useEffect(() => {
    if (isTeaching) {
      getSummary(startDate, endDate)
    }
  }, [startDate, endDate, groupName])

  if (!summary) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    )
  }

  const handleSort = (field) => {
    setSorter(
      {
        field,
        direction: { ...sorter.direction, [field]: -1 * sorter.direction[field] },
      },
    )
  }

  const cleanGroupName = groupName
    .toLowerCase()
    .split(' ')
    .join('_')
    .replace(/[^\w\s-]/gi, '') // only allow letters, undescore and dash

  const filename = `${cleanGroupName}_summary.csv`

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1em' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <FormattedMessage id="date-start" />
            <PickDate id="start" date={startDate} setDate={setStartDate} />
          </div>
          <div style={{ marginLeft: '1em', marginRight: '1em' }}>
            <FormattedMessage id="date-end" />
            <PickDate date={endDate} setDate={setEndDate} />
          </div>
        </div>
        <CSVLink filename={filename} data={summary}>
          <FormattedMessage id="download-csv" />
        </CSVLink>
      </div>
      {pending ? (
        <div className="spinner-container">
          <Spinner animation="border" variant="primary" size="lg" />
        </div>
      ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                {columns.map(column => (
                  <th
                    key={column}
                    className="column-sort"
                    onClick={() => handleSort(column)}
                  >
                    {capitalize(column).replace(/_/g, ' ')}
                    {sorter.field === column
                      && <Icon name={sorter.direction[column] === 1 ? 'caret up' : 'caret down'} />
                    }
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summary.map(user => (
                <tr key={user.email}>
                  {columns.map(column => <td key={user.username + column}>{user[column]}</td>)}
                </tr>
              ))}
            </tbody>
          </Table>
        )}
    </>
  )
}

export default Summary
