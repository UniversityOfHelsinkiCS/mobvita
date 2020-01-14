import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tab } from 'semantic-ui-react'
import { getStories } from 'Utilities/redux/storiesReducer'
import StoryList from 'Components/StoryListView/StoryList'
import HomeView from 'Components/LandingPage/HomeView'
import { useIntl } from 'react-intl'
import { learningLanguageSelector } from 'Utilities/common'
import { Link, Route, Switch } from 'react-router-dom'

const Tabs = ({ location }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const language = useSelector(learningLanguageSelector)

  useEffect(() => {
    dispatch(getStories(language, {
      sort_by: 'date',
      order: -1,
      page: 0,
      page_size: 14,
    }))
  }, [language])

  const panes = [
    {
      menuItem: {
        as: Link,
        content: intl.formatMessage({ id: 'HOME' }),
        to: '/home',
        key: 'home',
      },
      render: () => <Tab.Pane><HomeView language={language} /></Tab.Pane>,
    },
    {
      menuItem: {
        as: Link,
        content: intl.formatMessage({ id: 'LIBRARY' }),
        to: '/library',
        key: 'library',
      },
      render: () => <Tab.Pane><StoryList language={language} /></Tab.Pane>,
    },
  ]

  const index = location.pathname === '/home' ? 0 : 1

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      <div style={{ width: '110em' }}>
        <Tab
          panes={panes}
          renderActiveOnly
          activeIndex={index}
        />
      </div>
    </div>

  )
}

export default Tabs
