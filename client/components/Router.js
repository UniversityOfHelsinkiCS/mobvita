import React from 'react'
import { Route, Switch } from 'react-router-dom'

import SingleStoryView from 'Components/SingleStoryView'
import PracticeView from 'Components/PracticeView'
import MenuTabs from 'Components/StoryListView/MenuTabs'
import LanguageSelectView from 'Components/LanguageSelectView'
import AccessControl from 'Components/AccessControl'
import CompeteView from 'Components/CompeteView'

export default () => (
  <AccessControl>
    <Switch>
      <Route exact path="/" component={LanguageSelectView} />
      <Route exact path="/stories/:language" component={MenuTabs} />
      <Route exact path="/stories/:language/:id" component={SingleStoryView} />
      <Route exact path="/stories/:language/:id/practice/" component={PracticeView} />
      <Route exact path="/stories/:language/:id/compete/" component={CompeteView} />
    </Switch>
  </AccessControl>
)
