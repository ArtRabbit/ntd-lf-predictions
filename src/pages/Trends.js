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

import Map from '../components/Map'
import SlopeChart from '../components/SlopeChart'
import BumpChart from '../components/BumpChart'

const useStyles = makeStyles(theme => ({
  headLeftColumn: {
    textAlign: 'left',
  },
  headRightColumn: {
    textAlign: 'right',
    padding: theme.spacing(2),
  },
}))

const PanelContainer = ({ children }) => (
  <div style={{ display: 'flex', overflow: 'auto' }}>{children}</div>
)

const Trends = ({ history, location }) => {
  const classes = useStyles()

  const { country } = useUIState()
  const { countryData, countryFeatures, stateByCountryData } = useDataAPI()

  return (
    <Layout>
      <Grid container spacing={0}>
        <Grid item md={5} xs={12} className={classes.headLeftColumn}>
          <Head transparent={true} title="Lympahtic filariasis Trends" />
        </Grid>
        <Grid item md={7} xs={12} className={classes.headRightColumn}>
          <Inputs />
        </Grid>
      </Grid>

      <Grid container spacing={0}>
        <Grid item md={5} xs={12} className={classes.headLeftColumn}>
          <Typography variant="h2" component="h2">
            {country ? 'Country level' : 'All countries map'}
          </Typography>
          <ReadMore text="This is what we are showing here This is what we are showing here This is what we are showing here This is what we are showing here" />
        </Grid>
      </Grid>

      {countryData && countryFeatures && (
        <Map
          data={countryData.data}
          features={countryFeatures}
          height={500}
          initialLevel={0}
        />
      )}

      <PanelContainer>
        {stateByCountryData &&
          Object.entries(stateByCountryData).map(([key, { data, stats }]) => {
            return (
              <Box key={key} p={1}>
                <SlopeChart
                  data={Object.values(data)}
                  width={40}
                  height={300}
                  start={2015}
                  end={2031}
                  clipDomain={false}
                  svgPadding={[0, 0, 0, 0]}
                />
                <Typography variant="caption">{key}</Typography>
              </Box>
            )
          })}
      </PanelContainer>

      {/* <Grid container justify="center">
        <Grid item>
          <Typography variant="h2">Bump graph States in AGO</Typography>
          {countryData && (
            <BumpChart data={Object.values(countryData.data)} width={800} />
          )}
        </Grid>
      </Grid> */}

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
export default observer(Trends)
