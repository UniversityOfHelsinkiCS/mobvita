import React from 'react'
import { Link } from 'react-router-dom'
import { Tab } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import Progress from 'Components/Profile/Progress'
import Account from './Account'
import Settings from './Settings'
import Following from './Following'

export default function Profile({ location }) {
  const intl = useIntl()

  const panes = [
    {
      menuItem: {
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
        content: intl.formatMessage({ id: 'following' }),
        to: '/profile/following',
        key: 'following',
      },
      render: () => <Following />,
    },
    {
      menuItem: {
        as: Link,
        content: intl.formatMessage({ id: 'Settings' }),
        to: '/profile/settings',
        key: 'settings',
      },
      render: () => <Settings />,
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
  ]

  let index
  switch (location.pathname) {
    case '/profile/account':
      index = 3
      break
    case '/profile/settings':
      index = 2
      break
    case '/profile/following':
      index = 1
      break
    default:
      index = 0
  }

  return (
    <main className="cont pb-nm auto">
      <Tab panes={panes} activeIndex={index} />
    </main>
  )
}
