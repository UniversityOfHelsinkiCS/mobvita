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

const ConstructionHexagon = ({ name, position, statistics, overallTotal }) => {
  const size = Math.floor((statistics.total / overallTotal) * 10) + 5
  const { q, r, s } = position
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
          {/*
          <foreignObject x="-12" y="-8" width="24" height="20">
            <div className="align-center justify-center" xmlns="http://www.w3.org/1999/xhtml">
              <span
                style={{
                  fontSize: '.22em',
                  textAlign: 'center',
                  lineHeight: '130%',
                  textOverflow: 'ellipsis',
                }}
              >
                <br />
                {name}
              </span>
            </div>
          </foreignObject>

          <Text className="hexagon-text">{name}</Text> */}
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

  // const moreHexas = GridGenerator.parallelogram(-2, 2, -2, 2)

  const generator = GridGenerator.getGenerator('rectangle')
  const hexagons = generator.apply(generator, [35, 35])
  if (props.conceptsPending || !props.concepts || props.pending) return <Spinner fullHeight />

  if (!props.root_hex_coord || props.exerciseHistory?.length < 1) return <div>Not available</div>

  const current = props.exerciseHistory[0].concept_statistics

  const getBiggestHistoryTotal = () => {
    let biggestValue = 0

    props.exerciseHistory.map(historyObj => {
      const statsObj = historyObj.concept_statistics
      Object.keys(statsObj).map(key => {
        if (statsObj[key].total > biggestValue) biggestValue = statsObj[key].total
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

              {/* <Path
                  className="hexagon-path"
                  start={new Hex(10, 18, -28)}
                  end={new Hex(9, 21, -31)}
                /> */}

              {props.concepts
                .filter(concept => concept.hex_coords)
                .map(hex => (
                  <ConstructionHexagon
                    name={hex.short_name}
                    position={hex.hex_coords}
                    statistics={current[hex.concept_id]}
                    overallTotal={getBiggestHistoryTotal()}
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
