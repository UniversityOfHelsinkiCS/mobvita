import React from 'react'
import { Route, Switch } from 'react-router-dom'

import OnlyView from 'Components/OnlyView'

export default () => (
  <div className="content">
    <Switch>
      <Route path="/" component={OnlyView} />
    </Switch>
  </div>
)
