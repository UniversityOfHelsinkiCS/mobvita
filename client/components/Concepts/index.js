import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getConcepts } from 'Utilities/redux/conceptReducer'
import { learningLanguageSelector } from 'Utilities/common'
import Concept from './Concept'

const ConceptTree = ({ concept }) => (
  <Concept
    key={concept.concept_id}
    id={concept.concept_id}
    header={concept.name}
    enabled={concept.exer_enabled}
  >
    {concept.children
      .map(c => (
        <ConceptTree key={c.concept_id} concept={c} />
      ))}
  </Concept>
)

const Concepts = () => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const { concepts, pending } = useSelector(({ concepts }) => concepts)

  useEffect(() => {
    dispatch(getConcepts(learningLanguage))
  }, [])

  if (pending || !concepts) return <p>loading...</p>

  const makeConceptTree = parents => parents
    .sort((a, b) => a['UI-order'] - b['UI-order'])
    .map((parent) => {
      const children = concepts.filter(c => c.parents && c.parents.includes(parent.concept_id))
      const cleanConcept = {
        ...parent,
        children: makeConceptTree(children),
      }
      return cleanConcept
    })


  const superConcepts = concepts.filter(concept => concept.super)
  const conceptTree = makeConceptTree(superConcepts)

  console.log(conceptTree)

  return (
    <div>
      {conceptTree
        .map(c => (
          <ConceptTree key={c.concept_id} concept={c} />
        ))}
    </div>
  )
}

export default Concepts
