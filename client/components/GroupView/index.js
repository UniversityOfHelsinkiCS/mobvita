import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Tab } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { getGroups } from 'Utilities/redux/groupsReducer'
import GroupAnalytics from './GroupAnalytics'
import JoinGroup from './JoinGroup'
import CreateGroup from './CreateGroup'
import GroupManagement from './GroupManagement'

const TabContent = ({ translationId }) => (
  <span className="tab-text">
    <FormattedMessage id={translationId} />
  </span>
)

export default function GroupView({ location }) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getGroups())
  }, [])

  const tabStyle = {
    paddingLeft: '0.7rem',
    paddingRight: '0.7rem',
  }

  const panes = [
    {
      menuItem: {
        as: Link,
        content: <TabContent translationId="Management" />,
        to: '/groups',
        key: 'managment',
        style: tabStyle,
      },
      render: () => <GroupManagement />,
    },
    {
      menuItem: {
        as: Link,
        content: <TabContent translationId="Analytics" />,
        to: '/groups/analytics',
        key: 'analytics',
        style: tabStyle,
      },
      render: () => <GroupAnalytics />,
    },
    {
      menuItem: {
        as: Link,
        content: <TabContent translationId="Join" />,
        to: '/groups/join',
        key: 'join',
        style: tabStyle,
      },
      render: () => <JoinGroup />,
    },
    {
      menuItem: {
        as: Link,
        content: <TabContent translationId="New" />,
        to: '/groups/create',
        key: 'create',
        style: tabStyle,
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
