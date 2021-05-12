import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { CSVLink } from 'react-csv'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import Spinner from 'Components/Spinner'
import ResponsiveDatePicker from 'Components/ResponsiveDatePicker'
import { capitalize } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import produce from 'immer'

const PickDate = ({ date, setDate }) => (
  <ResponsiveDatePicker selected={date} onChange={date => setDate(date)} dateFormat="yyyy/MM/dd" />
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

  return (
    <>
      <div className="date-pickers-container">
        {windowWidth > 700 ? (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="date-pickers gap-col-sm pl-sm">
                <span className="bold">
                  <FormattedMessage id="Showing results for" />
                </span>
                <FormattedMessage id="date-start" />{' '}
                <PickDate id="start" date={startDate} setDate={setStartDate} />
              </div>
              <div className="gap-col-sm pl-lg">
                <FormattedMessage id="date-end" /> <PickDate date={endDate} setDate={setEndDate} />
              </div>
            </div>

            <CSVLink filename={filename} data={summary}>
              <FormattedMessage id="download-csv" />
            </CSVLink>
          </div>
        ) : (
          <>
            <span className="bold" style={{ fontSize: '1.3em' }}>
              <FormattedMessage id="Showing results for" />
            </span>
            <div className="date-pickers gap-col-sm" style={{ marginTop: '0.5em' }}>
              <div>
                <FormattedMessage id="date-start" />
                <br />
                <PickDate id="start" date={startDate} setDate={setStartDate} />
              </div>
              <div>
                <FormattedMessage id="date-end" />
                <br />
                <PickDate date={endDate} setDate={setEndDate} />
              </div>
            </div>
          </>
        )}
      </div>
      <br />
      {pending ? (
        <Spinner />
      ) : (
        <Table striped bordered hover responsive size="sm">
          <thead>
            <tr>
              {columns.map(column => (
                <th
                  key={column}
                  className="clickable"
                  onClick={() => handleSort(column)}
                  style={{ textAlign: 'center', verticalAlign: 'middle' }}
                >
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
