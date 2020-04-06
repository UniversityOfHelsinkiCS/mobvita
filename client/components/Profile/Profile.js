import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tab, Form } from 'semantic-ui-react'


import { Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import { changePassword } from 'Utilities/redux/userReducer'
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
        content: intl.formatMessage({ id: 'Summary' }),
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
