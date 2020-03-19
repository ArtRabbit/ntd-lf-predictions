import React, { useCallback } from 'react'

import { Layout } from '../layout'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Grid } from '@material-ui/core'

import { useOldData, useNewData } from '../hooks/useData'

import Head from './components/Head'
import Inputs from './components/Inputs'
import DiveDeeper from './components/DiveDeeper'

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
  const data = useOldData()
  const countryFilter = useCallback(x => x.relatedCountries.includes('AGO'), [])
  const { data: newData } = useNewData({
    source: 'data/state-level.csv',
    Regime: 'No MDA',
    key: 'StateCode',
    f: countryFilter,
  })

  const bumpData = Object.values(newData)

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

      <Map height={500} filter={countryFilter} initialLevel={1} />

      <PanelContainer>
        {data.map(d => (
          <Box key={d.country} p={1}>
            <SlopeChart
              data={d.units}
              width={100}
              height={300}
              start={2015}
              end={2031}
              clipDomain={false}
              svgPadding={[0, 0, 0, 0]}
            />
            <Typography variant="caption">{d.country}</Typography>
          </Box>
        ))}
      </PanelContainer>

      <Grid container justify="center">
        <Grid item>
          <Typography variant="h2">Bump graph States in AGO</Typography>
          {bumpData.length && <BumpChart data={bumpData} width={800} />}
        </Grid>
      </Grid>

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
export default Trends
