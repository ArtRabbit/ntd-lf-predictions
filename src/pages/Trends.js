import React, { useCallback } from 'react'

import { Layout } from '../layout'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Grid } from '@material-ui/core'

import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Slider from "@material-ui/core/Slider";

import { useOldData, useNewData } from '../hooks/useData'

import Head from './components/Head'
import Inputs from './components/Inputs'
import DiveDeeper from './components/DiveDeeper'
import ReadMore from './components/ReadMore'


import ChartSettings from './components/ChartSettings'


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

  const settingsClickDemo = event => {
    alert('update graphs')
  }


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
          <Typography variant="h2" component="h2">All countries map</Typography>
          <ReadMore text="This is what we are showing here This is what we are showing here This is what we are showing here This is what we are showing here" />

        </Grid>
      </Grid>

      <Grid container spacing={0}>
        <Grid item md={12} xs={12} className={classes.headLeftColumn} style={{ position: 'relative', padding: '80px 0px' }}>
          <Typography variant="h2" component="h2">Chart options demo</Typography>

          <ChartSettings
            action={settingsClickDemo}
            title="Settings"
            buttonText="Update graphs"
          >
            { /* settings form controls */}
            <FormControl className={classes.formControl}>
              <Typography id="non-linear-slider1" variant="subtitle1" gutterBottom>Time period</Typography>
              <Slider
                value={[2021, 2029]}
                step={1}
                min={2019}
                max={2030}
                marks={[{ value: 2019, label: '2019', }, { value: 2030, label: '2030' }]}
                valueLabelDisplay="auto"
                aria-labelledby="slider"
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <Typography id="non-linear-slider2" variant="subtitle1" gutterBottom>Clip scale</Typography>
              <Slider
                value={40}
                step={1}
                min={0}
                max={100}
                marks={[{ value: 0, label: '0', }, { value: 100, label: '100' }]}
                valueLabelDisplay="auto"
                aria-labelledby="slider"
              />
              { /* settings form controls */}

            </FormControl>
          </ChartSettings>



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
