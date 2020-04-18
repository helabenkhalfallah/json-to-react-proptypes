import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import AppHomePage from './AppHomePage'

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/home" component={AppHomePage} />
    </Switch>
  </BrowserRouter>
)

export default Routes
