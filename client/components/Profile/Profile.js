import React from 'react'
import { Link } from 'react-router-dom'
import { Tab } from 'semantic-ui-react'

import { useIntl } from 'react-intl'
import PersonalSummary from './PersonalSummary'
import ChangePassword from './ChangePassword'


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
        content: intl.formatMessage({ id: 'summary' }),
        to: '/profile/summary',
        key: 'summary',
      },
      render: () => <PersonalSummary />,
    },
  ]

  let index
  switch (location.pathname) {
    case '/profile/summary':
      index = 1
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
