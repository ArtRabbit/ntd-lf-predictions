import React from 'react'
import { observer } from 'mobx-react'

import { Layout } from '../layout'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

import Head from './components/Head'
import Inputs from './components/Inputs'
import DiveDeeper from './components/DiveDeeper'
import SiteSections from './components/SiteSections'

import Map from '../components/Map'
import { useDataAPI } from '../hooks/stateHooks'

const useStyles = makeStyles(theme => ({
  map: {
    width: '100%',
    position: 'relative',
    zIndex: 1,
    //top: '-300px',
    //marginBottom: '-300px',
    clear: 'both',
  },

  headLeftColumn: {
    textAlign: 'left',
  },
  headRightColumn: {
    textAlign: 'right',
    padding: theme.spacing(0, 0, 0, 2),
  },
}))

const Intro = ({ history, location }) => {
  const classes = useStyles()
  const { countryData, countryFeatures } = useDataAPI()

  const playScenario = event => {
    if (event.type === 'click' || event.key === 'Enter' || event.key === ' ') {
      alert('Playing')
    }
  }

  return (
    <Layout>
      <Grid container spacing={0}>
        <Grid item md={5} xs={12} className={classes.headLeftColumn}>
          <Head
            transparent={true}
            title="Lympahtic filariasis Predicted outcome 2030"
            text={`The main point here is to use
            show hot spots but combine
            it with population affected
            In my head we don’t have this
            version of the map yet or we 
            use the normal country
            level map and overlay
            this (not just on hover, but
            always) with affected
            population numbers.`}
            actionLabel={'PLAY SCENARIO'}
            action={playScenario}
          />
        </Grid>
        <Grid item md={7} xs={12} className={classes.headRightColumn}>
          <Inputs />
        </Grid>
      </Grid>

      <Box m={1} className={classes.map}>
        <Map
          data={countryData?.data}
          features={countryFeatures}
          height={500}
          initialLevel={0}
        />
      </Box>

      <DiveDeeper
        title="Dive deeper"
        links={[
          { to: '/trends', name: 'TRENDS' },
          { to: '/hot-spots', name: 'PROBLEM AREAS' },
        ]}
      />
    </Layout>
  )
}
export default observer(Intro)
