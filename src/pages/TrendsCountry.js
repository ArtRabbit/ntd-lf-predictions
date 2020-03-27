import React, { Fragment } from 'react'
import { observer } from 'mobx-react'
import { Box, Typography, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { abbrNum } from '../utils'

import { useDataAPI, useUIState } from '../hooks/stateHooks'
import { Layout } from '../layout'
import Map from '../components/Map'
import BumpChart from '../components/BumpChart'
import HeadWithInputs from './components/HeadWithInputs'
import Inputs from './components/Inputs'
import DiveDeeper from './components/DiveDeeper'
import ReadMore from './components/ReadMore'
import ExpandableInfoStandalone from './components/ExpandableInfoStandalone'
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
    countryFeatures,
    stateFeaturesCurrentCountry: stateFeatures,
    stateDataCurrentCountry: stateData,
    stateScales,
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
        text={`The LF projection trends take the output of the model to highlight different possible outcomes developed over time.`}
      />

      <ExpandableInfoStandalone
        title={`${selectedCountry?.name || '...'} facts`}
      >
        <Typography component="p">
          {selectedCountry && (
            <Typography component="p">
              <Fragment key={`intro-${1}`}>
                {`Population modelled: ${abbrNum(
                  selectedCountry.population,
                  0
                )}`}
                <br />
              </Fragment>
              <Fragment key={`intro-${2}`}>
                {`Prevalence 2020: ${selectedCountry.prevalence[2020]}%`}
                <br />
              </Fragment>
              <Fragment key={`intro-${3}`}>
                {`Probability of eradication by 2030: ${(
                  selectedCountry.probability[2020] * 100
                ).toFixed(2)}%`}
                <br />
              </Fragment>
            </Typography>
          )}
        </Typography>
      </ExpandableInfoStandalone>

      <SectionTitle
        top={true}
        headline="Intervention needs"
        text={`Compare which populations are in need of intervention in 2020 with the projections for 2030. To see alternative outcomes, change the treatment scenario in the top menu.`}
      ></SectionTitle>
      <Box className={classes.chartContainer}>
        {stateData && <BarChart dataAndStats={stateData} />}
      </Box>

      <SectionTitle
        top={false}
        headline="Trend graph"
        text={`Review historic prevalence and probability of elimination as a public health problem over time, from 2000 to 2030. To see alternative outcomes, change your treatment scenario in the top menu.`}
      ></SectionTitle>
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
              text={`An overview of how the prevalence of LF in each district has developed over time. To see alternative outcomes, change the treatment scenario in the top menu.`}
            />
            {stateData && <BumpChart data={Object.values(stateData.data)} />}
          </Box>
        </Grid>
      </Grid>

      <SectionTitle
        top={false}
        headline="Trend map"
        text={`View good and bad performance by district and compare prevalence over time from 2000 to 2030. To see alternative outcomes, change the treatment scenario in the top menu.`}
      ></SectionTitle>

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
