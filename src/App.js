import React, { useEffect, useContext } from 'react';
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";

import ScrollToTop from './pages/components/ScrollToTop';
import Home from './pages/Home';
import Page from './pages/Page';
import Intro from './pages/Intro';
import HotSpots from './pages/HotSpots';
import Simulator from './pages/Simulator';
import Trends from './pages/Trends';
import HotSpotCountry from './pages/HotSpotCountry';

import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import './App.scss';

const theme = createMuiTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#009688',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            light: '#0066ff',
            main: '#212121',
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#ffcc00',
        }
    },
});

function App() {

    const Contents = withRouter(({ history, location, match }) => {
        return (
            <CssBaseline>
                <ThemeProvider theme={theme}>
                    <ScrollToTop location={location}>
                        <Switch location={location}>
                            <Route exact path='/' component={Home} history={history} location={location} />
                            <Route exact path='/intro' component={Intro} history={history} location={location} />
                            <Route exact path='/trends' component={Trends} history={history} location={location} />
                            <Route exact path='/hot-spots' component={HotSpots} history={history} location={location} />
                            <Route exact path='/country' component={HotSpotCountry} history={history} location={location} />
                            <Route exact path='/simulator' component={Simulator} history={history} location={location} />


                            <Route exact path='**' component={Page} history={history} location={location} />
                        </Switch>
                    </ScrollToTop>
                </ThemeProvider>
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
