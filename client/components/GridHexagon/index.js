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

const dummyData = [{'size': 12, 'coords': {'q': 4, 'r': 15, 's': -19}, 'name': 'РУССКИЙ'},
{'size': 12, 'coords': {'q': 4, 'r': 16, 's': -20}, 'name': 'POS: Noun'},
{'size': 12, 'coords': {'q': 7, 'r': 18, 's': -25}, 'name': 'III declension'},
{'size': 12,
 'coords': {'q': 7, 'r': 20, 's': -27},
 'name': 'IV declension: pluralia tantum genitive'},
{'size': 12, 'coords': {'q': 2, 'r': 20, 's': -22}, 'name': 'Plural'},
{'size': 12, 'coords': {'q': 4, 'r': 17, 's': -21}, 'name': 'Nominative'},
{'size': 12, 'coords': {'q': 4, 'r': 18, 's': -22}, 'name': 'Genitive'},
{'size': 12,
 'coords': {'q': 5, 'r': 21, 's': -26},
 'name': 'I declension: заяц'},
{'size': 12,
 'coords': {'q': 5, 'r': 19, 's': -24},
 'name': 'I declension: музей/ воробей'},
{'size': 12,
 'coords': {'q': 8, 'r': 20, 's': -28},
 'name': 'V declension: невежа/ ябеда'},
{'size': 12, 'coords': {'q': 4, 'r': 19, 's': -23}, 'name': 'Accusative'},
{'size': 12, 'coords': {'q': 3, 'r': 19, 's': -22}, 'name': 'Dative'},
{'size': 12, 'coords': {'q': 3, 'r': 20, 's': -23}, 'name': 'Locative'},
{'size': 12, 'coords': {'q': 4, 'r': 20, 's': -24}, 'name': 'Instrumental'},
{'size': 12, 'coords': {'q': 3, 'r': 16, 's': -19}, 'name': 'POS: Adjective'},
{'size': 12,
 'coords': {'q': 1, 'r': 21, 's': -22},
 'name': 'Gender: Masculine'},
{'size': 12,
 'coords': {'q': 1, 'r': 22, 's': -23},
 'name': 'Gender: Feminine'},
{'size': 12, 'coords': {'q': 0, 'r': 22, 's': -22}, 'name': 'Gender: Neuter'},
{'size': 12,
 'coords': {'q': 0, 'r': 20, 's': -20},
 'name': 'Short Adjective: Predicative'},
{'size': 12,
 'coords': {'q': 2, 'r': 18, 's': -20},
 'name': 'Adjective: Comparative'},
{'size': 12,
 'coords': {'q': 1, 'r': 19, 's': -20},
 'name': 'Adjective: Superlative'},
{'size': 12, 'coords': {'q': 1, 'r': 16, 's': -17}, 'name': 'Tense: Present'},
{'size': 12, 'coords': {'q': 3, 'r': 15, 's': -18}, 'name': 'POS: Verb'},
{'size': 12,
 'coords': {'q': -1, 'r': 17, 's': -16},
 'name': 'Mood: Imperative'},
{'size': 12, 'coords': {'q': 0, 'r': 17, 's': -17}, 'name': 'Tense: Past'},
{'size': 12,
 'coords': {'q': -2, 'r': 17, 's': -15},
 'name': 'Mood: Conditional'},
{'size': 12,
 'coords': {'q': 2, 'r': 16, 's': -18},
 'name': 'Participle: Present Active'},
{'size': 12,
 'coords': {'q': 0, 'r': 18, 's': -18},
 'name': 'Participle: Present Passive'},
{'size': 12,
 'coords': {'q': 1, 'r': 17, 's': -18},
 'name': 'Participle: Past Active'},
{'size': 12,
 'coords': {'q': 0, 'r': 19, 's': -19},
 'name': 'Participle: Past Passive'},
{'size': 12, 'coords': {'q': 4, 'r': 14, 's': -18}, 'name': 'SYNTAX'},
{'size': 12,
 'coords': {'q': 8, 'r': 16, 's': -24},
 'name': 'Numeral: Ordinal'},
{'size': 12,
 'coords': {'q': 0, 'r': 18, 's': -18},
 'name': 'Tense: Future simple'},
{'size': 12,
 'coords': {'q': -1, 'r': 19, 's': -18},
 'name': 'Tense: Future analytic'},
{'size': 12, 'coords': {'q': 5, 'r': 16, 's': -21}, 'name': 'POS: Numeral'},
{'size': 12, 'coords': {'q': 5, 'r': 15, 's': -20}, 'name': 'POS: Pronoun'},
{'size': 12, 'coords': {'q': 0, 'r': 16, 's': -16}, 'name': 'I conjugation'},
{'size': 12, 'coords': {'q': 0, 'r': 17, 's': -17}, 'name': 'II conjugation'},
{'size': 12,
 'coords': {'q': -1, 'r': 18, 's': -17},
 'name': 'Irregular conjugation'},
{'size': 12,
 'coords': {'q': 3, 'r': 13, 's': -16},
 'name': 'Government: Preposition ⇒ case'},
{'size': 12,
 'coords': {'q': 2, 'r': 13, 's': -15},
 'name': 'Government : Verb ⇒ case'},
{'size': 12,
 'coords': {'q': 2, 'r': 12, 's': -14},
 'name': 'Government : Noun'},
{'size': 12,
 'coords': {'q': 1, 'r': 12, 's': -13},
 'name': 'Government : Adjective'},
{'size': 12,
 'coords': {'q': 1, 'r': 15, 's': -16},
 'name': 'ASPECT: Imperfective Perfective'},
{'size': 12,
 'coords': {'q': 0, 'r': 15, 's': -15},
 'name': 'Verbs of Motion: unprefixed'},
{'size': 12, 'coords': {'q': 4, 'r': 12, 's': -16}, 'name': 'Construction'},
{'size': 12,
 'coords': {'q': 0, 'r': 15, 's': -15},
 'name': 'Verbs of Motion: prefixed'},
{'size': 12, 'coords': {'q': 0, 'r': 16, 's': -16}, 'name': 'Reflexive verb'},
{'size': 12, 'coords': {'q': 2, 'r': 15, 's': -17}, 'name': 'Infinitive'},
{'size': 12,
 'coords': {'q': 6, 'r': 16, 's': -22},
 'name': 'Numeral: Cardinal'},
{'size': 12,
 'coords': {'q': 9, 'r': 16, 's': -25},
 'name': 'Numeral: Collective'},
{'size': 12,
 'coords': {'q': 2, 'r': 11, 's': -13},
 'name': 'Government : Numeral'},
{'size': 12, 'coords': {'q': 4, 'r': 13, 's': -17}, 'name': 'Agreement: NP'},
{'size': 12,
 'coords': {'q': 3, 'r': 12, 's': -15},
 'name': 'Government : Verb ⇒ preposition'},
{'size': 12,
 'coords': {'q': 6, 'r': 15, 's': -21},
 'name': 'Pronoun : Personal он'},
{'size': 12,
 'coords': {'q': 7, 'r': 14, 's': -21},
 'name': 'Pronoun : Possessive мой'},
{'size': 12,
 'coords': {'q': 8, 'r': 14, 's': -22},
 'name': 'Pronoun : Demonstrative этот'},
{'size': 12,
 'coords': {'q': 8, 'r': 13, 's': -21},
 'name': 'Pronoun : Interrogative кто'},
{'size': 12,
 'coords': {'q': 10, 'r': 13, 's': -23},
 'name': 'Pronoun : Negative никто'},
{'size': 12,
 'coords': {'q': 10, 'r': 12, 's': -22},
 'name': 'Pronoun : Indefinite некто'},
{'size': 12,
 'coords': {'q': 9, 'r': 13, 's': -22},
 'name': 'Pronoun : Definite другой'},
{'size': 12,
 'coords': {'q': 11, 'r': 12, 's': -23},
 'name': 'Pronoun : Reflexive себя'},
{'size': 12,
 'coords': {'q': 11, 'r': 11, 's': -22},
 'name': 'Pronoun : Reciprocal друг друга'},
{'size': 12,
 'coords': {'q': 9, 'r': 19, 's': -28},
 'name': 'Noun: genitive plural/ fleeting vowel'},
{'size': 12,
 'coords': {'q': 7, 'r': 16, 's': -23},
 'name': 'Numeral: Cardinal analytic'},
{'size': 12,
 'coords': {'q': 8, 'r': 19, 's': -27},
 'name': 'Noun: genitive plural'},
{'size': 12,
 'coords': {'q': 8, 'r': 18, 's': -26},
 'name': 'Noun: animate object'},
{'size': 12, 'coords': {'q': -2, 'r': 20, 's': -18}, 'name': 'Transgressive'},
{'size': 12, 'coords': {'q': 5, 'r': 13, 's': -18}, 'name': 'Derivation'},
{'size': 12,
 'coords': {'q': 7, 'r': 12, 's': -19},
 'name': 'Fleeting vowels'},
{'size': 12,
 'coords': {'q': 5, 'r': 14, 's': -19},
 'name': 'Morpho-Phonology'},
{'size': 12,
 'coords': {'q': 8, 'r': 11, 's': -19},
 'name': 'Vowel Alternation'},
{'size': 12,
 'coords': {'q': 6, 'r': 13, 's': -19},
 'name': 'Consonant Alternation'},
{'size': 12, 'coords': {'q': 7, 'r': 11, 's': -18}, 'name': 'Stress'},
{'size': 12,
 'coords': {'q': 12, 'r': 11, 's': -23},
 'name': 'Pronoun: сам/один'},
{'size': 12,
 'coords': {'q': 5, 'r': 20, 's': -25},
 'name': 'I declension: санаторий'},
{'size': 12,
 'coords': {'q': 5, 'r': 18, 's': -23},
 'name': 'I declension: basic'},
{'size': 12,
 'coords': {'q': 4, 'r': 22, 's': -26},
 'name': 'I declension: карандаш'},
{'size': 12,
 'coords': {'q': 3, 'r': 23, 's': -26},
 'name': 'I declension: адрес'},
{'size': 12,
 'coords': {'q': 4, 'r': 23, 's': -27},
 'name': 'I declension: солдат/ сапог'},
{'size': 12,
 'coords': {'q': 3, 'r': 24, 's': -27},
 'name': 'I declension: -янин'},
{'size': 12,
 'coords': {'q': 5, 'r': 22, 's': -27},
 'name': 'I declension: дерево'},
{'size': 12,
 'coords': {'q': 5, 'r': 23, 's': -28},
 'name': 'I declension: в+тылу'},
{'size': 12,
 'coords': {'q': 2, 'r': 24, 's': -26},
 'name': 'I declension: нож/сторож'},
{'size': 12,
 'coords': {'q': 4, 'r': 24, 's': -28},
 'name': 'I declension: в+краю/края'},
{'size': 12,
 'coords': {'q': 6, 'r': 18, 's': -24},
 'name': 'II declension: basic'},
{'size': 12,
 'coords': {'q': 6, 'r': 19, 's': -25},
 'name': 'II declension: -ня'},
{'size': 12,
 'coords': {'q': 6, 'r': 20, 's': -26},
 'name': 'II declension: статья'},
{'size': 12,
 'coords': {'q': 7, 'r': 19, 's': -26},
 'name': 'IV declension: pluralia tantum'},
{'size': 12,
 'coords': {'q': 2, 'r': 17, 's': -19},
 'name': 'Adjective: basic'},
{'size': 12,
 'coords': {'q': 1, 'r': 18, 's': -19},
 'name': 'Adjective: хорошего'},
{'size': 12,
 'coords': {'q': 0, 'r': 19, 's': -19},
 'name': 'Possessive adjective: лисий'},
{'size': 12,
 'coords': {'q': 0, 'r': 20, 's': -20},
 'name': 'Possessive adjective: мамин'},
{'size': 12,
 'coords': {'q': 9, 'r': 15, 's': -24},
 'name': 'Numeral: Ordinal analytic'}]

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
          {/* # bigger->moves left, bigger->moves up, width, height  */}
          <HexGrid width={1400} height={1000} viewBox="-150 300 500 400">
            <Layout size={hexagonSize} flat spacing={1} origin={{ x: 0, y: 0 }}>
              {hexagons.map(hex => (
                <Hexagon q={hex.q} r={hex.r} s={hex.s}>
                  {/* <Text className="hexagon-text">{HexUtils.getID(hex)}</Text> */}
                </Hexagon>
              ))}

              <Hexagon className="hexagon-root" q={dummyData[0].coords.q} r={dummyData[0].coords.r} s={dummyData[0].coords.s}>
                <Text className="hexagon-root">{dummyData[0].name}</Text>
              </Hexagon>

              {/* <Path
                className="hexagon-path"
                start={new Hex(10, 18, -28)}
                end={new Hex(9, 21, -31)}
              /> */}

              {dummyData.slice(1, dummyData.length).map(hex => (
                <ConstructionHexagon
                  name={hex.name}
                  position={{ q: hex.coords.q, r: hex.coords.r, s: hex.coords.s }}
                  // position={positionOffset(hex.coords)}
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