import React, { useState } from 'react'
import { Table, Icon } from 'semantic-ui-react'

const ConceptTitle = ({ title, isParent }) => {
  if (isParent) return <b>{title}</b>
  return title
}

const Concept = ({ concept, history, calculateColor, getConceptName, fromPreviousScored }) => {
  const [collapsed, setCollapsed] = useState(false)

  const calculateScoreWithPrevious = (test, concept) => {
    if (test.concept_statistics[concept.id].total === 0) {
      return calculateColor(fromPreviousScored(concept.id, test.date))
    }
    return calculateColor(test.concept_statistics[concept.id])
  }

  return (
    <>
      <Table.Row onClick={() => setCollapsed(!collapsed)}>
        <Table.Cell>
          {concept.children.length > 0
            && <Icon name={collapsed ? 'angle down' : 'angle right'} />}
          <ConceptTitle title={getConceptName(concept.id)} isParent={concept.children.length > 0} />
        </Table.Cell>
        {history.map(test => (
          <Table.Cell
            key={`${test.date}-${concept.id}`}
            style={{ backgroundColor: calculateScoreWithPrevious(test, concept) }}
          />
        ))}
      </Table.Row>
      {collapsed
        && concept.children.map(child => (
          <Concept
            concept={child}
            history={history}
            calculateColor={calculateColor}
            getConceptName={getConceptName}
            fromPreviousScored={fromPreviousScored}
          />
        ))}
    </>
  )
}

export default Concept
