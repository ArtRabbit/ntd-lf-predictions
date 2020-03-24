import React from 'react'
import { observer } from 'mobx-react'
import { Box, Typography, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useDataAPI, useUIState } from '../hooks/stateHooks'
import { Layout } from '../layout'
import Map from '../components/Map'
import BumpChart from '../components/BumpChart'
import HeadWithInputs from './components/HeadWithInputs'
import Inputs from './components/Inputs'
import DiveDeeper from './components/DiveDeeper'
import ReadMore from './components/ReadMore'
import ExpandableInfo from './components/ExpandableInfo'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'
import ChartSettings from './components/ChartSettings'
import SectionTitle from './components/SectionTitle'
import Timeline from '../components/Timeline'
import BarChart from '../components/BarChart'

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

const TrendsCountry = props => {
  const classes = useStyles()
  const {
    selectedCountry,
    countryData,
    countryFeatures,
    stateFeatures,
    stateData,
  } = useDataAPI()

  const settingsClickDemo = event => {
    alert('update graphs')
  }

  const { country } = useUIState()

  return (
    <Layout>
      <HeadWithInputs
        transparent={true}
        title={`Lymphatic filariasis Trends: ${selectedCountry?.name || '...'}`}
        text={`The LF projection trends take output of the model and highlight different possible outcomes developed over time. `}
      />

      <SectionTitle
        top={false}
        headline=" "
        text=" "
      >

      <ExpandableInfo title={`${selectedCountry?.name || '...'} facts`}>
        <Box variant="body1">
          <Typography component="p">
            Population xxx
            <br />
            50k people affected in 2030
            <br />3 districts with high prevalence
          </Typography>
        </Box>
      </ExpandableInfo>

      </SectionTitle>


      <SectionTitle
        top={true}
        headline="Intervention needs"
        text={`Compare the population in need of intervention in 2020 with the projections for 2030. To see alternative outcomes, change your treatment scenario in the top menu.`}
      >

      </SectionTitle>
      <Box className={classes.chartContainer}>
      {stateData && <BarChart data={Object.values(stateData.data)} />}
      </Box>
      
      <SectionTitle
        top={false}
        headline="Trend graph"
        text={`Review historic prevalence and probable eradication over time through 2030. To see alternative outcomes, change your treatment scenario in the top menu.`}
      >

      </SectionTitle>
      <Box className={classes.chartContainer}>
        {stateData && <Timeline dataAndStats={stateData} />}
      </Box>

      <Grid container justify="center">
        <Grid sm={12} item>
          <Box className={classes.chartContainer}>
            <ChartSettings
              action={settingsClickDemo}
              title="Settings"
              buttonText="Update graphs"
            >
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
              </FormControl>
            </ChartSettings>
            <SectionTitle
              top={false}
              headline="Development of prevalence"
              text={`Get an overview of how the prevalence of LF in each country/district developed over time. To see alternative outcomes, change your treatment scenario in the top menu.`}
            />
            {stateData && <BumpChart data={Object.values(stateData.data)} />}
          </Box>
        </Grid>
      </Grid>

      <SectionTitle
        top={false}
        headline="Trend Map"
        text={`View good and bad performance by district and compare prevalence over time through 2030. To see alternative outcomes, change your treatment scenario in the top menu.`}
      >

      </SectionTitle>

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
          disableZoom={true}
          country={country}
          trendMode
        />
      </div>

      <DiveDeeper
        title="Dive deeper"
        links={[
          {
            to: `/hotspots/${country}`,
            name: `HOTSPOTS ${selectedCountry?.name || '...'}`,
          },
          {
            to: `/hotspots`,
            name: `HOTSPOTS ALL COUNTRIES`,
          },
          {
            to: `/trends`,
            name: `TRENDS ALL COUNTRIES`,
          },
        ]}
      />
    </Layout>
  )
}
export default observer(TrendsCountry)
