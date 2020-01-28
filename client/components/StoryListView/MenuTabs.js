import React from 'react'
import { Tab } from 'semantic-ui-react'
import StoryList from 'Components/StoryListView/StoryList'
import HomeView from 'Components/LandingPage/HomeView'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

const Tabs = ({ location }) => {
  const intl = useIntl()

  const panes = [
    {
      menuItem: {
        as: Link,
        content: intl.formatMessage({ id: 'Home' }),
        to: '/home',
        key: 'home',
      },
      render: () => <Tab.Pane><HomeView /></Tab.Pane>,
    },
    {
      menuItem: {
        as: Link,
        content: intl.formatMessage({ id: 'Library' }),
        to: '/library',
        key: 'library',
      },
      render: () => <Tab.Pane><StoryList /></Tab.Pane>,
    },
  ]

  const index = location.pathname === '/home' ? 0 : 1

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      <div style={{ width: '110em' }}>
        <Tab
          panes={panes}
          activeIndex={index}
        />
      </div>
    </div>

  )
}

export default Tabs
