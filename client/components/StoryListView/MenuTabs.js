import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Tab } from 'semantic-ui-react'
import { getStories } from 'Utilities/redux/storiesReducer'
import StoryList from 'Components/StoryListView/StoryList'
import HomeView from 'Components/LandingPage/HomeView'
import { useIntl } from 'react-intl'
import SwipeableViews from 'react-swipeable-views'


const Tabs = ({ match, location }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const { language } = match.params


  useEffect(() => {
    dispatch(getStories(language, {
      sort_by: 'date',
      order: -1,
      page: 0,
      page_size: 14,
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
    <SwipeableViews enableMouseEvents>
      <HomeView />
      <StoryList language={language} />
    </SwipeableViews>
  )


  // return (
  //   <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
  //     <div style={{ width: '110em' }}>
  //       <Tab
  //         panes={panes}
  //         renderActiveOnly
  //         activeIndex={activeIndex}
  //       />
  //     </div>
  //   </div>
  // )
}

export default Tabs
