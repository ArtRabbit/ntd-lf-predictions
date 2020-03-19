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
import 'typeface-libre-franklin';

import purple from '@material-ui/core/colors/purple';
import grey from '@material-ui/core/colors/grey';

import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
//import './App.scss'; 
/*
import { create } from 'jss';
import { createStyleManager } from 'jss-theme-reactor/styleManager';
import jssPreset from 'jss-preset-default';

const styleManager = createStyleManager({
    theme,
    jss: create(jssPreset()),
});
*/


const theme = createMuiTheme({
    /*
    '@global': {
        'a': {
            'color': 'red'    // Make all links red.
        },
        'body': {
            'color': 'red'    // Make all links red.
        }
    },
    */
    palette: {
        /*
        primary: purple,
        secondary: grey
        */
        text: {
            primary: '#000000',
            secondary: '#616161'
        },
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#6236ff',
            line: '#bdbdbd',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            light: '#eeeeee',
            main: '#000000',
        },
        error: {
            main: '#aa2323'
        }


    },

    typography: {
        fontSize: 16,
        fontWeight: 400,
        headline: {
            fontFamily: "'Libre Franklin', sans-serif",
        },

        h1: {
            fontFamily: "'Libre Franklin', sans-serif",
            fontWeight: 800,
            fontSize: '2.75rem',
        },
        h2: {
            fontFamily: "'Libre Franklin', sans-serif",
            fontWeight: 800,
            fontSize: '1.75rem',
        },
        h3: {
            fontFamily: "'Libre Franklin', sans-serif",
            fontWeight: 800,
            fontSize: '1.375rem',
        },
        h4: {
            fontFamily: "'Libre Franklin', sans-serif",
            fontWeight: 800,
            fontSize: '1.25rem',
        },
        h5: {
            fontFamily: "'Libre Franklin', sans-serif",
            fontWeight: 800,
            fontSize: '1.125rem',
        },
        h6: {
            textTransform: 'uppercase',
            //fontFamily: "'Libre Franklin', sans-serif",
            //fontWeight: 800 
            fontSize: '0.75rem',
        },
        subtitle2: {
            fontSize: 22,
        },
        button: {
            fontWeight: 400,
        }
    },
    overrides: {
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
