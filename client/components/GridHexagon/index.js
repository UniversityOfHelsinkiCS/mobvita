/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom'
import { useDispatch, useSelector } from 'react-redux'
import { learningLanguageSelector } from 'Utilities/common'
import Spinner from 'Components/Spinner'
import { Popup } from 'semantic-ui-react'
import './App.css'

import {
  GridGenerator,
  HexGrid,
  Layout,
  Path,
  Hexagon,
  Text,
  Pattern,
  Hex,
  HexUtils,
} from 'react-hexgrid'
import GridText from './GridText'

const ConstructionHexagon = ({ name, position, statistics, overallTotal, general }) => {
  const { q, r, s } = position
  if (general) {
    return (
      <Hexagon className="hexagon-general" q={q} r={r} s={s}>
        <GridText className="hexagon-text">{name}</GridText>
      </Hexagon>
    )
  }

  const size = Math.floor((statistics.total / overallTotal) * 10) + 5
  const colorClasses = [
    'red1',
    'red2',
    'red3',
    'red4',
    'red5',
    'green1',
    'green2',
    'green3',
    'green4',
    'green5',
  ]
  const colorClass = colorClasses[Math.floor((statistics.correct / statistics.total) * 10)]

  return (
    <Popup
      position="top center"
      content={name}
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

  if (!props.root_hex_coord || props.exerciseHistory?.length < 1) return <div>Not available</div>

  const current = props.exerciseHistory[0].concept_statistics

  /*
  const sumOfAll = props.exerciseHistory.reduce(
    (previousValue, currentValue) =>
      previousValue + currentValue.concept_statistics,
    {}
  )

  console.log('SUM OF ALL ', sumOfAll)
  const result = props.exerciseHistory.reduce((acc, elem) => {
    const consept_statistics = Object.entries(elem)
    console.log('cobs ', consept_statistics[0][1])
    for (const [correct, total] of consept_statistics[0][1]) {
      console.log('corr ', correct)
      console.log('total ', total)
      /*
      acc[correct] = acc[correct] || []
      acc[correct] += count
      acc[total] = acc[total] || []
      acc[total] += total
    }
    return acc
  }, {})
  */


  const getBiggestHistoryTotal = () => {
    let biggestValue = 0

    props.exerciseHistory.map(historyObj => {
      const statsObj = historyObj.concept_statistics
      Object.keys(statsObj).map(key => {
        const concept = props.concepts.find(c => c.concept_id === key)
        if (statsObj[key].total > biggestValue && !concept.hexmap_general)
          biggestValue = statsObj[key].total
      })
    })
    return biggestValue
  }

  return (
    // <div style={{ background: 'white' }}>
    <div className="cont-tall pt-sm justify-center">
      <UncontrolledReactSVGPanZoom
        width={1000}
        height={800}
        // background="#FFF"
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
                <Text className="hexagon-root">{learningLanguage}</Text>
              </Hexagon>

              {props.concepts
                .filter(concept => concept.hex_coords)
                .map(hex => (
                  <ConstructionHexagon
                    name={hex.short_name}
                    position={hex.hex_coords}
                    statistics={current[hex.concept_id]}
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
