import React, { useState, useRef } from 'react'
import { observer } from 'mobx-react'

import { Layout } from '../layout'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

import HeadWithInputs from './components/HeadWithInputs'
import DiveDeeper from './components/DiveDeeper'

import Map from '../components/Map'
import { useDataAPI } from '../hooks/stateHooks'

const useStyles = makeStyles(theme => ({
  map: {
    width: 'calc(100% - 420px)',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
    top: 0,
    right: 0,
  },
  links: {
    zIndex: 9,
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
}))

const Intro = props => {
  const classes = useStyles()
  const { countryFeatures, countryCentroids } = useDataAPI()
  const mapRef = useRef()

  const playScenario = event => {
    if (event.type === 'click' || event.key === 'Enter' || event.key === ' ') {
      mapRef.current.start()
    }
  }

  return (
    <Layout>
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
      />

      <Box m={0} className={classes.map}>
        <Map
          ref={mapRef}
          countryFeatures={countryFeatures}
          populationFeatures={countryCentroids}
          height={720}
          disableZoom={true}
        />

      </Box>

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
    </Layout>
  )
}
export default observer(Intro)
