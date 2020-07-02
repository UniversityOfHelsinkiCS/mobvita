import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'semantic-ui-react'
import moment from 'moment'
import { hiddenFeatures } from 'Utilities/common'
import Concept from './Concept'


const History = ({ history, dateFormat }) => {
  const [colors, setColors] = useState({
    best: [0, 255, 0],
    worst: [230, 255, 230],
    noData: [255, 255, 255],
  })

  const [page, setPage] = useState(0)
  const { concepts } = useSelector(({ metadata }) => metadata)

  const conceptIdToConceptName = (id) => {
    const concept = concepts.find(c => c.concept_id === id)
    return concept ? concept.name : id
  }

  const calculateColor = (conceptStatistic) => {
    const { best, worst, noData } = colors
    if (!conceptStatistic) return `rgb(${colors.noData.join(',')})`
    const { correct, total } = conceptStatistic
    if (total === 0) return `rgb(${noData.join(',')})`

    const score = correct / total
    const red = best[0] + score * (worst[0] - best[0])
    const green = best[1] + score * (worst[1] - best[1])
    const blue = best[2] + score * (worst[2] - best[2])

    return `rgb(${red},${green},${blue})`
  }

  const calculatePage = () => {
    const size = 7
    return history.slice(page * size, page * size + size)
  }


  const switchPage = (change) => {
    const size = 7
    const maxPage = Math.trunc(history.length / (size + 1))

    const newPage = page + change

    if (newPage > maxPage) {
      setPage(0)
    } else if (newPage < 0) {
      setPage(maxPage)
    } else {
      setPage(newPage)
    }
  }

  const buildSingleConcept = (conceptId) => {
    const concept = concepts.find(concept => concept.concept_id === conceptId)
    if (!concept.children) return { id: conceptId, children: [] }
    return {
      id: conceptId,
      children: concept.children
        .sort((a, b) => a['UI-order'] - b['UI-order'])
        .map(c => buildSingleConcept(c)),
    }
  }

  const buildConceptTree = () => {
    const rootConcepts = concepts.filter(c => !c.parents).sort((a, b) => a['UI-order'] - b['UI-order'])
    const conceptTree = []
    rootConcepts.forEach((concept) => {
      conceptTree.push(buildSingleConcept(concept.concept_id))
    })

    return conceptTree
  }
  const handleColorChange = color => (e) => {
    setColors({ ...colors, [color]: e.target.value.split(',') })
  }

  if (!history) return null
  return (
    <div style={{ overflowX: 'scroll', maxWidth: '100%', marginTop: '1em' }}>
      <button type="button" onClick={() => switchPage(-1)}>-</button>
      <span style={{ marginLeft: '1em', marginRight: '1em' }}>{page + 1} / {1 + Math.trunc(history.length / 8)}</span>
      <button type="button" onClick={() => switchPage(1)}>+</button>
      {hiddenFeatures
      && (
      <>
        best:
        <input type="text" value={colors.best.join(',')} onChange={handleColorChange('best')} />
        worst:
        <input type="text" value={colors.worst.join(',')} onChange={handleColorChange('worst')} />
        no data:
        <input type="text" value={colors.noData.join(',')} onChange={handleColorChange('noData')} />
      </>
      )}
      <Table celled fixed>
        <Table.Header>
          <Table.HeaderCell>Concepts</Table.HeaderCell>
          {calculatePage().map(test => (
            <Table.HeaderCell key={test.date}>
              {moment(test.date).format(dateFormat || 'YYYY-MM-DD hh:mm')}
            </Table.HeaderCell>
          ))}
        </Table.Header>
        <Table.Body>
          {buildConceptTree().map(concept => (
            <Concept
              calculateColor={calculateColor}
              history={history.slice(page * 7, page * 7 + 7)}
              concept={concept}
              getConceptName={conceptIdToConceptName}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default History
