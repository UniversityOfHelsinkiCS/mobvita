import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Tab } from 'semantic-ui-react'
import { getStories } from 'Utilities/redux/storiesReducer'
import StoryList from 'Components/StoryListView/StoryList'
import HomeView from 'Components/StoryListView/HomeView'
import StoryAddition from 'Components/StoryAddition'
import { useIntl } from 'react-intl'

const Tabs = ({ match, location }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const { language } = match.params
  useEffect(() => {
    dispatch(getStories(language, {
      sort_by: 'date',
      order: -1,
      page: 0,
      page_size: 30,
    }))
  }, [])

  const panes = [
    {
      menuItem: intl.formatMessage({ id: 'HOME' }),
      render: () => <Tab.Pane><HomeView /></Tab.Pane>,
    },
    {
      menuItem: intl.formatMessage({ id: 'LIBRARY' }),
      render: () => <Tab.Pane><StoryList language={language} /></Tab.Pane>,
    },
  ]

  const defaultActiveIndex = location.hash === '#home' ? 0 : 1

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      <div>
        <StoryAddition />
      </div>
      <div style={{ width: '45em' }}>
        <Tab
          panes={panes}
          renderActiveOnly
          defaultActiveIndex={defaultActiveIndex}
        />
      </div>
    </div>
  )
}

export default Tabs
