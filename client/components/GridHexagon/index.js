import React from 'react'
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom'
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

const dummyData = [
  {
    name: 'SYNTAX',
    coords: { q: 7, r: 17, s: -24 },
    size: 12,
  },
  {
    name: 'POS: Noun',
    coords: { q: 7, r: 19, s: -26 },
    size: 12,
  },
  {
    name: 'POS: Verb',
    coords: { q: 6, r: 19, s: -25 },
    size: 12,
  },
  {
    name: 'Participle: Present Active -va',
    coords: { q: 6, r: 18, s: -24 },
    size: 12,
  },
  {
    name: 'Genitive',
    coords: { q: 8, r: 17, s: -25 },
    size: 12,
  },
  {
    name: 'POS: Pronoun',
    coords: { q: 8, r: 18, s: -26 },
    size: 12,
  },
  {
    name: 'NEGATIVE: Indicative verb',
    coords: { q: 5, r: 18, s: -23 },
    size: 12,
  },
  {
    name: 'Tense: Present',
    coords: { q: 5, r: 19, s: -24 },
    size: 12,
  },
  {
    name: 'Participle: Present Passive -ttava',
    coords: { q: 5, r: 20, s: -25 },
    size: 12,
  },
  {
    name: 'Case',
    coords: { q: 7, r: 20, s: -27 },
    size: 12,
  },
  {
    name: 'Nominative',
    coords: { q: 7, r: 21, s: -28 },
    size: 12,
  },
  {
    name: 'POS: Numeral',
    coords: { q: 8, r: 19, s: -27 },
    size: 12,
  },
  {
    name: 'Plural',
    coords: { q: 8, r: 20, s: -28 },
    size: 12,
  },
  {
    name: 'NUM: Cardinal',
    coords: { q: 9, r: 18, s: -27 },
    size: 12,
  },
  {
    name: 'GOV: Adposition ⇒ Case',
    coords: { q: 7, r: 16, s: -23 },
    size: 12,
  },
  {
    name: 'POS: Verb',
    coords: { q: 6, r: 17, s: -23 },
    size: 12,
  },
  {
    name: 'Vowel harmony',
    coords: { q: 9, r: 16, s: -25 },
    size: 12,
  },
  {
    name: 'ADJ: Comparative',
    coords: { q: 6, r: 20, s: -26 },
    size: 12,
  },
  {
    name: 'Tense: Perfect',
    coords: { q: 8, r: 16, s: -24 },
    size: 12,
  },
  {
    name: 'Paradigm: sanoa',
    coords: { q: 5, r: 21, s: -26 },
    size: 12,
  },
  {
    name: 'II Infinitive -maan',
    coords: { q: 4, r: 21, s: -25 },
    size: 12,
  },

  {
    name: 'Agreement: NP',
    coords: { q: 9, r: 17, s: -26 },
    size: 12,
  },
  {
    name: 'Participle: Agentive -ma',
    coords: { q: 4, r: 19, s: -23 },
    size: 12,
  },
  {
    name: 'ADJ: Superlative',
    coords: { q: 10, r: 16, s: -26 },
    size: 12,
  },
  {
    name: 'Instructive -en',
    coords: { q: 5, r: 17, s: -22 },
    size: 12,
  },
  {
    name: 'Partitive',
    coords: { q: 10, r: 17, s: -27 },
    size: 12,
  },
]

const ConstructionHexagon = ({ name, position }) => {
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

  const sizes = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  const { q, r, s } = position

  const colorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)]
  const size = sizes[Math.floor(Math.random() * sizes.length)]

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

          {/* <Text className="hexagon-text">{name}</Text> */}
        </Hexagon>
      }
    />
  )
}

const positionOffset = coords => {
  return { q: coords.q - 4, r: coords.r, s: coords.s - 4 }
}

const HexagonTest = () => {
  const hexagonSize = { x: 15, y: 15 }
  // const moreHexas = GridGenerator.parallelogram(-2, 2, -2, 2)

  const generator = GridGenerator.getGenerator('rectangle')
  const hexagons = generator.apply(generator, [35, 35])

  return (
    // <div style={{ background: 'white' }}>
    <div className="cont-tall pt-sm justify-center">
      <UncontrolledReactSVGPanZoom
        width={1200}
        height={1000}
        // background="#FFF"
        background="#EFEFEF"
        defaultTool="auto"
      >
        <svg width={1200} height={1000}>
          # bigger->moves left, bigger->moves up, width, height 
          <HexGrid width={1400} height={1000} viewBox="-150 300 500 400">
            <Layout size={hexagonSize} flat spacing={1} origin={{ x: 0, y: 0 }}>
              {hexagons.map(hex => (
                <Hexagon q={hex.q} r={hex.r} s={hex.s}>
                  {/* <Text className="hexagon-text">{HexUtils.getID(hex)}</Text> */}
                </Hexagon>
              ))}

              <Hexagon className="hexagon-root" q={3} r={18} s={-21}>
                <Text className="hexagon-root">Suomi</Text>
              </Hexagon>

              {/* <Path
                className="hexagon-path"
                start={new Hex(10, 18, -28)}
                end={new Hex(9, 21, -31)}
              /> */}

              {dummyData.map(hex => (
                <ConstructionHexagon
                  name={hex.name}
                  // position={{ q: hex.coords.q, r: hex.coords.r, s: hex.coords.s }}
                  position={positionOffset(hex.coords)}
                />
              ))}

              {/* <ConstructionHexagon name="Test construction" position={[4, 19, -25]} />
              <ConstructionHexagon name="Test construction" position={[9, 16, -25]} />
              <ConstructionHexagon name="Test construction" position={[9, 15, -24]} />
              <ConstructionHexagon name="Test construction" position={[8, 15, -23]} />
              <ConstructionHexagon name="Test construction" position={[9, 17, -26]} />
              <ConstructionHexagon name="Test construction" position={[10, 18, -28]} />
              <ConstructionHexagon name="Test construction" position={[7, 15, -22]} />
              <ConstructionHexagon name="Test construction" position={[7, 14, -21]} />
              <ConstructionHexagon name="Test construction" position={[7, 13, -20]} />
              <ConstructionHexagon name="Test construction" position={[6, 13, -19]} />
              <ConstructionHexagon name="Test construction" position={[7, 12, -19]} />
              <ConstructionHexagon name="Test construction" position={[6, 12, -18]} />
              <ConstructionHexagon name="Test construction" position={[7, 11, -18]} />
              <ConstructionHexagon name="Test construction" position={[8, 11, -19]} />
              <ConstructionHexagon name="Test construction" position={[8, 12, -20]} />
              <ConstructionHexagon name="Test construction" position={[6, 21, -27]} />
              <ConstructionHexagon name="Test construction" position={[7, 21, -27]} />
              <ConstructionHexagon name="Test construction" position={[8, 21, -27]} />
              <ConstructionHexagon name="Test construction" position={[9, 21, -27]} /> */}
            </Layout>
          </HexGrid>
        </svg>
      </UncontrolledReactSVGPanZoom>
    </div>
  )
}

export default HexagonTest
