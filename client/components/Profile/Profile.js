import React from 'react'
import { Link } from 'react-router-dom'
import { Tab } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import Progress from 'Components/Profile/Progress'
import ChangePassword from './ChangePassword'
import Settings from './Settings'


export default function Profile({ location }) {
  const intl = useIntl()

  const panes = [
    {
      menuItem: {
        as: Link,
        content: intl.formatMessage({ id: 'Account' }),
        to: '/profile/account',
        key: 'account',
      },
      render: () => <ChangePassword />,
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
        content: intl.formatMessage({ id: 'Progress' }),
        to: '/profile/progress',
        key: 'progress',
      },
      render: () => <Progress />,
    },
  ]

  let index
  switch (location.pathname) {
    case '/profile/settings':
      index = 1
      break
    case '/profile/progress':
      index = 2
      break
    default:
      index = 0
  }

  return (
    <Tab
      panes={panes}
      activeIndex={index}
    />

  )
}
