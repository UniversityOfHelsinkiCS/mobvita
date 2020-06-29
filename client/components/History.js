import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'semantic-ui-react'
import moment from 'moment'

const History = ({ history, pageSize, dateFormat }) => {
  const [conceptSet, setConceptSet] = useState([])

  const [page, setPage] = useState(0)
  const { concepts } = useSelector(({ metadata }) => metadata)

  const conceptIdToConceptName = (id) => {
    const concept = concepts.find(c => c.concept_id === id)
    return concept ? concept.name : id
  }

  const calculateScore = (conceptStatistic) => {
    if (!conceptStatistic) return null
    const { correct, total } = conceptStatistic
    if (total === 0) return 0

    return (correct / total)
  }

  const bgFromScore = (score) => {
    const amount = 230 - score * 230

    return `rgb(${amount},255,${amount})`
  }

  const calculatePage = () => {
    const size = pageSize || 7
    return history.slice(page * size, page * size + size)
  }


  const switchPage = (change) => {
    const maxPage = Math.trunc(history.length / 7)

    const newPage = page + change

    if (newPage > maxPage) {
      setPage(0)
    } else if (newPage < 0) {
      setPage(maxPage)
    } else {
      setPage(newPage)
    }
  }

  useEffect(() => {
    if (!history) return
    const _set = new Set()
    history.forEach((test) => {
      Object.keys(test.concept_statistics).forEach(conceptId => _set.add(conceptId))
    })

    setConceptSet(Array.from(_set))
  }, [history])

  if (!history) return null
  return (
    <div style={{ overflowX: 'scroll', maxWidth: '100%', marginTop: '1em' }}>
      <button type="button" onClick={() => switchPage(-1)}>-</button>
      <span style={{ marginLeft: '1em', marginRight: '1em' }}>{page + 1} / {1 + Math.trunc(history.length / 7)}</span>
      <button type="button" onClick={() => switchPage(1)}>+</button>
      <Table celled>
        <Table.Header>
          <Table.HeaderCell>Concepts</Table.HeaderCell>
          {calculatePage().map(test => (
            <Table.HeaderCell key={test.date}>
              {moment(test.date).format(dateFormat || 'YYYY-MM-DD hh:mm')}
            </Table.HeaderCell>
          ))}
        </Table.Header>
        <Table.Body>
          {conceptSet.map(conceptId => (
            <Table.Row key={conceptId}>
              <Table.Cell>{conceptIdToConceptName(conceptId)}</Table.Cell>
              {history.slice(page * 7, page * 7 + 7).map((test) => {
                const score = calculateScore(test.concept_statistics[conceptId])
                return (
                  <Table.Cell key={`${test.date}-${conceptId}`} style={{ backgroundColor: bgFromScore(score) }} />
                )
              })}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default History
