/* eslint-disable no-restricted-syntax */
/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom'
import { useSelector } from 'react-redux'
import { useIntl, FormattedMessage } from 'react-intl'
import { learningLanguageSelector } from 'Utilities/common'
import Spinner from 'Components/Spinner'
import { Popup } from 'semantic-ui-react'
import './App.css'
import GridText from './GridText'

// --- Flat-top hexagon math ---

const HEX_SIZE = 15

// Axial (q, r) → SVG pixel center for flat-top orientation
const hexToPixel = (q, r, size = HEX_SIZE) => ({
  x: size * 1.5 * q,
  y: size * (Math.sqrt(3) / 2 * q + Math.sqrt(3) * r),
})

// SVG polygon points string for a flat-top hexagon centered at (0, 0)
const flatHexPoints = size =>
  Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i
    return `${size * Math.cos(angle)},${size * Math.sin(angle)}`
  }).join(' ')

// Generate a rectangle grid of axial hex coordinates (flat-top)
const generateRectangle = (width, height) => {
  const hexs = []
  for (let q = 0; q < width; q++) {
    const offset = -Math.floor(q / 2)
    for (let r = offset; r < height + offset; r++) {
      hexs.push({ q, r, s: -q - r })
    }
  }
  return hexs
}

const OUTER_HEX_POINTS = flatHexPoints(HEX_SIZE)

// --- Components ---

const ConstructionHexagon = ({ name, position, statistics, overallTotal, general }) => {
  const intl = useIntl()
  const { q, r } = position
  const { x, y } = hexToPixel(q, r)

  if (general) {
    return (
      <g className="hexagon-general" transform={`translate(${x},${y})`}>
        <g className="hexagon">
          <polygon points={OUTER_HEX_POINTS} />
        </g>
        <GridText className="hexagon-text">{name}</GridText>
      </g>
    )
  }

  const stat_total = statistics != undefined ? statistics.total : 0
  const stat_correct = statistics != undefined ? statistics.correct : 0

  let size_stat_total = stat_total
  if (size_stat_total > overallTotal) {
    size_stat_total = overallTotal
  }
  const innerSize = Math.floor((size_stat_total / overallTotal) * 10) + 5
  const innerPoints = flatHexPoints(innerSize)

  let colorClass = 'scoreNone'
  let percentageCorrect = 0.0
  if (stat_total > 0) {
    percentageCorrect = Math.round((stat_correct / stat_total) * 100)
    colorClass = `score${parseInt(percentageCorrect)}`
  }

  const hexagonTooltip = (
    <span>
      <div>{name}</div>
      {stat_total > 0 && (
        <div>
          <br />{intl.formatMessage({ id: 'correct-performance' })}:{' '}
          {percentageCorrect}%
          <br />{stat_correct}/{stat_total}
        </div>
      )}
    </span>
  )

  return (
    <Popup
      position="top center"
      content={hexagonTooltip}
      trigger={
        <g className="hexagon" transform={`translate(${x},${y})`}>
          <g className="hexagon">
            <polygon points={OUTER_HEX_POINTS} />
          </g>
          <g className={colorClass}>
            <g className="hexagon">
              <polygon points={innerPoints} />
            </g>
          </g>
          <GridText className="hexagon-text">{name}</GridText>
        </g>
      }
    />
  )
}

const HexagonTest = props => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const hexagons = generateRectangle(35, 35)

  if (props.conceptsPending || !props.concepts || props.pending) return <Spinner />

  if (!props.root_hex_coord || props.exerciseHistory?.length < 1 || !props.exerciseHistory)
    return <div>Not available</div>

  const no_outliner_max = 20 // props.exerciseHistory[0].no_oultiner_max
  const accumulatedConcepts = props.exerciseHistory.reduce((acc, elem) => {
    const concepts = Object.entries(elem.concept_statistics)
    for (const [concept, stats] of concepts) {
      if (!acc[String(concept)]) {
        acc[String(concept)] = {
          correct: 0,
          total: 0,
        }
      }

      acc[String(concept)].correct += stats.correct
      acc[String(concept)].total += stats.total
    }
    return acc
  }, {})

  // console.log("props.exerciseHistory", props.exerciseHistory)
  // console.log("accumulatedTopics", accumulatedTopics)

  const getBiggestHistoryTotal = () => {
    if (typeof no_outliner_max === 'number') return no_outliner_max
    // Object.keys(accumulatedConcepts).map(key => {
    //   const concept = props.concepts.find(c => String(c.concept_id) === key)
    //   if (
    //     accumulatedConcepts[key].total > biggestValue &&
    //     !concept.hexmap_general &&
    //     concept.hex_coords
    //   ) {
    //     biggestValue = accumulatedConcepts[key].total
    //   }
    // })
    return 0
  }

  const { q: rq, r: rr } = props.root_hex_coord
  const rootPixel = hexToPixel(rq, rr)

  return (
    <div className="cont-tall pt-sm justify-center">
      <UncontrolledReactSVGPanZoom
        width={1000}
        height={800}
        background="#EFEFEF"
        defaultTool="auto"
      >
        <svg width={1000} height={800}>
          {/* bigger->moves left, bigger->moves up, width, height */}
          <svg width={1000} height={800} viewBox="-40 280 500 540">
            <g>
              {hexagons.map((hex, i) => {
                const { x, y } = hexToPixel(hex.q, hex.r)
                return (
                  <g key={i} transform={`translate(${x},${y})`}>
                    <g className="hexagon">
                      <polygon points={OUTER_HEX_POINTS} />
                    </g>
                  </g>
                )
              })}

              <g className="hexagon-root" transform={`translate(${rootPixel.x},${rootPixel.y})`}>
                <g className="hexagon">
                  <polygon points={OUTER_HEX_POINTS} />
                </g>
                <text className="hexagon-root" textAnchor="middle" y="0.3em">
                  <FormattedMessage id={learningLanguage} />
                </text>
              </g>

              {props.concepts
                .filter(concept => concept.hex_coords)
                .map((hex, i) => (
                  <ConstructionHexagon
                    key={i}
                    name={hex.name.replace(/<\/?[^>]+(>|$)/g, '')}
                    position={hex.hex_coords}
                    statistics={accumulatedConcepts[hex.concept_id]}
                    overallTotal={getBiggestHistoryTotal()}
                    general={hex.hexmap_general}
                  />
                ))}
            </g>
          </svg>
        </svg>
      </UncontrolledReactSVGPanZoom>
    </div>
  )
}

export default HexagonTest
