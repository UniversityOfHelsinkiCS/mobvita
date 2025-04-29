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
import { GridGenerator, HexGrid, Layout, Hexagon, Text } from 'react-hexgrid'
import GridText from './GridText'

const ConstructionHexagon = ({ name, position, statistics, overallTotal, general }) => {
  const intl = useIntl()
  const { q, r, s } = position
  if (general) {
    return (
      <Hexagon className="hexagon-general" q={q} r={r} s={s}>
        <GridText className="hexagon-text">{name}</GridText>
      </Hexagon>
    )
  }

  let stat_total = statistics != undefined ? statistics.total : 0
  let stat_correct = statistics != undefined ? statistics.correct : 0

  let size_stat_total = stat_total
  if (size_stat_total > overallTotal){
    size_stat_total = overallTotal
  }
  const size = Math.floor((size_stat_total / overallTotal) * 10) + 5

  let colorClass = `scoreNone`
  let percentageCorrect = 0.0
  if (stat_total > 0){
    percentageCorrect = Math.round((stat_correct / stat_total) * 100)
    colorClass = `score${parseInt(percentageCorrect)}`
  }

  const hexagonTooltip = (
    <span>
      <div>{name}</div>
      {stat_total > 0 && (
        <div>
            <br/>{intl.formatMessage({ id: 'correct-performance' })}:{' '}
            {percentageCorrect}%
            <br/>{stat_correct}/{stat_total}
        </div>
      )}
    </span>
  )

  return (
    <Popup
      position="top center"
      content={hexagonTooltip}
      trigger={
        <Hexagon className="hexagon" q={q} r={r} s={s} fill="none">
          <Layout
            size={{ x: size, y: size }}
            flat
            spacing={1}
            className={colorClass}
            origin={{ x: 0, y: 0 }}
          >
            <Hexagon q={0} r={0} s={0} />
          </Layout>
          <GridText className="hexagon-text">{name}</GridText>
        </Hexagon>
      }
    />
  )
}

const positionOffset = coords => {
  return { q: coords.q - 4, r: coords.r, s: coords.s - 4 }
}

const HexagonTest = props => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const hexagonSize = { x: 15, y: 15 }
  const generator = GridGenerator.getGenerator('rectangle')
  const hexagons = generator.apply(generator, [35, 35])
  if (props.conceptsPending || !props.concepts || props.pending) return <Spinner fullHeight />

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
    let biggestValue = 0
    if(typeof no_outliner_max == 'number'){
      biggestValue = no_outliner_max
    } 
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
    return biggestValue
  }

  return (
    // <div style={{ background: 'white' }}>
    <div className="cont-tall pt-sm justify-center">
      <UncontrolledReactSVGPanZoom
        width={1000}
        height={800}
        background="#EFEFEF"
        defaultTool="auto"
      >
        <svg width={1000} height={800}>
          {/* # bigger->moves left, bigger->moves up, width, height  */}
          <HexGrid width={1000} height={800} viewBox="-40 280 500 540">
            <Layout size={hexagonSize} flat spacing={1} origin={{ x: 0, y: 0 }}>
              {hexagons.map(hex => (
                <Hexagon q={hex.q} r={hex.r} s={hex.s} />
              ))}

              <Hexagon
                className="hexagon-root"
                q={props.root_hex_coord.q}
                r={props.root_hex_coord.r}
                s={props.root_hex_coord.s}
              >
                <Text className="hexagon-root"><FormattedMessage id={learningLanguage} /></Text>
              </Hexagon>

              {props.concepts
                .filter(concept => concept.hex_coords)
                .map(hex => (
                  <ConstructionHexagon
                    name={hex.name}
                    position={hex.hex_coords}
                    statistics={accumulatedConcepts[hex.concept_id]}
                    overallTotal={getBiggestHistoryTotal()}
                    general={hex.hexmap_general}
                    // position={positionOffset(hex.coords)}
                  />
                ))}
            </Layout>
          </HexGrid>
        </svg>
      </UncontrolledReactSVGPanZoom>
    </div>
  )
}

export default HexagonTest
