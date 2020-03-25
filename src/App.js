import React from 'react'
import { Switch, Route, useLocation } from 'react-router-dom'
import useSyncRouteState from './hooks/useSyncRouteState'

import ScrollToTop from './pages/components/ScrollToTop'
import Home from './pages/Home'
import Page from './pages/Page'
import HotSpots from './pages/HotSpots'
import Simulator from './pages/Simulator'
import Trends from './pages/Trends'
import TrendsCountry from './pages/TrendsCountry'
import HotSpotCountry from './pages/HotSpotCountry'
import AboutLF from './pages/AboutLF'

import 'typeface-roboto'
import 'typeface-libre-franklin'

import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

// root element styles
import './App.scss';

const theme = createMuiTheme({
  palette: {
    /*
    primary: purple,
    secondary: grey
    */
    tooltip: {
      color: '#f1f1f1',
      rippleBackgroundColor: 'blue'
    },
    text: {
      primary: '#000000',
      secondary: '#616161',
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
      main: '#f50057', // 
    },
    error: {
      main: '#aa2323',
    },
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
    subtitle1: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 400,
    },
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        color: "#fff",
        backgroundColor: '#6236ff'
      }
    },
    MuiFormLabel: {
      root: {
        color: '#000000',
        fontWeight: 500,
        fontSize: '1rem',
        marginBottom: 8,
      }
    },
    MuiOutlinedInput: {
      root: {
        //backgroundColor: "#fff",
      }
    },
    MuiSelect: {
      outlined: {
        backgroundColor: "#fff",
      }


    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1556
    }
  }
})

function App() {
  const location = useLocation()
  useSyncRouteState()

  return (
    <CssBaseline>
      <ThemeProvider theme={theme}>
        <ScrollToTop location={location}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/trends" component={Trends} />
            <Route exact path="/trends/:country" component={TrendsCountry} />
            <Route exact path="/hotspots" component={HotSpots} />
            <Route exact path="/hotspots/:country" component={HotSpotCountry} />
            <Route exact path="/simulator" component={Simulator} />
            <Route exact path="/about-lf" component={AboutLF} />
            <Route exact path="**" component={Page} />
          </Switch>
        </ScrollToTop>
      </ThemeProvider>
    </CssBaseline>
  )
}

export default App
