import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { Checkbox } from 'semantic-ui-react'
import { Spinner } from 'react-bootstrap'
import { getMetadata } from 'Utilities/redux/metadataReducer'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { getTestConcepts, getGroup } from 'Utilities/redux/groupsReducer'
import { getSelf } from 'Utilities/redux/userReducer'
import { learningLanguageSelector } from 'Utilities/common'
import UserConcept from './UserConcept'
import GroupConcept from './GroupConcept'
import StoryConcept from './StoryConcept'
import SelectAllCheckbox from './SelectAllCheckbox'

const Header = ({ target }) => {
  const intl = useIntl()
  const { storyTitle } = useSelector(({ stories }) => (
    { storyTitle: stories.focused && stories.focused.title }))
  const { groupName } = useSelector(({ groups }) => (
    { groupName: groups.testConcepts && groups.testConcepts.group.groupName }))

  let title
  switch (target) {
    case 'groups':
      title = `${intl.formatMessage({ id: 'group-learning-settings-for' })} ${groupName}`
      break
    case 'stories':
      title = `${intl.formatMessage({ id: 'story-exercise-settings-for' })} ${storyTitle}`
      break
    default:
      title = intl.formatMessage({ id: 'user-exercise-settings' })
  }

  return (
    <h2 className="concept-title">{title}</h2>
  )
}

const ConceptTree = ({ concept, showTestConcepts }) => {
  const { target } = useParams()
  const components = {
    user: UserConcept,
    groups: GroupConcept,
    stories: StoryConcept,
  }

  const TargetConcept = target ? components[target] : components.user

  return (
    <TargetConcept
      key={concept.concept_id}
      concept={concept}
      showTestConcepts={showTestConcepts}
    >
      {concept.children && concept.children
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
  const intl = useIntl()
  const learningLanguage = useSelector(learningLanguageSelector)

  const { concepts, pending: conceptsPending } = useSelector(({ metadata }) => metadata)
  const { isTeaching, testConceptsPending } = useSelector(({ groups }) => (
    {
      isTeaching: groups.testConcepts && groups.testConcepts.group.is_teaching,
      testConceptsPending: groups.testConceptsPending,
      group: groups.group,
    }))

  const [showTestConcepts, setShowTestConcepts] = useState(false)

  useEffect(() => {
    dispatch(getMetadata(learningLanguage))
  }, [])

  useEffect(() => {
    if (target === 'groups') {
      dispatch(getTestConcepts(id))
      dispatch(getGroup(id))
    }
  }, [])

  useEffect(() => {
    if (target === 'stories') dispatch(getStoryAction(id))
  }, [])

  useEffect(() => {
    if (!target) dispatch(getSelf())
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
      const children = parent.children && concepts.filter(c => (
        parent.children.includes(c.concept_id)))
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
      <Header target={target} />
      {target === 'groups'
        && (
          <div>
            <Checkbox
              toggle
              style={{ paddingLeft: '0.9em', marginBottomom: '1em' }}
              label={intl.formatMessage({ id: 'show-test-settings' })}
              checked={showTestConcepts}
              onChange={handleTestConceptToggle}
            />
            {testConceptsPending && <Spinner animation="border" variant="primary" size="sm" style={{ marginLeft: '0.9em', marginBottomom: '1em' }} />}
          </div>
        )
      }
      <SelectAllCheckbox />
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
