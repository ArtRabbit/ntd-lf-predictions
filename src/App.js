import React, { useEffect, useContext } from 'react';
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";

import ScrollToTop from './pages/components/ScrollToTop';
import Home from './pages/Home';
import Page from './pages/Page';

import './App.scss';

function App() {

    const Contents = withRouter(({ history, location, match }) => {
        return (
            <ScrollToTop location={location}>
                <Switch location={location}>
                    <Route exact path='/' component={Home} history={history} location={location} />
                    <Route exact path='**' component={Page} history={history} location={location} />
                </Switch>
            </ScrollToTop>);
    });

    return (
        <BrowserRouter>
            <Contents />
        </BrowserRouter>
    );
}

export default (App);
