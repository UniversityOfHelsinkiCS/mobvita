import React from 'react'
import { Tab } from 'semantic-ui-react'
import LibraryView from 'Components/LibraryView'
import HomeView from 'Components/HomeView'
import Banners from 'Components/Banners'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import TestIndex from 'Components/TestView/index'
import { useSelector } from 'react-redux'

const TabContent = ({ translationId }) => (
  <span style={{ fontSize: '16px' }}>
    <FormattedMessage id={translationId} />
  </span>
)

const Tabs = ({ location }) => {
  const { hasTests } = useSelector(({ metadata }) => metadata)

  const panes = [
    {
      menuItem: {
        as: Link,
        content: <TabContent translationId="Home" />,
        to: '/home',
        key: 'home',
      },
      render: () => <HomeView />,
    },
    {
      menuItem: {
        as: Link,
        content: <TabContent translationId="Library" />,
        to: '/library',
        key: 'library',
        'data-cy': 'library-tab',
      },
      render: () => <LibraryView />,
    },
  ]

  if (hasTests) {
    panes.push({
      menuItem: {
        as: Link,
        content: <TabContent translationId="Tests" />,
        to: '/tests',
        key: 'tests',
        'data-cy': 'test-tab',
      },
      render: () => <TestIndex />,
    })
  }

  let index
  switch (location.pathname) {
    case '/tests':
      index = 2
      break
    case '/library':
      index = 1
      break
    default:
      index = 0
  }

  return (
    <div style={{ height: '100%' }}>
      <Banners />
      <Tab panes={panes} activeIndex={index} />
    </div>
  )
}

export default Tabs
