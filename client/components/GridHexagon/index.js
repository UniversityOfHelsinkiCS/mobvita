import React from 'react'
import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom'
import { useSelector } from 'react-redux'
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
  const { concepts, root_hex_coord, pending: conceptsPending } = useSelector(({ metadata }) => metadata)
  const learningLanguage = useSelector(learningLanguageSelector)
    
  const hexagonSize = { x: 15, y: 15 }
  // const moreHexas = GridGenerator.parallelogram(-2, 2, -2, 2)

  const generator = GridGenerator.getGenerator('rectangle')
  const hexagons = generator.apply(generator, [35, 35])
  if (conceptsPending || !concepts) return <Spinner fullHeight />
  else if (!root_hex_coord) return (<div>Not available</div>)
  else {
    const data = concepts.filter(concept => concept.hex_coords)
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
            {/* # bigger->moves left, bigger->moves up, width, height  */}
            <HexGrid width={1400} height={1000} viewBox="-150 300 500 400">
              <Layout size={hexagonSize} flat spacing={1} origin={{ x: 0, y: 0 }}>
                {hexagons.map(hex => (
                  <Hexagon q={hex.q} r={hex.r} s={hex.s}>
                  </Hexagon>
                ))}

                <Hexagon className="hexagon-root" q={root_hex_coord.q} r={root_hex_coord.r} s={root_hex_coord.s}>
                  <Text className="hexagon-root">{learningLanguage}</Text>
                </Hexagon>

                {/* <Path
                  className="hexagon-path"
                  start={new Hex(10, 18, -28)}
                  end={new Hex(9, 21, -31)}
                /> */}

                {data.map(hex => (
                  <ConstructionHexagon
                    name={hex.short_name}
                    position={hex.hex_coords}
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
}

export default HexagonTest