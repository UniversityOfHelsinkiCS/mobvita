import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Button } from 'semantic-ui-react'
import { logout } from 'Utilities/redux/userReducer'
import { setLocale } from 'Utilities/redux/localeReducer'
import { localeOptions } from 'Utilities/common'
import { FormattedMessage } from 'react-intl'

export default () => {
  const [active, setActive] = useState('home')
  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const dispatch = useDispatch()
  const signOut = () => dispatch(logout())

  const chooseLanguage = code => () => dispatch(setLocale(code))
  return (
    <Menu>
      <Menu.Item
        as={Link}
        to="/"
        active={active === 'home'}
        content="Home"
        name="home">
      </Menu.Item>

      <Menu.Menu position="right">
        <Dropdown item text="Language">
          <Dropdown.Menu>
            {localeOptions.map(locale => <Dropdown.Item key={locale.code} onClick={chooseLanguage(locale.code)}>{locale.name}</Dropdown.Item>)}
          </Dropdown.Menu>
        </Dropdown>

        <Menu.Item>
          {user && (
            <Button primary onClick={signOut}>
              <FormattedMessage id="SIGNOUT" />
            </Button>
          )}
        </Menu.Item>
      </Menu.Menu>


    </Menu>

  )
}
