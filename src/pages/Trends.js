import React from 'react'
import { observer } from 'mobx-react'

import { Layout } from '../layout'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Grid } from '@material-ui/core'

import { useDataAPI } from '../hooks/stateHooks'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'

import Head from './components/Head'
import Inputs from './components/Inputs'
import SectionTitle from './components/SectionTitle'
import DiveDeeper from './components/DiveDeeper'
import ReadMore from './components/ReadMore'

import ChartSettings from './components/ChartSettings'
import Map from '../components/Map'
import Timeline from '../components/Timeline'

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

const PanelContainer = ({ children }) => (
  <div style={{ display: 'flex', overflow: 'auto', position: 'relative' }}>
    {children}
  </div>
)

const Trends = props => {
  const classes = useStyles()

  const { countryData, countryFeatures, stateFeatures } = useDataAPI()

  const settingsClickDemo = event => {
    alert('update graphs')
  }

  return (
    <Layout>
      <Grid container spacing={0}>
        <Grid item md={5} xs={12} className={classes.headLeftColumn}>
          <Head transparent={true} title="Lymphatic filariasis Trends" />
        </Grid>
        <Grid item md={7} xs={12} className={classes.headRightColumn}>
          <Inputs />
        </Grid>
      </Grid>

      <SectionTitle
        top={true}
        headline="People still needing intervention"
        text={`Countries in 2020 and 2030`}
      />
      <img
        src={'http://ntd.artrabbit.studio/static/circle-graph.png'}
        alt="circle graph"
      />

      <SectionTitle
        headline="Timeline"
        text={`Showing prevalence and probable eradication over time`}
      />

      <Box className={classes.chartContainer}>
        {countryData && (
          <Timeline data={Object.values(countryData.data)} width={500} />
        )}
      </Box>

      <SectionTitle
        top={true}
        headline="Trend map"
        text={`Showing good and bad performace comparing prevalence 2000 to 2030`}
      />

      <div
        style={{
          borderTop: '1px solid #BDBDBD',
          borderBottom: '1px solid #BDBDBD',
        }}
      >
        <Map
          countryFeatures={countryFeatures}
          stateFeatures={stateFeatures}
          height={720}
          initialLevel={0}
          disableZoom={true}
        />
      </div>

      <DiveDeeper
        title="Dive deeper"
        links={[{ to: '/hotspots', name: 'HOTSPOTS' }]}
      />
    </Layout>
  )
}
export default observer(Trends)
