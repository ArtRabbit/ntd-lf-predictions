import React from 'react'
import { observer } from 'mobx-react'

import { Layout } from '../layout'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Grid } from '@material-ui/core'

import { useUIState, useDataAPI } from '../hooks/stateHooks'
import Head from './components/Head'
import Inputs from './components/Inputs'
import DiveDeeper from './components/DiveDeeper'
import ReadMore from './components/ReadMore'

const useStyles = makeStyles(theme => ({
  headLeftColumn: {
    textAlign: 'left',
  },
  headRightColumn: {
    textAlign: 'right',
    padding: theme.spacing(2),
  },
  chartContainer: {
    position: 'relative',
    width: '100%'
  }
}))

const TrendsCountry = (props) => {

  const classes = useStyles()

  const countryIdent = props.match.params.country;

  const { country } = useUIState()
  const { countryData, countryFeatures, stateByCountryData } = useDataAPI()

  return (
    <Layout>
      <Grid container spacing={0}>
        <Grid item md={5} xs={12} className={classes.headLeftColumn}>
          <Head transparent={true} title={`Trends by country - ${countryIdent}`} />
        </Grid>
        <Grid item md={7} xs={12} className={classes.headRightColumn}>
          <Inputs />
        </Grid>
      </Grid>

      <Grid container spacing={0}>
        <Grid item md={5} xs={12} className={classes.headLeftColumn}>
          <Typography variant="h2" component="h2">
            Single country
          </Typography>
          <ReadMore>
            <Typography variant="body1" component="div">
              This is what we are showing here This is what we are showing here
              This is what we are showing here This is what we are showing here
            </Typography>
          </ReadMore>
        </Grid>
      </Grid>

      <DiveDeeper
        title="Dive deeper"
        links={[
          { to: '/hot-spots', name: 'PROBLEM AREAS' },
          { to: '/country', name: 'SELECT COUNTRY' },
        ]}
      />
    </Layout >
  )
}
export default observer(TrendsCountry)
