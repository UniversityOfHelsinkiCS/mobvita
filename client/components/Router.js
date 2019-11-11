import React from 'react'
import { Route, Switch } from 'react-router-dom'

import StoryListView from 'Components/StoryListView'
import SingleStoryView from 'Components/SingleStoryView'
import PracticeView from 'Components/PracticeView'
import { LanguageSelectView } from './languageSelectView/LanguageSelectView'

export default () => (
  <div className="content">
    <Switch>
      <Route exact path="/" component={LanguageSelectView} />
      <Route exact path="/stories" component={StoryListView} />
      <Route exact path="/stories/:id" component={SingleStoryView} />
      <Route exact path="/stories/:id/snippet/" component={PracticeView} />
    </Switch>
  </div>
)
