import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { images } from 'Utilities/common'
import { Menu, Dropdown, Button } from 'semantic-ui-react'

export default () => {
  const [active, setActive] = useState('home')
  const token = localStorage.getItem('token')
  const logout = async () => {
    localStorage.clear()
    window.location.reload()
  }
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
          {token && <Button primary onClick={logout}>Sign out</Button>}
        </Menu.Item>
      </Menu.Menu>


    </Menu>

  )
}
