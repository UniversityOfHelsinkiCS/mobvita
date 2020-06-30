import React, { useState } from 'react'
import { Table, Icon } from 'semantic-ui-react'

const ConceptTitle = ({ title, isParent }) => {
  if (isParent) return <b>{title}</b>
  return title
}

const Concept = ({ concept, history, calculateColor, getConceptName }) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <Table.Row onClick={() => setCollapsed(!collapsed)}>
        <Table.Cell width="2">
          {concept.children.length > 0
            && <Icon name={collapsed ? 'angle down' : 'angle right'} />}
          <ConceptTitle title={getConceptName(concept.id)} isParent={concept.children.length > 0} />
        </Table.Cell>
        {history.map(test => (
          <Table.Cell
            key={`${test.date}-${concept.id}`}
            style={{ backgroundColor: calculateColor(test.concept_statistics[concept.id]) }}
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
          />
        ))}
    </>
  )
}

export default Concept
