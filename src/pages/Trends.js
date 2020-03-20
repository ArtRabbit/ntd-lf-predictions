import React from 'react'
import { observer } from 'mobx-react'

import { Layout } from '../layout'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Grid } from '@material-ui/core'

import { useUIState, useDataAPI } from '../hooks/stateHooks'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'

import Head from './components/Head'
import Inputs from './components/Inputs'
import DiveDeeper from './components/DiveDeeper'
import ReadMore from './components/ReadMore'
import ExpandableInfo from './components/ExpandableInfo'

import ChartSettings from './components/ChartSettings'
import Map from '../components/Map'
import SlopeChart from '../components/SlopeChart'
import Timeline from '../components/Timeline'

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
          <Typography variant="h2" component="h2">
            All countries map
          </Typography>
          <ReadMore>
            <Typography variant="body1" component="div">
              This is what we are showing here This is what we are showing here
              This is what we are showing here This is what we are showing here
            </Typography>
          </ReadMore>
        </Grid>
      </Grid>

      <Grid container spacing={0}>
        <Grid
          item
          md={5}
          xs={12}
          style={{ position: 'relative', margin: '40px 0px 80px 0px' }}
        >
          <ExpandableInfo title="Kenya facts">
            <Box variant="body1">
              <Typography component="p">
                Population xxx
                <br />
                50k people affected in 2030
                <br />3 districts with high prevalence
              </Typography>
            </Box>
          </ExpandableInfo>
        </Grid>
      </Grid>

      <Grid container spacing={0}>
        <Grid
          item
          md={12}
          xs={12}
          className={classes.headLeftColumn}
          style={{ position: 'relative', padding: '80px 0px' }}
        >
          <Typography variant="h2" component="h2">
            Chart options demo
          </Typography>

          <ChartSettings
            action={settingsClickDemo}
            title="Settings"
            buttonText="Update graphs"
          >
            {/* settings form controls */}
            <FormControl className={classes.formControl}>
              <Typography
                id="non-linear-slider1"
                variant="subtitle1"
                gutterBottom
              >
                Time period
              </Typography>
              <Slider
                value={[2021, 2029]}
                step={1}
                min={2019}
                max={2030}
                marks={[
                  { value: 2019, label: '2019' },
                  { value: 2030, label: '2030' },
                ]}
                valueLabelDisplay="auto"
                aria-labelledby="slider"
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <Typography
                id="non-linear-slider2"
                variant="subtitle1"
                gutterBottom
              >
                Clip scale
              </Typography>
              <Slider
                value={40}
                step={1}
                min={0}
                max={100}
                marks={[
                  { value: 0, label: '0' },
                  { value: 100, label: '100' },
                ]}
                valueLabelDisplay="auto"
                aria-labelledby="slider"
              />
              {/* settings form controls */}
            </FormControl>
          </ChartSettings>
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

      <Grid container justify="center">
        <Grid item>
          {countryData && (
            <Timeline data={Object.values(countryData.data)} width={800} />
          )}
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
export default observer(Trends)
