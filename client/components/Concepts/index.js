import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Checkbox } from 'semantic-ui-react'
import { Spinner } from 'react-bootstrap'
import { getConcepts } from 'Utilities/redux/conceptReducer'
import { getTestConcepts } from 'Utilities/redux/groupsReducer'
import { learningLanguageSelector } from 'Utilities/common'
import UserConcept from './UserConcept'
import GroupConcept from './GroupConcept'

const ConceptTree = ({ concept, showTestConcepts }) => {
  const { target } = useParams()
  const components = {
    user: UserConcept,
    groups: GroupConcept,
  }

  const TargetConcept = target ? components[target] : components.user

  return (
    <TargetConcept
      key={concept.concept_id}
      concept={concept}
      showTestConcepts={showTestConcepts}
    >
      {concept.children
        .map(c => (
          <ConceptTree key={c.concept_id} concept={c} showTestConcepts={showTestConcepts} />
        ))}
    </TargetConcept>
  )
}

const Concepts = () => {
  const dispatch = useDispatch()
  const { target, id } = useParams()
  const learningLanguage = useSelector(learningLanguageSelector)
  const { concepts, pending: conceptsPending } = useSelector(({ concepts }) => concepts)
  const [showTestConcepts, setShowTestConcepts] = useState(false)

  useEffect(() => {
    dispatch(getConcepts(learningLanguage))
  }, [])

  if (conceptsPending || !concepts) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    )
  }

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

  const handleTestConceptToggle = async () => {
    if (!showTestConcepts) await dispatch(getTestConcepts(id))
    setShowTestConcepts(!showTestConcepts)
  }

  return (
    <div className="component-container">
      {target === 'groups'
        && (
          <Checkbox
            toggle
            style={{ paddingLeft: '0.9em', marginBottomo: '1em' }}
            label="Show test settings"
            checked={showTestConcepts}
            onChange={handleTestConceptToggle}
          />
        )
      }
      <div>
        {conceptTree
          .map(c => (
            <ConceptTree key={c.concept_id} concept={c} showTestConcepts={showTestConcepts} />
          ))}
      </div>
    </div>
  )
}

export default Concepts
