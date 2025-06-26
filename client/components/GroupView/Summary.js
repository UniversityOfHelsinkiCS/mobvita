import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { CSVLink } from 'react-csv'
import { FormattedMessage, useIntl } from 'react-intl'
import Spinner from 'Components/Spinner'
import { capitalize, skillLevels } from 'Utilities/common'
import produce from 'immer'

const Summary = ({
  setStudent,
  startDate,
  endDate,
  group,
  isTeaching,
  getSummary,
  getInitSummary,
  setContent,
  firstFetch,
  setCefrHistory,
  setFirstFetch,
  summaryType = 'all',
}) => {
  const intl = useIntl()
  const [sorter, setSorter] = useState({})
  const [columns, setColumns] = useState([])

  const groupName = group?.groupName

  const convertCellValue = (value, field) => {
    if (
      field === intl.formatMessage({ id: 'Email' }) ||
      field === intl.formatMessage({ id: 'username' }) ||
      field === intl.formatMessage({ id: 'cefr_grade' })
    ) {
      return String(value).toLowerCase()
    }
    return parseFloat(value)
  }

  const summary = useSelector(({ summary: { summary } }) => {
    if (!summary) return null
    summary.map(user => {
      Object.keys(user).forEach(key => {
        // replace null values with -Number.MAX_VALUE
        if (user[key] === null) user[key] = -Number.MAX_VALUE
      })
      return user
    })

    const { field, direction } = sorter

    if (field) {
      return summary.sort((a, b) => {
        if (field === intl.formatMessage({ id: 'cefr_grade' })) {
          const convertedA = convertCellValue(a[field][0]?.grade, field)
          const convertedB = convertCellValue(b[field][0]?.grade, field)

          if (convertedA < convertedB || !convertedA) return direction[field] === 1 ? -1 : 1
          if (convertedA > convertedB || !convertedB) return direction[field] === 1 ? 1 : -1
          return 0
        }

        const convertedA = convertCellValue(a[field], field)
        const convertedB = convertCellValue(b[field], field)

        if (convertedA < convertedB) return direction[field] === 1 ? -1 : 1
        if (convertedA > convertedB) return direction[field] === 1 ? 1 : -1

        return 0
      })
    }

    return summary
  })
  const { colOrder } = useSelector(({ summary }) => summary)

  useEffect(() => {
    if (summary && colOrder && summary.length > 0) {
      const temp = [
        colOrder[0], // 'Email'
        colOrder[1], // 'Username'
        colOrder[2], // 'xp_gained'
      ]
  
      if (summaryType === 'exercise' || summaryType === 'all') {
        temp.push(
          colOrder[3], // 'Number of Snippets'
          colOrder[4], // 'Exercise correct rate'
          colOrder[5], // 'Number of Exercises'
          colOrder[6]  // 'current_proficiency_score'
        )
      }
  
      if (summaryType === 'vocab' || summaryType === 'all') {
        temp.push(
          colOrder[7], // '%% Flashcards correct'
          colOrder[8]  // 'Flashcard exercises'
        )
      }
  
      if (summaryType === 'test' || summaryType === 'all') {
        temp.push(
          colOrder[9],  // 'Test correct rate'
          colOrder[10], // 'Number of test questions'
          colOrder[11], // 'Number of meditation steps (hints) given'
          colOrder[12], // 'Number of meditation steps (hints) given per question'
          colOrder[13]  // 'CEFR'
        )
      }
  
      let directionsObj = {}
      temp.forEach(column => {
        directionsObj = {
          ...directionsObj,
          [column]: 1,
        }
      })
  
      setSorter({
        field: colOrder[0], // 'Email'
        direction: directionsObj,
      })
  
      setColumns(temp)
    }
  }, [summary, summaryType])


  const pending = useSelector(({ summary }) => summary.pending)

  useEffect(() => {
    if (isTeaching) {
      getInitSummary()
    }
  }, [])

  useEffect(() => {
    if (isTeaching && !firstFetch) {
      getSummary(startDate, endDate)
    }
  }, [startDate, endDate, group])

  if (!summary) return <Spinner />

  const handleSort = field => {
    setSorter(
      produce(draft => {
        draft.field = field
        draft.direction[field] = -1 * sorter.direction[field]
      })
    )
  }

  const handleRowClick = user => {
    const student = group.students.find(
      // BE returns localized name for 'username' field, so we get the translation
      student => student?.userName === user?.[intl.formatMessage({ id: 'username' })]
    )

    setCefrHistory(user?.[intl.formatMessage({ id: 'cefr_grade' })])
    setStudent(student)
    setContent('progress')
    setFirstFetch(true)
  }

  const cleanGroupName = groupName
    .toLowerCase()
    .split(' ')
    .join('_')
    .replace(/[^\w\s-]/gi, '') // only allow letters, undescore and dash

  const filename = `${cleanGroupName}_summary.csv`

  const cleanColumnValue = (value, column) => {
    if (column === intl.formatMessage({ id: 'cefr_grade' }) && value?.length > 0) {
      return `${String(skillLevels[value[0].grade])}`
    }

    if (value === -Number.MAX_VALUE) {
      return '-'
    }

    if (String(value).length > 25) {
      return `${String(value).slice(0, 24)}...`
    }

    return value
  }

  return (
    <>
      {pending ? (
        <Spinner />
      ) : (
        <>
          {summary?.length > 0 ? (
            <>
              <div className="justify-end" style={{ marginTop: '2em' }}>
                <CSVLink filename={filename} data={summary}>
                  <FormattedMessage id="download-csv" />
                </CSVLink>
              </div>

              <Table striped bordered hover responsive size="sm">
                <thead>
                  <tr key="summary-header-row">
                    {columns.map(column => (
                      <th
                        className="clickable"
                        onClick={() => handleSort(column)}
                        style={{
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          width: column === 'CEFR' && '70px',
                        }}
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
                    <tr onClick={() => handleRowClick(user)} key={user.email}>
                      {columns.map(column => (
                        <td
                          className="clickable"
                          style={{
                            textAlign:
                              column === 'Email' || column === 'Username' ? 'left' : 'right',
                          }}
                        >
                          {cleanColumnValue(user[column], column)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          ) : (
            <div className="group-analytics-no-results">
              <FormattedMessage id="no-students-in-group" />
            </div>
          )}
        </>
      )}
    </>
  )
}

export default Summary
