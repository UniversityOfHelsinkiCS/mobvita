import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Tab } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import { getGroups } from 'Utilities/redux/groupsReducer'
import GroupAnalytics from './GroupAnalytics'
import JoinGroup from './JoinGroup'
import CreateGroup from './CreateGroup'
import GroupManagement from './GroupManagement'

export default function GroupView({ location }) {
  const intl = useIntl()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getGroups())
  }, [])

  const tabStyle = { paddingLeft: '0.8rem', paddingRight: '0.8rem' }

  const panes = [
    {
      menuItem: {
        as: Link,
        content: 'Management',
        to: '/groups',
        key: 'managment',
        style: tabStyle,
      },
      render: () => <GroupManagement />,
    },
    {
      menuItem: {
        as: Link,
        content: 'Analytics',
        to: '/groups/analytics',
        key: 'analytics',
        style: tabStyle,
      },
      render: () => <GroupAnalytics />,
    },
    {
      menuItem: {
        as: Link,
        content: 'Join',
        //content: intl.formatMessage({ id: 'join-group' }),
        to: '/groups/join',
        key: 'join',
        style: tabStyle,
      },
      render: () => <JoinGroup />,
    },
    {
      menuItem: {
        as: Link,
        content: 'New',
        //content: intl.formatMessage({ id: 'create-new-group' }),
        to: '/groups/create',
        key: 'create',
      },
      render: () => <CreateGroup />,
    },
  ]

  let index
  switch (location.pathname) {
    case '/groups/analytics':
      index = 1
      break
    case '/groups/join':
      index = 2
      break
    case '/groups/create':
      index = 3
      break
    default:
      index = 0
  }

  return (
    <div className="component-container">
      <Tab panes={panes} activeIndex={index} grid={{ tabWidth: 1 }} />
    </div>
  )
}
