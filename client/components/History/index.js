import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'semantic-ui-react'
import moment from 'moment'
import { hiddenFeatures } from 'Utilities/common'
import Concept from './Concept'


const History = ({ history, dateFormat }) => {
  const [colors, setColors] = useState({
    best: '0,255,0',
    worst: '230,255,230',
    noData: '255, 255, 255',
  })

  const [colorTest, setColorTest] = useState(0.5)
  const [fillFromHistory, setFillFromHistory] = useState(true)

  const [page, setPage] = useState(0)
  const { concepts } = useSelector(({ metadata }) => metadata)

  useEffect(() => setPage(0), [history])

  const conceptIdToConceptName = (id) => {
    const concept = concepts.find(c => c.concept_id === id)
    return concept ? concept.name : id
  }

  const fromPreviousScored = (conceptId, date) => {
    const empty = { correct: 0, total: 0 }
    if (!fillFromHistory) return empty
    const found = history.find((data) => {
      const previousDate = new Date(data.date)
      if (new Date(date) < previousDate) return false
      const concept = data.concept_statistics[conceptId]
      return concept ? concept.total > 0 : false
    })

    return found ? found.concept_statistics[conceptId] : empty
  }

  const colorFromScore = (score) => {
    const best = colors.best.split(',').map(Number)
    const worst = colors.worst.split(',').map(Number)

    const red = worst[0] + Number(score) * (best[0] - worst[0])
    const green = worst[1] + Number(score) * (best[1] - worst[1])
    const blue = worst[2] + Number(score) * (best[2] - worst[2])

    return `rgb(${red},${green},${blue})`
  }

  const calculateColor = (conceptStatistic) => {
    const { noData } = colors
    const { correct, total } = conceptStatistic
    if (total === 0) return `rgb(${noData})`

    const score = correct / total
    return colorFromScore(score)
  }

  const calculatePage = () => {
    const size = 7
    return history.slice(page * size, page * size + size)
  }


  const switchPage = (change) => {
    const size = 7
    const maxPage = Math.trunc(history.length / (size + 1))

    const newPage = page + change

    if (newPage > maxPage) {
      setPage(0)
    } else if (newPage < 0) {
      setPage(maxPage)
    } else {
      setPage(newPage)
    }
  }

  const buildSingleConcept = (conceptId) => {
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
    const rootConcepts = concepts.filter(c => !c.parents).sort((a, b) => a['UI-order'] - b['UI-order'])
    const conceptTree = []
    rootConcepts.forEach((concept) => {
      conceptTree.push(buildSingleConcept(concept.concept_id))
    })

    return conceptTree
  }

  const handleColorChange = color => (e) => {
    setColors({ ...colors, [color]: e.target.value })
  }

  if (!history) return null
  return (
    <div style={{ overflowX: 'scroll', maxWidth: '100%', marginTop: '1em' }}>
      <button type="button" onClick={() => switchPage(-1)}>-</button>
      <span style={{ marginLeft: '1em', marginRight: '1em' }}>{page + 1} / {1 + Math.trunc(history.length / 8)}</span>
      <button type="button" onClick={() => switchPage(1)}>+</button>
      {hiddenFeatures
      && (
      <>
        <br />
        best:
        <input type="text" value={colors.best} onChange={handleColorChange('best')} />
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
        <input type="checkbox" checked={fillFromHistory} onChange={() => setFillFromHistory(!fillFromHistory)} />
      </>
      )}
      <Table celled fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Concepts</Table.HeaderCell>
            {calculatePage().map(test => (
              <Table.HeaderCell key={test.date}>
                {moment(test.date).format(dateFormat || 'YYYY-MM-DD hh:mm')}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {buildConceptTree().map(concept => (
            <Concept
              key={concept.id}
              calculateColor={calculateColor}
              history={history.slice(page * 7, page * 7 + 7)}
              concept={concept}
              getConceptName={conceptIdToConceptName}
              fromPreviousScored={fromPreviousScored}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default History
