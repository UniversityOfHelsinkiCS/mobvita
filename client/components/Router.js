import React from 'react'
import { Route, Switch } from 'react-router-dom'

import SingleStoryView from 'Components/SingleStoryView'
import PracticeView from 'Components/PracticeView'
import MenuTabs from 'Components/StoryListView/MenuTabs'
import LanguageSelectView from 'Components/LanguageSelectView'
import AccessControl from 'Components/AccessControl'

export default () => (
  <AccessControl>
    <Switch>
      <Route exact path="/" component={LanguageSelectView} />
      <Route exact path="/stories" component={MenuTabs} />
      <Route exact path="/stories/:id" component={SingleStoryView} />
      <Route exact path="/stories/:id/snippet/" component={PracticeView} />
    </Switch>
  </AccessControl>
)
