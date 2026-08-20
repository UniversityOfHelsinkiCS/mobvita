import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { Box, RadioGroup, FormControlLabel } from '@mui/material'
import {
  getTestConcepts,
  getGroup,
  getGroups,
  updateExerciseTopics,
  updateTempExerciseTopics,
} from 'Utilities/redux/groupsReducer'

import { learningLanguageSelector } from 'Utilities/common'
import Spinner from 'Components/Spinner'
import ReportButton from 'Components/ReportButton'
import AppSelect from 'Components/ui/AppSelect'
import AppSwitch from 'Components/ui/AppSwitch'
import AppRadio from 'Components/ui/AppRadio'
import { colors } from 'Assets/mui_theme/designTokens'

import TotalTestQuestions from 'Components/Concepts/TotalTestQuestions'
import Concepts from 'Components/Concepts'
import Topics from 'Components/Topics'

const GroupSetting = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const intl = useIntl()
  const { id } = useParams()
  const { pending } = useSelector(({ metadata }) => metadata)

  const learningLanguage = useSelector(learningLanguageSelector)
  const {
    isTeaching,
    group,
    pending: testConceptsPending,
  } = useSelector(({ groups }) => ({
    isTeaching:
      groups.testConcepts && groups.testConcepts.group && groups.testConcepts.group.is_teaching,
    pending: groups.testConceptsPending,
    group: groups.group,
  }))
  const groupOptions = useSelector(({ groups }) =>
    groups.groups.map(g => ({ value: g.group_id, label: g.groupName })),
  )
  const [showTestConcepts, setShowTestConcepts] = useState(location.pathname.endsWith('/settings'))
  const [showLevels, setShowLevels] = useState(true)
  const lessonInstance = {
    topic_ids: group?.group.topics || [],
    instancePending: pending || !group,
  }

  useEffect(() => {
    dispatch(getTestConcepts(id, learningLanguage))
    dispatch(getGroup(id))
    dispatch(getGroups())
  }, [dispatch, id, learningLanguage])

  useEffect(() => {
    if (!isTeaching && isTeaching !== undefined) navigate('/groups', { replace: true })
  }, [isTeaching, navigate])

  if (pending || !group) {
    return <Spinner fullHeight size={60} />
  }

  // Switches between the exercise-settings and test-settings views; fetches concepts on demand.
  const handleSettingsViewChange = async (_, value) => {
    const showTest = value === 'test'
    if (showTest && !showTestConcepts) await dispatch(getTestConcepts(id, learningLanguage))
    setShowTestConcepts(showTest)
  }

  const setSelectedTopics = topic_ids => {
    dispatch(updateExerciseTopics(topic_ids, id))
    dispatch(updateTempExerciseTopics(topic_ids, id))
  }

  return (
    <div className="cont-tall cont auto flex-col pb-nm ps-sm">
      <Box
        sx={{
          backgroundColor: colors.card,
          color: colors.ink,
          border: `1px solid ${colors.border}`,
          borderRadius: '20px',
          width: '100%',
          maxWidth: 1024,
          mx: 'auto',
          my: '2rem',
          p: { xs: '16px', sm: '24px' },
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '1.5em',
          }}
        >
          <h2
            style={{
              fontWeight: 700,
              fontSize: 26,
              color: colors.ink,
              margin: 0,
            }}
          >
            <FormattedMessage id="group-learning-settings-for" />
          </h2>
          <Box
            component="span"
            data-cy="group-setting-group-select"
            sx={{ display: 'inline-flex', verticalAlign: 'middle' }}
          >
            <AppSelect
              variant="contrast-outline"
              value={id}
              options={groupOptions}
              onChange={value => navigate(`/groups/teacher/${value}/settings`)}
              minWidth={200}
            />
          </Box>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5em',
            marginBottom: '1em',
          }}
        >
          <RadioGroup
            row
            value={showTestConcepts ? 'test' : 'exercise'}
            onChange={handleSettingsViewChange}
          >
            <FormControlLabel
              value="exercise"
              control={
                <AppRadio
                  slotProps={{ input: { 'data-cy': 'group-setting-exercise-settings-radio' } }}
                />
              }
              label={<FormattedHTMLMessage id="show-exercise-settings" />}
            />
            <FormControlLabel
              value="test"
              control={
                <AppRadio
                  slotProps={{ input: { 'data-cy': 'group-setting-test-settings-radio' } }}
                />
              }
              label={<FormattedHTMLMessage id="show-test-settings" />}
            />
          </RadioGroup>
          <FormControlLabel
            control={
              <AppSwitch
                checked={showLevels}
                onChange={() => setShowLevels(!showLevels)}
                slotProps={{ input: { 'data-cy': 'group-setting-show-levels-toggle' } }}
              />
            }
            label={intl.formatMessage({ id: 'show-levels' })}
            sx={{ ml: 0, gap: '8px' }}
          />
          {testConceptsPending && <Spinner inline />}
        </div>

        {showTestConcepts && (
          <TotalTestQuestions
            setShowTestConcepts={setShowTestConcepts}
            groupId={group.group.group_id}
            learningLanguage={learningLanguage}
            showTestConcepts={showTestConcepts}
          />
        )}

        <div style={{ marginTop: '1em' }}>
          {showTestConcepts ? (
            <Concepts target="groups" showTestConcepts={showTestConcepts} showLevels={showLevels} />
          ) : (
            <Topics
              topicInstance={lessonInstance}
              editable
              setSelectedTopics={setSelectedTopics}
              showPerf={false}
            />
          )}
        </div>

        <ReportButton extraClass="align-self-end auto-top" />
      </Box>
    </div>
  )
}

export default GroupSetting
