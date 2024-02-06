import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { getTestConcepts, getGroup, getGroups } from 'Utilities/redux/groupsReducer'
import { getSelf } from 'Utilities/redux/userReducer'
import { learningLanguageSelector } from 'Utilities/common'
import Spinner from 'Components/Spinner'
import ReportButton from 'Components/ReportButton'
import useWindowDimension from 'Utilities/windowDimensions'
import UserConcept from './UserConcept'
import GroupConcept from './GroupConcept'
import StoryConcept from './StoryConcept'
import SelectAllCheckbox from './SelectAllCheckbox'
import ConceptHeader from './ConceptHeader'
import ConceptToggles from './ConceptToggles'
import TotalTestQuestions from './TotalTestQuestions'
import OpenConceptsWidget from './OpenConceptsWidget'

const ConceptTree = ({
  concept,
  showTestConcepts,
  showLevels,
  expandConcepts,
  collapseConcepts,
}) => {
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
      expandConcepts={expandConcepts}
      collapseConcepts={collapseConcepts}
    >
      {concept.children &&
        concept.children.map(c => (
          <ConceptTree
            key={`${c.concept_id}-${c['UI-order']}`}
            concept={c}
            showTestConcepts={showTestConcepts}
            showLevels={showLevels}
            expandConcepts={expandConcepts}
            collapseConcepts={collapseConcepts}
          />
        ))}
    </TargetConcept>
  )
}

const Concepts = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { target, id } = useParams()
  const bigScreen = useWindowDimension().width >= 650
  const { concepts, pending: conceptsPending } = useSelector(({ metadata }) => metadata)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { isTeaching, group } = useSelector(({ groups }) => ({
    isTeaching:
      groups.testConcepts && groups.testConcepts.group && groups.testConcepts.group.is_teaching,
    group: groups.group,
  }))

  const [showTestConcepts, setShowTestConcepts] = useState(
    history.location.pathname.endsWith('/settings')
  )
  const [showLevels, setShowLevels] = useState(true)
  const [expandConcepts, setExpandConcepts] = useState(false)
  const [collapseConcepts, setCollapseConcepts] = useState(false)

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

  const conceptsToShow = concepts.filter(concept => !showTestConcepts && concept.exercise_settings || 
    showTestConcepts && concept.test_settings)
  const makeConceptTree = parents =>
    parents
      .sort((a, b) => a['UI-order'] - b['UI-order'])
      .map(parent => {
        const children =
          parent.children && conceptsToShow.filter(c => parent.children.includes(c.concept_id))
        const cleanConcept = {
          ...parent,
          children: makeConceptTree(children),
        }
        return cleanConcept
      })

  const superConcepts = conceptsToShow.filter(concept => concept.super)
  const conceptTree = makeConceptTree(superConcepts)

  const handleTestConceptToggle = async () => {
    if (!showTestConcepts) await dispatch(getTestConcepts(id, learningLanguage))
    setShowTestConcepts(!showTestConcepts)
  }

  return (
    <div className="cont-tall cont auto flex-col pb-nm ps-sm">
      <ConceptHeader target={target} />
      <div className="concept-setting-cont">
        <ConceptToggles
          showTestConcepts={showTestConcepts}
          handleTestConceptToggle={handleTestConceptToggle}
          showLevels={showLevels}
          setShowLevels={setShowLevels}
        />
        {target === 'groups' && (
          <div>
            <TotalTestQuestions
              concepts={conceptsToShow}
              setShowTestConcepts={setShowTestConcepts}
              groupId={group.group.group_id}
              learningLanguage={learningLanguage}
              showTestConcepts={showTestConcepts}
            />
          </div>
        )}
      </div>
      <br />
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
            showTestConcepts={showTestConcepts}
            showLevels={showLevels}
            expandConcepts={expandConcepts}
            collapseConcepts={collapseConcepts}
          />
        ))}
      </div>
      <ReportButton extraClass="align-self-end auto-top" />
    </div>
  )
}

export default Concepts
