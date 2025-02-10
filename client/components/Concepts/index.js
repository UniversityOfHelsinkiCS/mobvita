import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import UserConcept from './UserConcept'
import GroupConcept from './GroupConcept'
import StoryConcept from './StoryConcept'
import SelectAllCheckbox from './SelectAllCheckbox'
import OpenConceptsWidget from './OpenConceptsWidget'

const ConceptTree = ({
  concept,
  target,
  showTestConcepts,
  showLevels,
  expandConcepts,
  collapseConcepts,
}) => {
  const components = {
    user: UserConcept,
    groups: GroupConcept,
    stories: StoryConcept,
  }

  const TargetConcept = target ? components[target] : components.user

  return (
    <TargetConcept
      key={`${concept.concept_id}-${concept['UI-order']}`}
      concept={concept}
      showTestConcepts={showTestConcepts}
      showLevels={showLevels}
      expandConcepts={expandConcepts}
      collapseConcepts={collapseConcepts}
    >
      {concept.children &&
        concept.children.map(c => (
          <ConceptTree
            key={`${c.concept_id}-${c['UI-order']}`}
            concept={c}
            target={target}
            showTestConcepts={showTestConcepts}
            showLevels={showLevels}
            expandConcepts={expandConcepts}
            collapseConcepts={collapseConcepts}
          />
        ))}
    </TargetConcept>
  )
}

const Concepts = ({target, showTestConcepts, showLevels}) => {
  const { concepts: all_concepts } = useSelector(({ metadata }) => metadata)
  const concepts = all_concepts.filter(concept => !showTestConcepts && concept.exercise_settings || 
    showTestConcepts && concept.test_settings)
  const [expandConcepts, setExpandConcepts] = useState(false)
  const [collapseConcepts, setCollapseConcepts] = useState(false)
  
  const makeConceptTree = parents =>
    parents
      .sort((a, b) => a['UI-order'] - b['UI-order'])
      .map(parent => {
        const children =
          parent.children && concepts.filter(c => parent.children.includes(c.concept_id))
        const cleanConcept = {
          ...parent,
          children: makeConceptTree(children),
        }
        return cleanConcept
      })

  const superConcepts = concepts.filter(concept => concept.super)
  const conceptTree = makeConceptTree(superConcepts)
  return (
    <>
      <OpenConceptsWidget
        expandConcepts={expandConcepts}
        collapseConcepts={collapseConcepts}
        setCollapseConcepts={setCollapseConcepts}
        setExpandConcepts={setExpandConcepts}
      />
      <SelectAllCheckbox showTestConcepts={showTestConcepts} />
      <div style={{ paddingLeft: '10px' }} className="Full-Concept-Tree">
        {conceptTree.map(c => (
          <ConceptTree
            key={c.concept_id}
            concept={c}
            target={target}
            showTestConcepts={showTestConcepts}
            showLevels={showLevels}
            expandConcepts={expandConcepts}
            collapseConcepts={collapseConcepts}
          />
        ))}
      </div>
    </>
  )
}

export default Concepts
