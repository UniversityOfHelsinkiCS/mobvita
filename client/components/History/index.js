import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'semantic-ui-react'
import moment from 'moment'
import Concept from './Concept'

const History = ({ history, dateFormat }) => {
  const [conceptSet, setConceptSet] = useState([])

  const [page, setPage] = useState(0)
  const { concepts } = useSelector(({ metadata }) => metadata)

  const conceptIdToConceptName = (id) => {
    const concept = concepts.find(c => c.concept_id === id)
    return concept ? concept.name : id
  }

  const calculateColor = (conceptStatistic) => {
    if (!conceptStatistic) return null
    const { correct, total } = conceptStatistic
    const score = total === 0 ? 0 : correct / total

    const amount = 230 - score * 230

    return `rgb(${amount},255,${amount})`
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

  const findConceptOrder = (conceptId) => {
    const concept = concepts.find(concept => concept.concept_id === conceptId)
    if (!concept) return 999999
    return concept['UI-order']
  }

  useEffect(() => {
    if (!history) return
    const _set = new Set()
    history.forEach((test) => {
      Object.keys(test.concept_statistics).forEach(conceptId => _set.add(conceptId))
    })

    setConceptSet(Array.from(_set).sort((a, b) => findConceptOrder(a) - findConceptOrder(b)))
  }, [history])

  if (!history) return null
  return (
    <div style={{ overflowX: 'scroll', maxWidth: '100%', marginTop: '1em' }}>
      <button type="button" onClick={() => switchPage(-1)}>-</button>
      <span style={{ marginLeft: '1em', marginRight: '1em' }}>{page + 1} / {1 + Math.trunc(history.length / 8)}</span>
      <button type="button" onClick={() => switchPage(1)}>+</button>
      <Table celled fixed>
        <Table.Header>
          <Table.HeaderCell>Concepts</Table.HeaderCell>
          {calculatePage().map(test => (
            <Table.HeaderCell key={test.date}>
              {moment(test.date).format(dateFormat || 'YYYY-MM-DD hh:mm')}
            </Table.HeaderCell>
          ))}
        </Table.Header>
        <Table.Body>
          {buildConceptTree().map(concept => (
            <Concept
              calculateColor={calculateColor}
              history={history.slice(page * 7, page * 7 + 7)}
              concept={concept}
              getConceptName={conceptIdToConceptName}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default History
