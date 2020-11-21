import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { getTestConcepts, getGroup, getGroups } from 'Utilities/redux/groupsReducer'
import { getSelf } from 'Utilities/redux/userReducer'
import { learningLanguageSelector } from 'Utilities/common'
import Spinner from 'Components/Spinner'
import ReportButton from 'Components/ReportButton'
import UserConcept from './UserConcept'
import GroupConcept from './GroupConcept'
import StoryConcept from './StoryConcept'
import SelectAllCheckbox from './SelectAllCheckbox'
import ConceptHeader from './ConceptHeader'
import ConceptToggles from './ConceptToggles'
import TotalTestQuestions from './TotalTestQuestions'

const ConceptTree = ({ concept, showTestConcepts, showLevels }) => {
  const { target } = useParams()
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
    >
      {concept.children &&
        concept.children.map(c => (
          <ConceptTree
            key={`${c.concept_id}-${c['UI-order']}`}
            concept={c}
            showTestConcepts={showTestConcepts}
            showLevels={showLevels}
          />
        ))}
    </TargetConcept>
  )
}

const Concepts = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { target, id } = useParams()

  const { concepts, pending: conceptsPending } = useSelector(({ metadata }) => metadata)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { isTeaching, group } = useSelector(({ groups }) => ({
    isTeaching:
      groups.testConcepts && groups.testConcepts.group && groups.testConcepts.group.is_teaching,
    group: groups.group,
  }))

  const [showTestConcepts, setShowTestConcepts] = useState(false)
  const [showLevels, setShowLevels] = useState(true)

  useEffect(() => {
    if (target === 'groups') {
      dispatch(getTestConcepts(id, learningLanguage))
      dispatch(getGroup(id))
      dispatch(getGroups())
    }
  }, [id])

  useEffect(() => {
    if (target === 'stories') dispatch(getStoryAction(id))
  }, [])

  useEffect(() => {
    if (!target) dispatch(getSelf())
  }, [])

  useEffect(() => {
    if (target === 'groups' && !isTeaching && isTeaching !== undefined) history.replace('/groups')
  }, [isTeaching])

  if (conceptsPending || !concepts || (target === 'groups' && !group)) return <Spinner fullHeight />

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

  const handleTestConceptToggle = async () => {
    if (!showTestConcepts) await dispatch(getTestConcepts(id, learningLanguage))
    setShowTestConcepts(!showTestConcepts)
  }

  return (
    <div className="cont-tall cont auto flex-col pb-nm ps-sm">
      <ConceptHeader target={target} />
      <div className="flex">
        <ConceptToggles
          showTestConcepts={showTestConcepts}
          handleTestConceptToggle={handleTestConceptToggle}
          showLevels={showLevels}
          setShowLevels={setShowLevels}
        />
        {showTestConcepts && <TotalTestQuestions />}
      </div>
      <SelectAllCheckbox />
      <hr />
      <div>
        {conceptTree.map(c => (
          <ConceptTree
            key={c.concept_id}
            concept={c}
            showTestConcepts={showTestConcepts}
            showLevels={showLevels}
          />
        ))}
      </div>
      <ReportButton extraClass="align-self-end auto-top" />
    </div>
  )
}

export default Concepts
