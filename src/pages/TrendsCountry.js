import React from 'react'
import { observer } from 'mobx-react'
import { Box, Typography, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useDataAPI, useUIState } from '../hooks/stateHooks'
import { Layout } from '../layout'
import Map from '../components/Map'

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
    width: '100%',
  },
}))

const TrendsCountry = props => {
  const classes = useStyles()
  const { selectedCountry, countryData, countryFeatures } = useDataAPI()
  const { country } = useUIState()

  return (
    <Layout>
      <Grid container spacing={0}>
        <Grid item md={5} xs={12} className={classes.headLeftColumn}>
          <Head
            transparent={true}
            title={`Trends by country - ${selectedCountry?.name || '...'}`}
          />
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

      <div
        style={{
          borderTop: '1px solid #BDBDBD',
          borderBottom: '1px solid #BDBDBD',
        }}
      >
        <Map
          data={countryData?.data}
          features={countryFeatures}
          height={720}
          initialLevel={0}
          disableZoom={true}
          country={country}
        />
      </div>

      <DiveDeeper
        title="Dive deeper"
        links={[
          { to: '/hot-spots', name: 'PROBLEM AREAS' },
          { to: '/country', name: 'SELECT COUNTRY' },
        ]}
      />
    </Layout>
  )
}
export default observer(TrendsCountry)
