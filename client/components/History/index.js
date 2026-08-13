import React, { useState, useEffect, useLayoutEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import AppButton from 'Components/AppButton'
import AppTable from 'Components/ui/AppTable'
import CustomTooltip from 'Components/CustomTooltip'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import { skillLevels } from 'Utilities/common'
import Concept from './Concept'

// MUI's TableCell hard-codes `text-align: left`, so semantic's row-level `textAlign="center"` has to
// be re-applied to the cells from the row.
const CENTERED_ROW = { '& .MuiTableCell-root': { textAlign: 'center' } }
// Pale green highlight standing in for semantic's `positive` cell.
const POSITIVE_CELL_BG = '#E9F1EC'

const sumPropertyValues = (items, property) => {
  return items.reduce((a, b) => {
    return a + b[property]
  }, 0)
}

const TotalRowText = ({ testView, isControlStory, hasZeroExercises, rawOneDayStatistics, oneDayCounts }) => {
  if (isControlStory)
    return (
      <>
        {Math.round((rawOneDayStatistics.points / rawOneDayStatistics.total_points) * 100)} %{' '}
        <FormattedMessage id="correct" />
      </>
    )
  if (hasZeroExercises) return null

  return (
    <>
      {Math.round(
        (sumPropertyValues(Object.values(oneDayCounts), 'correct') /
          sumPropertyValues(Object.values(oneDayCounts), 'total')) *
          100
      )}{' '}
      % <FormattedMessage id="correct" />
      {
        testView && (
          <>
          <br />({sumPropertyValues(Object.values(oneDayCounts), 'correct')} /{' '}
          {sumPropertyValues(Object.values(oneDayCounts), 'total')})
          </>
        )
      }
    </>
  )
}

const TotalRow = ({ history, testView, rootConcepts }) => {
  const rootConceptResults = []

  history.forEach(oneDayResults => {
    rootConceptResults.push(
      Object.keys(oneDayResults.concept_statistics)
        .filter(key => rootConcepts?.includes(key))
        .reduce((obj, key) => {
          obj[key] = {
            ...oneDayResults.concept_statistics[key],
            id: Math.floor(Math.random() * 10000),
            date: oneDayResults.date,
          }

          return obj
        }, {})
    )
  })

  if (rootConceptResults.length === 0) return null

  const firstConceptKey = Object.keys(rootConceptResults[0])[0] ?? 'placeholder'

  return (
    <TableRow sx={CENTERED_ROW}>
      <TableCell key="total" sx={{ backgroundColor: POSITIVE_CELL_BG }}>
        <span className="bold">
          <FormattedMessage id="total" />
        </span>
      </TableCell>
      {rootConceptResults?.map((oneDayCounts, index) => (
        <TableCell
          key={`${oneDayCounts[firstConceptKey]?.date}-${oneDayCounts[firstConceptKey]?.id}`}
          sx={{ backgroundColor: POSITIVE_CELL_BG }}
        >
          <TotalRowText
            testView={testView}
            isControlStory={history[index].type === 'control story'}
            hasZeroExercises={sumPropertyValues(Object.values(oneDayCounts), 'total') < 1}
            rawOneDayStatistics={history[index]}
            oneDayCounts={oneDayCounts}
          />
        </TableCell>
      ))}
    </TableRow>
  )
}

const TestTypeRow = ({ history }) => {
  return (
    <TableRow sx={CENTERED_ROW}>
      <TableCell key="total">
        <span className="bold">
          <FormattedMessage className="bold" id="test-type" />
        </span>
      </TableCell>
      {history.map(resultsObj => (
        <TableCell
          key={`${resultsObj.type}-${resultsObj.test_session ?? resultsObj.story_id}-${
            resultsObj.date
          }`}
        >
          <div>
            {resultsObj?.type ? (
              <>
                <FormattedMessage id={resultsObj.type.replace(/[\s_]/i, '-')} />
                {resultsObj.type === 'control story' && (
                  <div>"{resultsObj.story_name}"</div>
                )}
              </>
            ) : (
              'N/A'
            )}
          </div>
        </TableCell>
      ))}
    </TableRow>
  )
}

const StoryNameRow = ({ history }) => {
  const STORY_NAME_MAX_LEN = 25

  const truncateStoryName = name => {
    return `${name.slice(0, STORY_NAME_MAX_LEN)}...`
  }
  return (
    <TableRow sx={CENTERED_ROW}>
      <TableCell key="total">
        <span className="bold">
          <FormattedMessage id="story-title" />
        </span>
      </TableCell>
      {history.map(resultsObj => (
        <TableCell
          key={`${resultsObj.type}-${resultsObj.test_session ?? resultsObj.story_id}-${
            resultsObj.session_id ?? resultsObj.date
          }`}
        >
          {resultsObj?.story_name?.length > STORY_NAME_MAX_LEN ? (
            <CustomTooltip title={resultsObj.story_name} permanent>
              <span>{truncateStoryName(resultsObj.story_name)}</span>
            </CustomTooltip>
          ) : (
            <div>{resultsObj?.story_name ?? '-'}</div>
          )}
        </TableCell>
      ))}
    </TableRow>
  )
}

const convertToCefr = value => {
  if (value >= 0 && value <= 12) {
    return skillLevels[value]
  }
  return '-'
}

const CefrLevelRow = ({ history }) => {
  return (
    <TableRow sx={CENTERED_ROW}>
      <TableCell key="total">
        <b>
          <FormattedMessage id="cefr-level" />
        </b>
      </TableCell>
      {history.map(resultsObj => (
        <TableCell
          key={`${resultsObj.type}-${resultsObj.test_session ?? resultsObj.story_id}-${
            resultsObj.date
          }`}
        >
          {convertToCefr(resultsObj?.cefr_level)}
        </TableCell>
      ))}
    </TableRow>
  )
}

const History = ({ history, testView, dateFormat, handleDelete = null }) => {
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
  const { concepts: allConcepts } = useSelector(({ metadata }) => metadata)
  const concepts = allConcepts?.filter(c => testView && c.test_settings || !testView && c.exercise_settings)
  const rootConcepts = concepts?.filter(e => e.super)?.map(e => e.concept_id)

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
    if (windowWidth > 1040) setPageSize(6)
    else if (windowWidth > 950) setPageSize(5)
    else if (windowWidth > 800) setPageSize(4)
    else if (windowWidth > 675) setPageSize(3)
    else if (windowWidth > 550) setPageSize(2)
    // else if (windowWidth > 425) setPageSize(2)
    else setPageSize(1)
  }, [windowWidth])

  const conceptIdToConceptName = id => {
    const concept = allConcepts.find(c => c.concept_id === id)
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
    if (!concept) return null
    else if (!concept.children) return { id: conceptId, children: [] }
    return {
      id: conceptId,
      children: concept.children
        .sort((a, b) => a['UI-order'] - b['UI-order'])
        .map(c => buildSingleConcept(c)).filter(c => c !== null),
    }
  }

  const buildConceptTree = () => {
    if (!concepts) return null

    const rootConcepts = concepts
      .filter(c => c.concept_id !== '0-0')
      .filter(c => !c.parents || c.parents.length < 1)
      .sort((a, b) => a['UI-order'] - b['UI-order'])
    const conceptTree = []
    rootConcepts.forEach(concept => {
      conceptTree.push(buildSingleConcept(concept.concept_id))
    })
    return conceptTree
  }

  const getBiggestHistoryTotal = () => {
    let biggestValue = 0

    history.map(historyObj => {
      const statsObj = historyObj.concept_statistics
      Object.keys(statsObj).map(key => {
        if (statsObj[key].total > biggestValue) biggestValue = statsObj[key].total
      })
    })
    return biggestValue
  }

  const handleColorChange = color => e => {
    setColors({ ...colors, [color]: e.target.value })
  }

  if (!history || history.length < 1) {
    return (
      <div className="group-analytics-no-results" data-cy="history-no-results">
        <FormattedMessage id="no-results-for-chosen-time-period" />
      </div>
    )
  }
  return (
    <div style={{ overflowX: 'scroll', maxWidth: '100%', marginTop: '1em' }}>
      {maxPage > 1 && (
        <div className="justify-center align-center">
          <AppButton
            variant="secondary"
            onClick={() => switchPage(-1)}
            data-cy="history-previous-page-button"
          >
            <KeyboardArrowLeftIcon />
          </AppButton>
          <span style={{ marginLeft: '1em', marginRight: '1em' }}>
            {page + 1} / {maxPage}
          </span>
          <AppButton
            variant="secondary"
            onClick={() => switchPage(1)}
            data-cy="history-next-page-button"
          >
            <KeyboardArrowRightIcon />
          </AppButton>
        </div>
      )}
      {/* {hiddenFeatures && (
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
      )} */}
      <AppTable bordered sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow sx={CENTERED_ROW}>
            <TableCell style={{ width: '250px' }}>
              <FormattedMessage id="concepts" />
            </TableCell>
            {calculatePage().map(col => (
              <TableCell key={`${col.date}-${Math.floor(Math.random() * 10000)}`}>
                <span className="justify-center align-center">
                  {moment(col.date).format(dateFormat || 'YYYY.MM.DD HH:mm')}
                  {handleDelete && (
                    <CloseIcon
                      fontSize="small"
                      onClick={() => handleDelete(col.test_session)}
                      style={{ marginLeft: '1em', cursor: 'pointer' }}
                      data-cy="history-delete-session-button"
                    />
                  )}
                </span>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {buildConceptTree()?.map(concept => (
            <Concept
              key={concept.id}
              calculateColor={calculateColor}
              biggestHistoryTotal={getBiggestHistoryTotal()}
              history={history.slice(page * pageSize, page * pageSize + pageSize)}
              concept={concept}
              getConceptName={conceptIdToConceptName}
              fromPreviousScored={fromPreviousScored}
              indentation={0}
            />
          ))}
          {testView && (
            <>
              <TestTypeRow history={history.slice(page * pageSize, page * pageSize + pageSize)} />
              <CefrLevelRow history={history.slice(page * pageSize, page * pageSize + pageSize)} />
            </>
          )}

          <TotalRow
            history={history.slice(page * pageSize, page * pageSize + pageSize)}
            rootConcepts={rootConcepts}
            testView={testView}
          />
        </TableBody>
      </AppTable>
    </div>
  )
}

export default History
