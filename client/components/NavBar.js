import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Button } from 'semantic-ui-react'
import { logout } from 'Utilities/redux/userReducer'

export default () => {
  const [active, setActive] = useState('home')
  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const dispatch = useDispatch()
  const signOut = () => dispatch(logout())
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
            <Dropdown.Item>Finnish</Dropdown.Item>
            <Dropdown.Item>Todo</Dropdown.Item>
            <Dropdown.Item>Todo</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Menu.Item>
          {user && <Button primary onClick={signOut}>Sign out</Button>}
        </Menu.Item>
      </Menu.Menu>


    </Menu>

  )
}
