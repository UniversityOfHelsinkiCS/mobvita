import React, { useState, Fragment } from 'react'
import { Table, Icon, Popup } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'

const ConceptTitle = ({ title, isParent }) => {
  if (isParent) return <b>{title}</b>
  return title
}

const PopupContent = ({ correct, total }) => (
  <>
    <div>
      <FormattedMessage id="correct-answers" />: {correct}
    </div>
    <div>
      <FormattedMessage id="total-answers" />: {total}
    </div>
  </>
)

const StatisticCell = ({ test, concept, fromPreviousScored, calculateColor, ...props }) => {
  const ownStatistics = test.concept_statistics[concept.id]
  const statistics = !ownStatistics || ownStatistics.total === 0
    ? fromPreviousScored(concept.id, test.date)
    : ownStatistics

  return (
    <Popup
      {...props}
      content={(
        <PopupContent
          correct={statistics.correct}
          total={statistics.total}
        />
          )}
      trigger={(
        <Table.Cell
          style={{ backgroundColor: calculateColor(statistics) }}
        />
    )}
    />
  )
}

const Concept = ({
  concept,
  history,
  calculateColor,
  getConceptName,
  fromPreviousScored,
  ...props
}) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Fragment {...props}>
      <Table.Row onClick={() => setCollapsed(!collapsed)}>
        <Table.Cell>
          {concept.children.length > 0
            && <Icon name={collapsed ? 'angle down' : 'angle right'} />}
          <ConceptTitle title={getConceptName(concept.id)} isParent={concept.children.length > 0} />
        </Table.Cell>
        {history.map(test => (
          <StatisticCell
            key={`${test.date}-${concept.id}`}
            test={test}
            concept={concept}
            fromPreviousScored={fromPreviousScored}
            calculateColor={calculateColor}
          />
        ))}
      </Table.Row>
      {collapsed
        && concept.children.map(child => (
          <Concept
            key={child.concept_id}
            concept={child}
            history={history}
            calculateColor={calculateColor}
            getConceptName={getConceptName}
            fromPreviousScored={fromPreviousScored}
          />
        ))}
    </Fragment>
  )
}

export default Concept
