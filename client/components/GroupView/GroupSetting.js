
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { Dropdown, Checkbox } from 'semantic-ui-react'
import { getTestConcepts, getGroup, getGroups } from 'Utilities/redux/groupsReducer'

import { learningLanguageSelector } from 'Utilities/common'
import Spinner from 'Components/Spinner'
import ReportButton from 'Components/ReportButton'
import useWindowDimension from 'Utilities/windowDimensions'

import TotalTestQuestions from 'Components/Concepts/TotalTestQuestions'
import Concepts from 'Components/Concepts'

const GroupSetting = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const intl = useIntl()
    const { id } = useParams()
    const bigScreen = useWindowDimension().width >= 650
    const { concepts, pending: conceptsPending } = useSelector(({ metadata }) => metadata)
    const learningLanguage = useSelector(learningLanguageSelector)
    const { isTeaching, group, pending: testConceptsPending } = useSelector(({ groups }) => ({
      isTeaching:
        groups.testConcepts && groups.testConcepts.group && groups.testConcepts.group.is_teaching,
      pending: groups.testConceptsPending,
      group: groups.group,
    }))
    const groupOptions = useSelector(({ groups }) => groups.groups
        .map(group => (
          {
            key: group.group_id,
            text: group.groupName,
            value: group.group_id,
          })))
    const [showTestConcepts, setShowTestConcepts] = useState(
      history.location.pathname.endsWith('/settings')
    )
    const [showLevels, setShowLevels] = useState(true)
    
  
    useEffect(() => {
        dispatch(getTestConcepts(id, learningLanguage))
        dispatch(getGroup(id))
        dispatch(getGroups())
    }, [id])
  
    useEffect(() => {
      if (!isTeaching && isTeaching !== undefined) history.replace('/groups')
    }, [isTeaching])
  
    if (conceptsPending || !concepts || !group) return <Spinner fullHeight />
    const conceptsToShow = concepts.filter(concept => !showTestConcepts && concept.exercise_settings || 
        showTestConcepts && concept.test_settings)
    
  
    const handleTestConceptToggle = async () => {
      if (!showTestConcepts) await dispatch(getTestConcepts(id, learningLanguage))
      setShowTestConcepts(!showTestConcepts)
    }
  
    return (
      <div className="cont-tall cont auto flex-col pb-nm ps-sm">
        <div style={{ display: 'flex' }}>
            <h2 className="concept-title">
                <FormattedMessage id="group-learning-settings-for" />:
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Dropdown
                inline
                options={groupOptions}
                value={id}
                onChange={(_, { value }) => history.push(`/groups/teacher/${value}/settings`)}
                />
            </h2>
            <br />
            <br />
            <br />
        </div>
        <div className="concept-setting-cont">
          <div className="concept-toggles">
            <div style={{ display: 'flex', fontWeight: 'bold' }}>
                <span style={{ marginRight: '0.5em' }}>
                    <input type="radio" onChange={handleTestConceptToggle} checked={!showTestConcepts} />
                </span>
                <span style={{ marginRight: '0.5em' }}>
                    <FormattedHTMLMessage id="show-exercise-settings" />
                </span>
                <span style={{ marginRight: '0.5em' }}>
                    <input type="radio" onChange={handleTestConceptToggle} checked={showTestConcepts} />
                </span>
                <span style={{ marginRight: '0.5em' }}>
                    <FormattedHTMLMessage id="show-test-settings" />
                </span>
                </div>
            {testConceptsPending && (
                <Spinner animation="border" variant="primary" size="sm" style={{ marginLeft: '1em' }} />
            )}
            <Checkbox
                style={{ marginLeft: '6em' }}
                toggle
                label={intl.formatMessage({ id: 'show-levels' })}
                checked={showLevels}
                onChange={() => setShowLevels(!showLevels)}
                className="concept-toggle"
            />
            </div>
            <div>
                <TotalTestQuestions
                    concepts={conceptsToShow}
                    setShowTestConcepts={setShowTestConcepts}
                    groupId={group.group.group_id}
                    learningLanguage={learningLanguage}
                    showTestConcepts={showTestConcepts}
                />
            </div>
        </div>
        <br />
        <Concepts 
            concepts={conceptsToShow}
            target={'groups'}
            showTestConcepts={showTestConcepts}
            showLevels={showLevels}
        />
        <ReportButton extraClass="align-self-end auto-top" />
      </div>
    )
  }

  export default GroupSetting