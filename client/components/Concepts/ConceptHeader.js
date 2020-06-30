import React from 'react'
import { useSelector } from 'react-redux'
import { useIntl, FormattedMessage } from 'react-intl'
import { Dropdown } from 'semantic-ui-react'
import { useHistory } from 'react-router'

const ConceptHeader = ({ target }) => {
  const intl = useIntl()
  const history = useHistory()
  const { storyTitle } = useSelector(({ stories }) => (
    { storyTitle: stories.focused && stories.focused.title }))
  const groupOptions = useSelector(({ groups }) => groups.groups
    .map(group => (
      {
        key: group.group_id,
        text: group.groupName,
        value: group.group_id,
      })))
  const { currentId } = useSelector(({ groups }) => (
    {
      currentId: groups.testConcepts
            && groups.testConcepts.group
            && groups.testConcepts.group.group_id,
    }))

  let title
  switch (target) {
    // case 'groups':
    //   title = `${intl.formatMessage({ id: 'group-learning-settings-for' })} ${groupName}`
    //   break
    case 'stories':
      title = `${intl.formatMessage({ id: 'story-exercise-settings-for' })} ${storyTitle}`
      break
    default:
      title = intl.formatMessage({ id: 'user-exercise-settings' })
  }
  if (target === 'groups') {
    return (
      <div style={{ display: 'flex' }}>
        <h2 className="concept-title">
          <FormattedMessage id="group-learning-settings-for" />
          {' '}
          <Dropdown
            inline
            options={groupOptions}
            value={currentId}
            onChange={(_, { value }) => history.push(`/groups/${value}/concepts`)}
          />
        </h2>

      </div>
    )
  }
  return (
    <h2 className="concept-title">{title}</h2>
  )
}

export default ConceptHeader
