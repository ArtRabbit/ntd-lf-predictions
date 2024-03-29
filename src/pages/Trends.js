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

import HeadWithInputs from './components/HeadWithInputs'
import SectionTitle from './components/SectionTitle'
import DiveDeeper from './components/DiveDeeper'
import ReadMore from './components/ReadMore'

import ChartSettings from './components/ChartSettings'
import Map from '../components/Map'
import Timeline from '../components/Timeline'
import BarChart from '../components/BarChart'

const useStyles = makeStyles(theme => ({
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

  const {
    countryData,
    countryFeatures,
    stateFeatures,
    stateScales,
  } = useDataAPI()

  const settingsClickDemo = event => {
    alert('update graphs')
  }

  return (
    <Layout>
      <HeadWithInputs transparent={true} title="Lymphatic filariasis Trends" text={`The LF projection trends take the output of the model to highlight different possible outcomes developed over time.`} />

      <SectionTitle
        top={false}
        headline="Intervention needs"
        text={`Compare which populations are in need of intervention in 2000 with the projections for 2030. To see alternative outcomes, change the treatment scenario in the top menu.`}
      />

      {countryData && <BarChart dataAndStats={countryData} />}

      <SectionTitle
        top={false}
        headline="Trend graph"
        text={`Review historic prevalence and probability of elimination as a public health problem over time, from 2000 to 2030. To see alternative outcomes, change your treatment scenario in the top menu.`}
      />

      <Box className={classes.chartContainer}>
        {countryData && <Timeline dataAndStats={countryData} />}
      </Box>

      <SectionTitle
        top={false}
        headline="Trend map"
        text={`View good and bad performance by district in each country over time from 2000 to 2030. To see alternative outcomes, change the treatment scenario in the top menu.`}
      />

      <div
        style={{
          borderTop: '1px solid #e0e0e0',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Map
          countryFeatures={countryFeatures}
          stateFeatures={stateFeatures}
          colorScale={stateScales.perf}
          height={720}
          disableZoom={true}
          trendMode
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
