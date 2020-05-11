import React from 'react'
import { Tab } from 'semantic-ui-react'
import StoryList from 'Components/StoryListView/StoryList'
import HomeView from 'Components/LandingPage/HomeView'
import Banners from 'Components/Banners'
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
      render: () => <HomeView />,
    },
    {
      menuItem: {
        as: Link,
        content: intl.formatMessage({ id: 'Library' }),
        to: '/library',
        key: 'library',
        'data-cy': 'library-tab',
      },
      render: () => <StoryList />,
    },
  ]

  let index
  switch (location.pathname) {
    case '/library':
      index = 1
      break
    default:
      index = 0
  }

  return (
    <div>
      <Banners />
      <Tab
        panes={panes}
        activeIndex={index}
      />
    </div>
  )
}

export default Tabs
