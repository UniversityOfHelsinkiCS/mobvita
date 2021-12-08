import React, { useState, Fragment } from 'react'
import { Table, Icon, Popup } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'

const ConceptTitle = ({ title, isParent }) => {
  const TITLE_MAX_LENGTH = 28
  const hasTooLongWord = title.split(' ').some(w => w.length > TITLE_MAX_LENGTH)

  const getTitleToDisplay = () => {
    if (title.length > TITLE_MAX_LENGTH || hasTooLongWord) {
      return `${title.slice(0, TITLE_MAX_LENGTH)}...`
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
          <div style={{ marginLeft: '10px' }}>{getTitleToDisplay()}</div>
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
  bgColor,
  ...props
}) => {
  const ownStatistics = test.concept_statistics[concept.id]

  const statistics =
    !ownStatistics || ownStatistics.total === 0
      ? fromPreviousScored(concept.id, test.date)
      : ownStatistics

  const minHeight = 8
  const maxHeight = 70

  const calculateDiameter = () => {
    if (statistics.total === 0) return 0

    const maxRadius = maxHeight / 2
    const maxArea = Math.PI * maxRadius ** 2
    const area = (statistics.total / biggestHistoryTotal) * maxArea
    const radius = Math.sqrt(area / Math.PI)
    const diameter = Math.round(radius * 2)

    return diameter > minHeight ? diameter : minHeight
  }

  return (
    <Popup
      {...props}
      content={<PopupContent correct={statistics.correct} total={statistics.total} />}
      trigger={
        <Table.Cell style={{ padding: 0, background: bgColor }}>
          <div
            className="justify-center align-center"
            style={{
              height: `${maxHeight + 5}px`,
              width: '100%',
            }}
          >
            <div
              style={{
                backgroundColor: calculateColor(statistics),
                height: `${calculateDiameter()}px`,
                width: `${calculateDiameter()}px`,
                borderRadius: '50%',
                display: 'inline-block',
              }}
            />
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
  indentation,
  ...props
}) => {
  const [collapsed, setCollapsed] = useState(false)

  const cellBgColor = () => {
    if (indentation >= 40) return 'rgb(235, 235, 235)'
    if (indentation >= 20) return 'rgb(247, 247, 247)'
    return '#FFF'
  }

  return (
    <Fragment {...props}>
      <Table.Row onClick={() => setCollapsed(!collapsed)}>
        <Table.Cell style={{ paddingLeft: '0.1em', background: cellBgColor() }}>
          <div
            className="flex"
            style={{ textOverflow: 'ellipsis', marginLeft: `${indentation}px` }}
          >
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
            bgColor={cellBgColor()}
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
            indentation={indentation + 20}
          />
        ))}
    </Fragment>
  )
}

export default Concept
