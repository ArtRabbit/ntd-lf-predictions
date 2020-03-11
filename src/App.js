import React, { useEffect, useContext } from 'react';
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";

import ScrollToTop from './pages/components/ScrollToTop';
import Home from './pages/Home';
import Page from './pages/Page';

import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.scss';

function App() {

    const Contents = withRouter(({ history, location, match }) => {
        return (
            <CssBaseline>
                <ScrollToTop location={location}>
                    <Switch location={location}>
                        <Route exact path='/' component={Home} history={history} location={location} />
                        <Route exact path='**' component={Page} history={history} location={location} />
                    </Switch>
                </ScrollToTop>
            </CssBaseline>
        );
    });

    return (
        <BrowserRouter>
            <Contents />
        </BrowserRouter>
    );
}

export default (App);
