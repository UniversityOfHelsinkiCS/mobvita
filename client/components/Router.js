import React from 'react'
import { Route, Switch } from 'react-router-dom'

import SingleStoryView from 'Components/SingleStoryView'
import PracticeView from 'Components/PracticeView'
import { LanguageSelectView } from './languageSelectView/LanguageSelectView'
import MenuTabs from "Components/StoryListView/MenuTabs"

export default () => (
  <div className="content" style={{ minWidth: "60em", maxWidth: "60em", margin: "0 auto" }}>
    <Switch>
      <Route exact path="/" component={LanguageSelectView} />
      <Route exact path="/stories" component={MenuTabs} />
      <Route exact path="/stories/:id" component={SingleStoryView} />
      <Route exact path="/stories/:id/snippet/" component={PracticeView} />
    </Switch>
  </div>
)
