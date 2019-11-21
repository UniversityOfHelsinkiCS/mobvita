import React, { useEffect } from 'react'
import { Tab } from 'semantic-ui-react'
import StoryList from 'Components/StoryListView/StoryList'
import HomeView from 'Components/StoryListView/HomeView'
import StoryAddition from 'Components/StoryAddition'
import { useIntl } from 'react-intl'

const Tabs = () => {
  const intl = useIntl()
  const panes = [
    {
      menuItem: intl.formatMessage({ id: 'HOME' }),
      render: () => <Tab.Pane><HomeView /></Tab.Pane>,
    },
    {
      menuItem: intl.formatMessage({ id: 'LIBRARY' }),
      render: () => <Tab.Pane><StoryList /></Tab.Pane>,
    },
  ]

  return (
    <div>
      <StoryAddition />
      <Tab
        panes={panes}
        renderActiveOnly
        defaultActiveIndex={1}
      />
    </div>
  )
}

export default Tabs


