import React from 'react'
import { useSelector } from 'react-redux'
import { useIntl } from 'react-intl'

const ConceptHeader = ({ target }) => {
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

export default ConceptHeader
