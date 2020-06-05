import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'semantic-ui-react'
import moment from 'moment'

const History = () => {
  const [conceptSet, setConceptSet] = useState(new Set())

  const { concepts } = useSelector(({ metadata }) => metadata)
  const { history } = useSelector(({ tests }) => tests)

  const conceptIdToConceptName = (id) => {
    const concept = concepts.find(c => c.concept_id === id)
    return concept ? concept.name : id
  }

  const calculatePercentage = (sectionCount) => {
    if (!sectionCount) return null
    const { correct, total } = sectionCount

    return (correct / total * 100).toFixed(0)
  }

  const bgFromPercentage = (percentage) => {
    if (!percentage) return '#ffffff'
    if (percentage <= 33) return '#00ffff'
    if (percentage <= 66) return '#00e5c3'
    return '#00cc88'
  }

  useEffect(() => {
    if (!history) return
    const _set = new Set()
    history.forEach((test) => {
      Object.keys(test.section_counts).forEach(conceptId => _set.add(conceptId))
    })

    setConceptSet(_set)
  }, [history])

  if (!history) return null
  return (
    <div style={{ overflowX: 'scroll', maxWidth: '100%' }}>
      <Table celled>
        <Table.Header>
          <Table.HeaderCell>Concepts</Table.HeaderCell>
          {history.map(test => (
            <Table.HeaderCell key={test.date}>
              {moment(test.date).format('YYYY-MM-DD hh:mm')}
            </Table.HeaderCell>
          ))}
        </Table.Header>
        <Table.Body>
          {Array.from(conceptSet).map(conceptId => (
            <Table.Row key={conceptId}>
              <Table.Cell>{conceptIdToConceptName(conceptId)}</Table.Cell>
              {history.map((test) => {
                const percentage = calculatePercentage(test.section_counts[conceptId])
                return (
                  <Table.Cell style={{ backgroundColor: bgFromPercentage(percentage) }} />
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
