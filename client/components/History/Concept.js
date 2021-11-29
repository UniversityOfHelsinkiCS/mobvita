import React, { useState, Fragment } from 'react'
import { Table, Icon, Popup } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'

const ConceptTitle = ({ title, isParent }) => {
  const TRUNCATED_TITLE_LENGTH = 15
  const hasTooLongWord = title.split(' ').some(w => w.length > TRUNCATED_TITLE_LENGTH)

  const getTitleToDisplay = () => {
    if (title.length > TRUNCATED_TITLE_LENGTH || hasTooLongWord) {
      return `${title.slice(0, TRUNCATED_TITLE_LENGTH)}...`
    }
    return title
  }

  return (
    <Popup
      content={<div>{title}</div>}
      trigger={
        isParent ? (
          <div className="bold">{getTitleToDisplay()}</div>
        ) : (
          <div style={{ marginLeft: '16px', textOverflow: 'ellipsis' }}>{getTitleToDisplay()}</div>
        )
      }
    />
  )
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

const StatisticCell = ({
  test,
  biggestHistoryTotal,
  concept,
  fromPreviousScored,
  calculateColor,
  ...props
}) => {
  const ownStatistics = test.concept_statistics[concept.id]
  const statistics =
    !ownStatistics || ownStatistics.total === 0
      ? fromPreviousScored(concept.id, test.date)
      : ownStatistics

  const colorWidth = (statistics.total / biggestHistoryTotal) * 100

  return (
    <Popup
      {...props}
      content={<PopupContent correct={statistics.correct} total={statistics.total} />}
      trigger={
        <Table.Cell style={{ padding: 0 }}>
          <div
            style={{
              height: '75px',
              width: `${colorWidth}%`,
              backgroundColor: calculateColor(statistics),
            }}
          >
            {' '}
          </div>
        </Table.Cell>
      }
    />
  )
}

const Concept = ({
  concept,
  history,
  calculateColor,
  biggestHistoryTotal,
  getConceptName,
  fromPreviousScored,
  ...props
}) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Fragment {...props}>
      <Table.Row onClick={() => setCollapsed(!collapsed)}>
        <Table.Cell style={{ paddingLeft: '0.1em' }}>
          <div className="flex" style={{ textOverflow: 'ellipsis' }}>
            {concept.children.length > 0 && (
              <div>
                <Icon name={collapsed ? 'angle down' : 'angle right'} />
              </div>
            )}
            <ConceptTitle
              title={getConceptName(concept.id)}
              isParent={concept.children.length > 0}
            />
          </div>
        </Table.Cell>
        {history.map(test => (
          <StatisticCell
            key={`${test.date}-${concept.id}-${Math.floor(Math.random() * 10000)}`}
            test={test}
            biggestHistoryTotal={biggestHistoryTotal}
            concept={concept}
            fromPreviousScored={fromPreviousScored}
            calculateColor={calculateColor}
          />
        ))}
      </Table.Row>
      {collapsed &&
        concept.children.map(child => (
          <Concept
            key={child.concept_id}
            concept={child}
            history={history}
            biggestHistoryTotal={biggestHistoryTotal}
            calculateColor={calculateColor}
            getConceptName={getConceptName}
            fromPreviousScored={fromPreviousScored}
          />
        ))}
    </Fragment>
  )
}

export default Concept
