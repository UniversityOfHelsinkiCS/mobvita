import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams,Link } from 'react-router-dom'
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
  const { role, tab } = useParams()

  useEffect(() => {
    dispatch(getGroups())
  }, [])

  const tabStyle = {
    paddingLeft: '0.7rem',
    paddingRight: '0.7rem',
  }

  let panes
  if (role == 'teacher'){
    panes = [
      {
        menuItem: {
          as: Link,
          content: <TabContent translationId="Management" />,
          to: '/groups/teacher',
          key: 'management',
          style: tabStyle,
        },
        render: () => <GroupManagement role={role} />,
      },
      {
        menuItem: {
          as: Link,
          content: <TabContent translationId="Analytics" />,
          to: '/groups/teacher/analytics',
          key: 'analytics',
          style: tabStyle,
          'data-cy': 'group-analytics',
        },
        render: () => <GroupAnalytics role={role} />,
      },
      {
        menuItem: {
          as: Link,
          content: <TabContent data-cy="create-group" translationId="create-new-group" />,
          to: '/groups/teacher/create',
          key: 'create',
          style: tabStyle,
        },
        render: () => <CreateGroup role={role} />,
      },
    ]
  } else if (role == 'student'){
    panes = [
      {
        menuItem: {
          as: Link,
          content: <TabContent translationId="Management" />,
          to: '/groups/student',
          key: 'management',
          style: tabStyle,
        },
        render: () => <GroupManagement role={role} />,
      },
      {
        menuItem: {
          as: Link,
          content: <TabContent translationId="Info" />,
          to: '/groups/student/info',
          key: 'info',
          style: tabStyle,
          'data-cy': 'group-analytics',
        },
        render: () => <GroupAnalytics role={role} />,
      },
      {
        menuItem: {
          as: Link,
          content: <TabContent translationId="join-a-group" />,
          to: '/groups/student/join',
          key: 'join',
          style: tabStyle,
        },
        render: () => <JoinGroup role={role} />,
      },
    ]
  } else {
    panes = [
      {
        menuItem: {
          as: Link,
          content: <TabContent translationId="Management" />,
          to: '/groups',
          key: 'management',
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
          'data-cy': 'group-analytics',
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
          content: <TabContent data-cy="create-group" translationId="create-new-group" />,
          to: '/groups/create',
          key: 'create',
          style: tabStyle,
        },
        render: () => <CreateGroup />,
      },
    ]
  }

  let index
  switch (tab) {
    case 'analytics':
      index = 1
      break
    case 'info':
      index = 1
      break
    case 'join':
      index = 2
      break
    case 'create':
      index = 2
      break
    default:
      index = 0
  }

  return (
    <div className="cont auto">
      <Tab panes={panes} activeIndex={index} grid={{ tabWidth: 1 }} />
    </div>
  )
}
