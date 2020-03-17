import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { Checkbox } from 'semantic-ui-react'
import { Spinner } from 'react-bootstrap'
import { getConcepts } from 'Utilities/redux/conceptReducer'
import { getTestConcepts, getGroup } from 'Utilities/redux/groupsReducer'
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
  const history = useHistory()
  const { target, id } = useParams()
  const learningLanguage = useSelector(learningLanguageSelector)
  const { concepts, pending: conceptsPending } = useSelector(({ concepts }) => concepts)
  const { isTeaching, groupsPending, group } = useSelector(({ groups }) => (
    {
      isTeaching: groups.testConcepts && groups.testConcepts.group.is_teaching,
      groupsPending: groups.pending,
      group: groups.group,
    }))
  const [showTestConcepts, setShowTestConcepts] = useState(false)

  useEffect(() => {
    dispatch(getConcepts(learningLanguage))
  }, [])

  useEffect(() => {
    if (target === 'groups') {
      dispatch(getTestConcepts(id))
      dispatch(getGroup(id))
    }
  }, [])

  useEffect(() => {
    if (target === 'groups' && !isTeaching && isTeaching !== undefined) history.replace('/groups')
  }, [isTeaching])

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
          <>
            <h3 style={{ paddingLeft: '0.9em' }}>{group && group.groupName}</h3>
            <div>
              <Checkbox
                toggle
                style={{ paddingLeft: '0.9em', marginBottomom: '1em' }}
                label="Show test settings"
                checked={showTestConcepts}
                onChange={handleTestConceptToggle}
              />
              {groupsPending && <Spinner animation="border" variant="primary" size="sm" style={{ marginLeft: '0.9em', marginBottomom: '1em' }} />}
            </div>
          </>
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
