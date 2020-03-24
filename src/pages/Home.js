import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { Layout } from '../layout';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';


import HeadWithInputs from './components/HeadWithInputs';
import DiveDeeper from './components/DiveDeeper'

import Map from '../components/Map'
import { observer } from 'mobx-react'
import { useDataAPI, useUIState } from '../hooks/stateHooks'

const useStyles = makeStyles(theme => ({
  map: {
    width: 'calc(100% - 420px)',
    height: 'calc(100% - 124px)',
    //position: 'absolute', 
    top: 0,
    right: 0,
    zIndex: 1,
    float: 'right',
  },
  links: {
    zIndex: 9,
    float: 'left',
    paddingTop: theme.spacing(8),
    /*
    position: 'absolute',
    backgroundColor: '#fff',
    boxShadow:
      '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    padding: theme.spacing(2, 4, 4, 4),
    bottom: theme.spacing(16),
    left: theme.spacing(-4),
    */
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    backgroundImage: 'linear-gradient(to bottom, #9b66ff, #2600ae)',
    pointerEvents: 'none',
    opacity: 0,
    transition: 'opaciy 0.2s ease-in-out',
    '&.welcome': {
      opacity: 0.2,
      pointerEvents: 'all',
    }
  }
}));

const Home = (props) => {

  const classes = useStyles();
  const history = useHistory();
  const { countryFeatures, countryCentroids } = useDataAPI()
  const mapRef = useRef()

  const ENTER_KEY = 13;

  const { welcomeScren, setWelcomeScreen } = useUIState()


  const playScenario = event => {
    if (event.type === 'click' || event.key === 'Enter' || event.key === ' ') {
      mapRef.current.start()
    }
  }

  const showIntro = (event) => {
    if (event.type === 'click' || event.key === ' ') {
      hideIntro();
    }
  }
  const handleKeyDown = (event) => {
    if (event.keyCode === ENTER_KEY) {
      hideIntro();
    }
  }

  const hideIntro = () => {
    console.log(setWelcomeScreen);
    setWelcomeScreen(false)
  }

  useEffect(
    () => {
      document.addEventListener("keydown", handleKeyDown, false);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    },
    []
  );


  const WelcomeScreen = () => {
    return (
      <HeadWithInputs
        title="Lymphatic filariasis Prediction Maps"
        text={
          `Welcome to the NTD Modelling Prediction Maps.
                    The predictions in this website provide guidance on
                    the impact of more frequent, longer, or higher
                    coverage treatment would have on timelines to
                    reach the WHO target.`
        }
        actionLabel={"Enter"}
        action={showIntro}
        transparent={true}
        classAdd="no-clear"
      />
    )
  };

  const HomeScreen = () => {
    return (
      <HeadWithInputs
        transparent={true}
        title="Lymphatic filariasis Projections"
        text={`Welcome to the NTD Modelling Projections. 
                  The projections on this website provide guidance 
                  on the impact of more frequent, longer or higher 
                  coverate treatment would have on achieving elimination 
                  as a public health problem.`}
        actionLabel={'PLAY SCENARIO'}
        action={playScenario}
        classAdd="no-clear"
      />
    )
  };

  return (
    <Layout classAdd="full-height" onKeyDown={(event) => handleKeyDown(event)}>
      {welcomeScren && <WelcomeScreen />}
      {!welcomeScren && <HomeScreen />}

      <Box m={0} className={classes.map}>
        <Map
          ref={mapRef}
          countryFeatures={countryFeatures}
          disableZoom={true}
        />

      </Box>

      {!welcomeScren &&
        <Box className={classes.links}>
          <DiveDeeper
            title="Dive deeper"
            links={[
              { to: '/about-lf', name: 'MORE ABOUT LF' },
              { to: '/trends', name: 'TRENDS' },
              { to: '/hotspots', name: 'HOTSPOTS' },
            ]}
          />
        </Box>
      }

      <div className={`${classes.overlay} ${welcomeScren ? 'welcome' : ''}`} />
    </Layout >
  )
}
export default observer(Home);
