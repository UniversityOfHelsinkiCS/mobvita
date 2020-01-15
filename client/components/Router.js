import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import SingleStoryView from 'Components/SingleStoryView'
import PracticeView from 'Components/PracticeView'
import MenuTabs from 'Components/StoryListView/MenuTabs'
import LanguageSelectView from 'Components/LanguageSelectView'
import AccessControl from 'Components/AccessControl'
import CompeteView from 'Components/CompeteView'
import EmailConfirm from 'Components/AccessControl/EmailConfirm'

export default () => (
  <AccessControl>
    <Switch>
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
      <Route exact path="/learningLanguage" component={LanguageSelectView} />
      <Route exact path="/home" component={MenuTabs} />
      <Route exact path="/email-confirm/:token" component={EmailConfirm} />
      <Route exact path="/library" component={MenuTabs} />
      <Route exact path="/stories/:id" component={SingleStoryView} />
      <Route exact path="/stories/:id/practice/" component={PracticeView} />
      <Route exact path="/stories/:id/compete/" component={CompeteView} />

    </Switch>
  </AccessControl>
)
