import React, { useState } from 'react'
import { Link } from "react-router-dom"
import { images } from 'Utilities/common'
import { Menu, Dropdown, Button } from "semantic-ui-react"

export default NavBar => {


  const [active, setActive] = useState("home")


  return (
    <Menu>
      <Menu.Item as={Link} to="/" active={active === "home"}
        content='Home'
        name='home'>
      </Menu.Item>

      <Menu.Menu position='right'>
        <Dropdown item text='Language'>
          <Dropdown.Menu>
            <Dropdown.Item>Finnish</Dropdown.Item>
            <Dropdown.Item>Todo</Dropdown.Item>
            <Dropdown.Item>Todo</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Menu.Item>
          <Button primary>Sign in</Button>
        </Menu.Item>
      </Menu.Menu>


    </Menu>

  )
}
