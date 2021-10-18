import React, { useState, useEffect, useLayoutEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Table, Icon, Button, TableRow } from 'semantic-ui-react'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import { hiddenFeatures } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import Concept from './Concept'

const TotalRow = history => {
  const rootConceptResults = []
  Object.values(history).forEach(allResults => {
    allResults.forEach(oneDayResults => {
      const rootConcepts = Object.keys(oneDayResults.concept_statistics)
        .filter(key => key.includes('000'))
        .reduce((obj, key) => {
          obj[key] = oneDayResults.concept_statistics[key]
          return obj
        }, {})

      rootConceptResults.push(rootConcepts)
    })
  })

  const sumPropertyValues = (items, property) => {
    return items.reduce((a, b) => {
      return a + b[property]
    }, 0)
  }

  return (
    <TableRow textAlign="center">
      <Table.Cell key="total" positive>
        <b>
          <FormattedMessage id="total" />
        </b>
      </Table.Cell>
      {rootConceptResults.map((oneDayResults, index) => (
        <Table.Cell key={new Date().getTime() + index} positive>
          {sumPropertyValues(Object.values(oneDayResults), 'total') > 0 ? (
            <>
              {Math.round(
                (sumPropertyValues(Object.values(oneDayResults), 'correct') /
                  sumPropertyValues(Object.values(oneDayResults), 'total')) *
                  100
              )}{' '}
              % <FormattedMessage id="correct" />
              <br />({sumPropertyValues(Object.values(oneDayResults), 'correct')} /{' '}
              {sumPropertyValues(Object.values(oneDayResults), 'total')})
            </>
          ) : null}
        </Table.Cell>
      ))}
    </TableRow>
  )
}

const CefrLevelRow = ({ history }) => {
  return (
    <TableRow textAlign="center">
      <Table.Cell key="total">
        <b>
          <FormattedMessage id="cefr-level" />
        </b>
      </Table.Cell>
      {history.map(resultsObj => (
        <Table.Cell>
          <div>{resultsObj.cefr_level ?? '-'}</div>
        </Table.Cell>
      ))}
    </TableRow>
  )
}

const TestTypeRow = ({ history }) => {
  return (
    <TableRow>
      <Table.Cell key="total">
        <b>Test type</b>
      </Table.Cell>
      {history.map(resultsObj => (
        <Table.Cell>
          <div>{resultsObj?.type ? <FormattedMessage id={resultsObj.type} /> : 'N/A'}</div>
        </Table.Cell>
      ))}
    </TableRow>
  )
}

const History = ({ history, dateFormat, handleDelete = null }) => {
  const [colors, setColors] = useState({
    best: '144, 239, 144',
    medium: '246, 247, 221',
    worst: '252, 108, 133',
    noData: '255, 255, 255',
  })

  const [pageSize, setPageSize] = useState(2)

  const [colorTest, setColorTest] = useState(0.5)
  const [fillFromHistory, setFillFromHistory] = useState(false)

  const [page, setPage] = useState(0)
  const { concepts } = useSelector(({ metadata }) => metadata)

  const windowWidth = useWindowDimensions().width

  const maxPage = useMemo(() => {
    const extraPage = history?.length % pageSize === 0 ? 0 : 1
    return Math.trunc(history?.length / pageSize) + extraPage
  }, [history, pageSize])

  useLayoutEffect(() => {
    if (page > maxPage - 1 && page !== 0) {
      setPage(maxPage - 1)
    }
  }, [maxPage])

  useEffect(() => {
    if (windowWidth > 1040) setPageSize(7)
    else if (windowWidth > 950) setPageSize(6)
    else if (windowWidth > 800) setPageSize(5)
    else if (windowWidth > 675) setPageSize(4)
    else if (windowWidth > 550) setPageSize(3)
    else if (windowWidth > 425) setPageSize(2)
    else setPageSize(1)
  }, [windowWidth])

  const conceptIdToConceptName = id => {
    const concept = concepts.find(c => c.concept_id === id)
    return concept ? concept.name : id
  }

  const fromPreviousScored = (conceptId, date) => {
    const empty = { correct: 0, total: 0 }
    if (!fillFromHistory) return empty
    const found = history.find(data => {
      const previousDate = new Date(data.date)
      if (new Date(date) < previousDate) return false
      const concept = data.concept_statistics[conceptId]
      return concept ? concept.total > 0 : false
    })

    return found ? found.concept_statistics[conceptId] : empty
  }

  const colorFromScore = score => {
    const best = colors.best.split(',').map(Number)
    const medium = colors.medium.split(',').map(Number)
    const worst = colors.worst.split(',').map(Number)

    let red
    let green
    let blue

    if (Number(score) < 0.5) {
      red = worst[0] + Number(score) * 2 * (medium[0] - worst[0])
      green = worst[1] + Number(score) * 2 * (medium[1] - worst[1])
      blue = worst[2] + Number(score) * 2 * (medium[2] - worst[2])
    } else {
      red = medium[0] + 2 * (Number(score) - 0.5) * (best[0] - medium[0])
      green = medium[1] + 2 * (Number(score) - 0.5) * (best[1] - medium[1])
      blue = medium[2] + 2 * (Number(score) - 0.5) * (best[2] - medium[2])
    }

    return `rgb(${red},${green},${blue})`
  }

  const calculateColor = conceptStatistic => {
    const { noData } = colors
    const { correct, total } = conceptStatistic
    if (total === 0) return `rgb(${noData})`

    const score = correct / total
    return colorFromScore(score)
  }

  const calculatePage = () => {
    return history.slice(page * pageSize, page * pageSize + pageSize)
  }

  const switchPage = change => {
    const newPage = page + change

    if (newPage + 1 > maxPage) {
      setPage(0)
    } else if (newPage < 0) {
      setPage(maxPage - 1)
    } else {
      setPage(newPage)
    }
  }

  const buildSingleConcept = conceptId => {
    const concept = concepts.find(concept => concept.concept_id === conceptId)
    if (!concept.children) return { id: conceptId, children: [] }
    return {
      id: conceptId,
      children: concept.children
        .sort((a, b) => a['UI-order'] - b['UI-order'])
        .map(c => buildSingleConcept(c)),
    }
  }

  const buildConceptTree = () => {
    if (!concepts) return null

    const rootConcepts = concepts
      .filter(c => !c.parents)
      .sort((a, b) => a['UI-order'] - b['UI-order'])
    const conceptTree = []
    rootConcepts.forEach(concept => {
      conceptTree.push(buildSingleConcept(concept.concept_id))
    })

    return conceptTree
  }

  const handleColorChange = color => e => {
    setColors({ ...colors, [color]: e.target.value })
  }

  if (!history || history.length < 1) {
    return (
      <div className="group-analytics-no-results">
        <FormattedMessage id="no-results-for-chosen-time-period" />
      </div>
    )
  }
  return (
    <div style={{ overflowX: 'scroll', maxWidth: '100%', marginTop: '1em' }}>
      {maxPage > 1 && (
        <div>
          <Button onClick={() => switchPage(-1)}>
            <Icon name="angle left" />
          </Button>
          <span style={{ marginLeft: '1em', marginRight: '1em' }}>
            {page + 1} / {maxPage}
          </span>
          <Button onClick={() => switchPage(1)}>
            <Icon name="angle right" />
          </Button>
        </div>
      )}
      {hiddenFeatures && (
        <>
          <br />
          best:
          <input type="text" value={colors.best} onChange={handleColorChange('best')} />
          medium:
          <input type="text" value={colors.medium} onChange={handleColorChange('medium')} />
          worst:
          <input type="text" value={colors.worst} onChange={handleColorChange('worst')} />
          no data:
          <input type="text" value={colors.noData} onChange={handleColorChange('noData')} />
          <br />
          test (between 0 and 1):
          <input
            type="text"
            style={{ backgroundColor: colorFromScore(colorTest) }}
            value={colorTest}
            onChange={e => setColorTest(e.target.value)}
          />
          fillFromHistory:
          <input
            type="checkbox"
            checked={fillFromHistory}
            onChange={() => setFillFromHistory(!fillFromHistory)}
          />
        </>
      )}
      <Table celled fixed unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <FormattedMessage id="concepts" />
            </Table.HeaderCell>
            {calculatePage().map(test => (
              <Table.HeaderCell key={test.date}>
                <span className="space-between">
                  {moment(test.date).format(dateFormat || 'YYYY.MM.DD HH:mm')}
                  {handleDelete && (
                    <Icon
                      name="close"
                      onClick={() => handleDelete(test.test_session)}
                      style={{ marginTop: '.25rem' }}
                    />
                  )}
                </span>
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <TestTypeRow history={history.slice(page * pageSize, page * pageSize + pageSize)} />
          {buildConceptTree()?.map(concept => (
            <Concept
              key={concept.id}
              calculateColor={calculateColor}
              history={history.slice(page * pageSize, page * pageSize + pageSize)}
              concept={concept}
              getConceptName={conceptIdToConceptName}
              fromPreviousScored={fromPreviousScored}
            />
          ))}
          <CefrLevelRow history={history.slice(page * pageSize, page * pageSize + pageSize)} />
          <TotalRow history={history.slice(page * pageSize, page * pageSize + pageSize)} />
        </Table.Body>
      </Table>
    </div>
  )
}

export default History
