import React from 'react'
import { Link } from 'react-router-dom'
import { Tab } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import Progress from 'Components/Profile/Progress'
import Main from './Main'
import Account from './Account'
import Settings from './Settings'
import Following from './Following'

export default function Profile({ location }) {
  const intl = useIntl()
  const { teacherView } = useSelector(({ user }) => user.data)
  let panes
  let index
  if (!teacherView){
    panes = [
      {
        menuItem: {
          as: Link,
          content: intl.formatMessage({ id: 'Profile' }),
          to: '/profile/main',
          key: 'main',
        },
        render: () => <Main teacherView={teacherView} />,
      },
      {
        menuItem: {
          className: 'progress-link',
          as: Link,
          content: intl.formatMessage({ id: 'Progress' }),
          to: '/profile/progress',
          key: 'progress',
        },
        render: () => <Progress />,
      },
      {
        menuItem: {
          as: Link,
          content: intl.formatMessage({ id: 'following-view-tab' }),
          to: '/profile/following',
          key: 'following',
        },
        render: () => <Following />,
      },
      {
        menuItem: {
          as: Link,
          content: intl.formatMessage({ id: 'Account' }),
          to: '/profile/account',
          key: 'account',
        },
        render: () => <Account />,
      },
      {
        menuItem: {
          as: Link,
          content: intl.formatMessage({ id: 'Settings' }),
          to: '/profile/settings',
          key: 'settings',
        },
        render: () => <Settings  teacherView={teacherView}  />,
      },
    ]
    switch (location.pathname) {
      case '/profile/settings':
        index = 4
        break
      case '/profile/account':
        index = 3
        break
      case '/profile/following':
        index = 2
        break
      case '/profile/main':
        index = 0
        break
      default:
        index = 1
    }
  } else {
    panes = [
      {
        menuItem: {
          as: Link,
          content: intl.formatMessage({ id: 'Profile' }),
          to: '/profile/main',
          key: 'main',
        },
        render: () => <Main teacherView={teacherView} />,
      },
      {
        menuItem: {
          as: Link,
          content: intl.formatMessage({ id: 'following-view-tab' }),
          to: '/profile/following',
          key: 'following',
        },
        render: () => <Following />,
      },
      {
        menuItem: {
          as: Link,
          content: intl.formatMessage({ id: 'Account' }),
          to: '/profile/account',
          key: 'account',
        },
        render: () => <Account />,
      },
      {
        menuItem: {
          as: Link,
          content: intl.formatMessage({ id: 'Settings' }),
          to: '/profile/settings',
          key: 'settings',
        },
        render: () => <Settings  teacherView={teacherView} />,
      },
    ]
    switch (location.pathname) {
      case '/profile/settings':
        index = 3
        break
      case '/profile/account':
        index = 2
        break
      case '/profile/following':
        index = 1
        break
      case '/profile/main':
        index = 0
        break
      default:
        index = 0
    }
  }

  return (
    <main className="cont pb-nm auto">
      <Tab panes={panes} activeIndex={index} />
    </main>
  )
}
