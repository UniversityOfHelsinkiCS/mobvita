import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { CSVLink } from 'react-csv'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import Spinner from 'Components/Spinner'
import { capitalize } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'

import 'react-datepicker/dist/react-datepicker.css'
import produce from 'immer'

const PickDate = ({ date, setDate }) => (
  <DatePicker withPortal selected={date} onChange={date => setDate(date)} dateFormat="yyyy/MM/dd" />
)

const Summary = ({ groupName, isTeaching, getSummary }) => {
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
  const groups = useSelector(state => state.groups.groups)

  const { width: windowWidth } = useWindowDimensions()

  useEffect(() => {
    if (summary && colOrder && summary.length > 0) {
      const temp = Object.values(colOrder)

      let directionsObj = {}
      temp.forEach(column => {
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
  }, [startDate, endDate, groupName, groups])

  if (!summary) return <Spinner />

  const handleSort = field => {
    setSorter(
      produce(draft => {
        draft.field = field
        draft.direction[field] = -1 * sorter.direction[field]
      })
    )
  }

  const cleanGroupName = groupName
    .toLowerCase()
    .split(' ')
    .join('_')
    .replace(/[^\w\s-]/gi, '') // only allow letters, undescore and dash

  const filename = `${cleanGroupName}_summary.csv`

  const showCsvDownload = windowWidth > 500

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1em' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="gap-1 padding-left-1">
            <span className="sm-label">
              <FormattedMessage id="date-start" />
            </span>
            <PickDate id="start" date={startDate} setDate={setStartDate} />
          </div>
          <div className="gap-1 padding-left-3">
            <span className="sm-label">
              <FormattedMessage id="date-end" />
            </span>
            <PickDate date={endDate} setDate={setEndDate} />
          </div>
        </div>
        {showCsvDownload && (
          <CSVLink filename={filename} data={summary}>
            <FormattedMessage id="download-csv" />
          </CSVLink>
        )}
      </div>
      {pending ? (
        <Spinner />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column} className="clickable" onClick={() => handleSort(column)}>
                  {capitalize(column).replace(/_/g, ' ')}
                  {sorter.field === column && (
                    <Icon name={sorter.direction[column] === 1 ? 'caret up' : 'caret down'} />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {summary.map(user => (
              <tr key={user.email}>
                {columns.map(column => (
                  <td key={user.username + column}>{user[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default Summary
