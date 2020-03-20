import React from 'react'

import { Layout } from '../layout'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import Head from './components/Head'
import Inputs from './components/Inputs'
import DiveDeeper from './components/DiveDeeper'
import SiteSections from './components/SiteSections'

import Map from '../components/Map'

const useStyles = makeStyles(theme => ({
  headLeftColumn: {
    textAlign: 'left',
  },
  headRightColumn: {
    textAlign: 'right',
    padding: theme.spacing(2),
  },
}))

const HotSpots = ({ history, location }) => {
  const classes = useStyles()

  return (
    <Layout>
      <Grid container spacing={0}>
        <Grid item md={5} xs={12} className={classes.headLeftColumn}>
          <Head transparent={true} title="Lympahtic filariasis Problem areas" />
        </Grid>
        <Grid item md={7} xs={12} className={classes.headRightColumn}>
          <Inputs />
        </Grid>
      </Grid>

      { /* <Map height={500} initialLevel={1} />*/}

      <DiveDeeper
        title="Dive deeper"
        links={[
          { to: '/trends', name: 'Trends' },
          { to: '/country', name: 'SELECT COUNTRY' },
        ]}
      />

    </Layout>
  )
}
export default HotSpots
