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

const dummyData = [{'size': 12,
'coords': {'q': 3, 'r': 18, 's': -21},
'name': 'SUOMI'},
{'size': 12, 'coords': {'q': 3, 'r': 19, 's': -22}, 'name': 'POS: Noun'},
{'size': 12,
'coords': {'q': 7, 'r': 15, 's': -22},
'name': 'Consonant gradation k p t'},
{'size': 12,
'coords': {'q': 5, 'r': 24, 's': -29},
'name': 'Pluralia Tantum'},
{'size': 12,
'coords': {'q': 6, 'r': 20, 's': -26},
'name': 'Paradigm: koira'},
{'size': 12,
'coords': {'q': 7, 'r': 20, 's': -27},
'name': 'Paradigm: kala'},
{'size': 12, 'coords': {'q': 4, 'r': 16, 's': -20}, 'name': 'Compounds'},
{'size': 12, 'coords': {'q': 1, 'r': 20, 's': -21}, 'name': 'POS: Adverb'},
{'size': 12, 'coords': {'q': 5, 'r': 11, 's': -16}, 'name': ''},
{'size': 12,
'coords': {'q': 4, 'r': 17, 's': -21},
'name': 'Morpho- Phonology'},
{'size': 12,
'coords': {'q': 2, 'r': 20, 's': -22},
'name': 'ADJ: Comparative'},
{'size': 12,
'coords': {'q': 1, 'r': 21, 's': -22},
'name': 'ADJ: Superlative'},
{'size': 12,
'coords': {'q': 1, 'r': 18, 's': -19},
'name': 'Tense: Present'},
{'size': 12, 'coords': {'q': 2, 'r': 18, 's': -20}, 'name': 'POS: Verb'},
{'size': 12,
'coords': {'q': -3, 'r': 20, 's': -17},
'name': 'Mood: Imperative'},
{'size': 12,
'coords': {'q': -2, 'r': 21, 's': -19},
'name': 'Tense: Pluperfect'},
{'size': 12,
'coords': {'q': -4, 'r': 21, 's': -17},
'name': 'Mood: Conditional'},
{'size': 12,
'coords': {'q': 1, 'r': 19, 's': -20},
'name': 'Participle : Present Active -va'},
{'size': 12,
'coords': {'q': -1, 'r': 21, 's': -20},
'name': 'Participle : Present Passive -ttava'},
{'size': 12,
'coords': {'q': 0, 'r': 20, 's': -20},
'name': 'Participle : Past Active -nut'},
{'size': 12,
'coords': {'q': -2, 'r': 22, 's': -20},
'name': 'Participle : Past Passive -ttu'},
{'size': 12, 'coords': {'q': 3, 'r': 17, 's': -20}, 'name': 'SYNTAX'},
{'size': 12, 'coords': {'q': 6, 'r': 19, 's': -25}, 'name': 'NUM: Ordinal'},
{'size': 12,
'coords': {'q': 0, 'r': 19, 's': -19},
'name': 'Tense: Imperfect (past)'},
{'size': 12,
'coords': {'q': -1, 'r': 20, 's': -19},
'name': 'Tense: Perfect'},
{'size': 12, 'coords': {'q': 4, 'r': 19, 's': -23}, 'name': 'POS: Numeral'},
{'size': 12, 'coords': {'q': 4, 'r': 18, 's': -22}, 'name': 'POS: Pronoun'},
{'size': 12,
'coords': {'q': 0, 'r': 18, 's': -18},
'name': 'I Infinitive -a'},
{'size': 12,
'coords': {'q': -1, 'r': 19, 's': -18},
'name': 'II Infinitive -maan'},
{'size': 12,
'coords': {'q': -2, 'r': 20, 's': -18},
'name': 'III Infinitive -en -essa(an)'},
{'size': 12,
'coords': {'q': 3, 'r': 16, 's': -19},
'name': 'GOV: Adposition ⇒ Case'},
{'size': 12,
'coords': {'q': 3, 'r': 15, 's': -18},
'name': 'GOV: Verb ⇒ Case'},
{'size': 12, 'coords': {'q': 2, 'r': 16, 's': -18}, 'name': 'GOV: Noun'},
{'size': 12,
'coords': {'q': 1, 'r': 15, 's': -16},
'name': 'GOV: Adjective'},
{'size': 12,
'coords': {'q': -2, 'r': 19, 's': -17},
'name': 'II Infinitive -ma abes, elat...'},
{'size': 12,
'coords': {'q': -1, 'r': 17, 's': -16},
'name': 'Paradigm: muistaa'},
{'size': 12, 'coords': {'q': 4, 'r': 13, 's': -17}, 'name': 'Construction'},
{'size': 12,
'coords': {'q': 0, 'r': 17, 's': -17},
'name': 'Paradigm: sanoa'},
{'size': 12,
'coords': {'q': -1, 'r': 18, 's': -17},
'name': 'Reflexive muuttaa- muuttua'},
{'size': 12, 'coords': {'q': 5, 'r': 19, 's': -24}, 'name': 'NUM: Cardinal'},
{'size': 12,
'coords': {'q': 7, 'r': 19, 's': -26},
'name': 'NUM: Quantifier'},
{'size': 12, 'coords': {'q': 2, 'r': 15, 's': -17}, 'name': 'GOV: Numeral'},
{'size': 12, 'coords': {'q': 2, 'r': 17, 's': -19}, 'name': 'Agreement: NP'},
{'size': 12,
'coords': {'q': 3, 'r': 13, 's': -16},
'name': 'GOV: Verb ⇒ Adposition'},
{'size': 12,
'coords': {'q': 5, 'r': 18, 's': -23},
'name': 'PRON : Personal minä'},
{'size': 12,
'coords': {'q': 6, 'r': 17, 's': -23},
'name': 'PRON : Relative joka'},
{'size': 12,
'coords': {'q': 6, 'r': 18, 's': -24},
'name': 'PRON : Demonstrative tuo'},
{'size': 12,
'coords': {'q': 7, 'r': 18, 's': -25},
'name': 'PRON : Interrogative kuka'},
{'size': 12, 'coords': {'q': 0, 'r': 26, 's': -26}, 'name': '??? -tse'},
{'size': 12,
'coords': {'q': 7, 'r': 17, 's': -24},
'name': 'PRON : Indefinite joku'},
{'size': 12, 'coords': {'q': 0, 'r': 25, 's': -25}, 'name': '??? -sti'},
{'size': 12,
'coords': {'q': 8, 'r': 17, 's': -25},
'name': 'PRON : Reflexive itse'},
{'size': 12,
'coords': {'q': 8, 'r': 18, 's': -26},
'name': 'PRON : Reciprocal toisensa'},
{'size': 12,
'coords': {'q': 7, 'r': 13, 's': -20},
'name': 'Consonant gradation k/j'},
{'size': 12,
'coords': {'q': 5, 'r': 12, 's': -17},
'name': 'Nesessiivi- rakenne'},
{'size': 12, 'coords': {'q': 6, 'r': 21, 's': -27}, 'name': 'Paradigm: ovi'},
{'size': 12,
'coords': {'q': 7, 'r': 21, 's': -28},
'name': 'Paradigm: puhelin'},
{'size': 12, 'coords': {'q': 8, 'r': 20, 's': -28}, 'name': 'Paradigm: maa'},
{'size': 12,
'coords': {'q': 8, 'r': 21, 's': -29},
'name': 'Paradigm: sisar'},
{'size': 12,
'coords': {'q': -4, 'r': 20, 's': -16},
'name': 'NEGATIVE Imperative'},
{'size': 12,
'coords': {'q': 5, 'r': 21, 's': -26},
'name': 'Paradigm: bussi'},
{'size': 12, 'coords': {'q': 9, 'r': 20, 's': -29}, 'name': 'Paradigm: suo'},
{'size': 12,
'coords': {'q': 5, 'r': 22, 's': -27},
'name': 'Paradigm: käsi'},
{'size': 12,
'coords': {'q': 8, 'r': 22, 's': -30},
'name': 'Paradigm: manner tytär'},
{'size': 12,
'coords': {'q': 9, 'r': 21, 's': -30},
'name': 'Paradigm: koditon'},
{'size': 12,
'coords': {'q': 6, 'r': 22, 's': -28},
'name': 'Paradigm: valas'},
{'size': 12,
'coords': {'q': 7, 'r': 22, 's': -29},
'name': 'Paradigm: vastaus'},
{'size': 12,
'coords': {'q': 6, 'r': 23, 's': -29},
'name': 'Paradigm: uutuus'},
{'size': 12,
'coords': {'q': -3, 'r': 23, 's': -20},
'name': 'Participle : Agentive -ma'},
{'size': 12, 'coords': {'q': 5, 'r': 15, 's': -20}, 'name': 'Derivation'},
{'size': 12,
'coords': {'q': 5, 'r': 23, 's': -28},
'name': 'Paradigm: nainen'},
{'size': 12,
'coords': {'q': 2, 'r': 19, 's': -21},
'name': 'POS: Adjective'},
{'size': 12,
'coords': {'q': 0, 'r': 21, 's': -21},
'name': 'ADV: Comparative'},
{'size': 12,
'coords': {'q': -1, 'r': 22, 's': -21},
'name': 'ADV: Superlative'},
{'size': 12, 'coords': {'q': 3, 'r': 19, 's': -22}, 'name': 'POS: Noun'},
{'size': 12, 'coords': {'q': 3, 'r': 20, 's': -23}, 'name': 'Case'},
{'size': 12, 'coords': {'q': 3, 'r': 21, 's': -24}, 'name': 'Nominative'},
{'size': 12,
'coords': {'q': 4, 'r': 21, 's': -25},
'name': 'Accusative / Objective'},
{'size': 12,
'coords': {'q': 3, 'r': 22, 's': -25},
'name': 'Outer Locative allat, ablat, ades'},
{'size': 12,
'coords': {'q': 3, 'r': 24, 's': -27},
'name': 'Instructive -en'},
{'size': 12, 'coords': {'q': 3, 'r': 23, 's': -26}, 'name': 'Partitive %3E'},
{'size': 12,
'coords': {'q': 1, 'r': 24, 's': -25},
'name': 'Translative -ksi'},
{'size': 12, 'coords': {'q': 2, 'r': 24, 's': -26}, 'name': 'Essive -na'},
{'size': 12,
'coords': {'q': 2, 'r': 25, 's': -27},
'name': 'Comitative -ine(en)'},
{'size': 12, 'coords': {'q': 5, 'r': 16, 's': -21}, 'name': 'Vowel harmony'},
{'size': 12, 'coords': {'q': 4, 'r': 20, 's': -24}, 'name': 'Plural'},
{'size': 12, 'coords': {'q': 2, 'r': 22, 's': -24}, 'name': 'Genitive'},
{'size': 12,
'coords': {'q': 2, 'r': 23, 's': -25},
'name': 'Inner Locative illat, elat ines'},
{'size': 12,
'coords': {'q': 6, 'r': 15, 's': -21},
'name': 'Consonant gradation kk pp tt'},
{'size': 12,
'coords': {'q': 5, 'r': 20, 's': -25},
'name': 'Paradigm: talo'},
{'size': 12, 'coords': {'q': 1, 'r': 25, 's': -26}, 'name': 'Abessive -tta'},
{'size': 12,
'coords': {'q': -3, 'r': 21, 's': -18},
'name': 'IV Infinitive -minen -mista'},
{'size': 12,
'coords': {'q': -4, 'r': 22, 's': -18},
'name': 'V Infinitive -maisilla'},
{'size': 12,
'coords': {'q': -4, 'r': 24, 's': -20},
'name': 'Participle : Negative -maton'},
{'size': 12,
'coords': {'q': -6, 'r': 21, 's': -15},
'name': 'NEGATIVE Conditional'},
{'size': 12,
'coords': {'q': -6, 'r': 22, 's': -16},
'name': 'Mood: Potential'},
{'size': 12,
'coords': {'q': -7, 'r': 22, 's': -15},
'name': 'NEGATIVE Potential'},
{'size': 12,
'coords': {'q': 1, 'r': 17, 's': -18},
'name': 'NEGATIVE Indicative verb'},
{'size': 12,
'coords': {'q': 6, 'r': 11, 's': -17},
'name': 'Permissiivi- rakenne'},
{'size': 12, 'coords': {'q': -3, 'r': 18, 's': -15}, 'name': 'Paradigm:'},
{'size': 12,
'coords': {'q': -2, 'r': 18, 's': -16},
'name': 'Paradigm: saada&nbsp; juoda imuroida'},
{'size': 12,
'coords': {'q': -3, 'r': 17, 's': -14},
'name': 'Paradigm: nähda tehdä'},
{'size': 12,
'coords': {'q': -2, 'r': 17, 's': -15},
'name': 'Paradigm: tulla purra ajatella'},
{'size': 12,
'coords': {'q': -4, 'r': 18, 's': -14},
'name': 'Paradigm: haluta'},
{'size': 12,
'coords': {'q': -4, 'r': 17, 's': -13},
'name': 'Paradigm: nähda valita'},
{'size': 12,
'coords': {'q': -6, 'r': 19, 's': -13},
'name': 'Paradigm: vanheta'}]



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
