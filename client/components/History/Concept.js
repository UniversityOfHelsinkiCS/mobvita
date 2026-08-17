import React, { useState, Fragment } from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import CustomTooltip from 'Components/CustomTooltip'
import { FormattedMessage, useIntl } from 'react-intl'

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
    <CustomTooltip permanent title={<div>{title}</div>}>
      {isParent ? (
        <div className="bold">{getTitleToDisplay()}</div>
      ) : (
        <div style={{ marginLeft: '10px' }}>{getTitleToDisplay()}</div>
      )}
    </CustomTooltip>
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
  const intl = useIntl()
  const calculateDiameter = () => {
    if (statistics.total === 0) return 0

    const maxRadius = maxHeight / 2
    const maxArea = Math.PI * maxRadius ** 2
    const area = (statistics.total / biggestHistoryTotal) * maxArea
    const radius = Math.sqrt(area / Math.PI)
    const diameter = Math.round(radius * 2)

    return diameter > minHeight ? diameter : minHeight
  }

  const percentageCorrect = Math.round((statistics.correct / statistics.total) * 100)

  const tooltip = (
    <span>
      {statistics.total > 0 && (
        <div>
          {statistics.correct}/{statistics.total} {intl.formatMessage({ id: 'correct' })}:{' '}
          {percentageCorrect}%
        </div>
      )}
    </span>
  )

  return (
    <TableCell style={{ padding: 0, background: bgColor }}>
      <div
        className="justify-center align-center"
        style={{
          height: `${maxHeight + 5}px`,
          width: '100%',
        }}
      >
        <CustomTooltip {...props} permanent title={tooltip}>
          <div
            style={{
              backgroundColor: calculateColor(statistics),
              height: `${calculateDiameter()}px`,
              width: `${calculateDiameter()}px`,
              borderRadius: '50%',
              display: 'inline-block',
            }}
          />
        </CustomTooltip>
      </div>
    </TableCell>
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
      <TableRow onClick={() => setCollapsed(!collapsed)} data-cy="history-concept-row">
        <TableCell style={{ paddingLeft: '0.1em', background: cellBgColor() }}>
          <div
            className="flex"
            style={{ textOverflow: 'ellipsis', marginLeft: `${indentation}px` }}
          >
            {concept.children.length > 0 && (
              <div>{collapsed ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}</div>
            )}
            <ConceptTitle
              title={getConceptName(concept.id)}
              isParent={concept.children.length > 0}
            />
          </div>
        </TableCell>
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
      </TableRow>
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
