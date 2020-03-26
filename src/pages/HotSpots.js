import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { values, sortBy, take } from 'lodash'

import { Layout } from '../layout'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Grid } from '@material-ui/core'
import SectionTitle from './components/SectionTitle'

import HeadWithInputs from './components/HeadWithInputs'
import DiveDeeper from './components/DiveDeeper'
import SlopeChart from '../components/SlopeChart'
import LineChart from '../components/LineChart'

import Map from '../components/Map'
import { useDataAPI } from '../hooks/stateHooks'

const useStyles = makeStyles(theme => ({
  chartContainer: {
    position: 'relative',
    padding: 0,
  },
  slopeContainer: {
    marginTop: 38,
  },
}))

const PanelContainer = ({ children }) => (
  <div style={{ display: 'flex', overflow: 'auto', position: 'relative' }}>
    {children}
  </div>
)

const HotSpots = props => {
  const classes = useStyles()
  const {
    countryData,
    countryFeatures,
    stateFeatures,
    stateByCountryData,
    stateScales,
  } = useDataAPI()
  const [selectedSlope, setSelectedSlope] = useState()

  const showDetail = selectedSlope && stateByCountryData && countryData

  return (
    <Layout>
      <HeadWithInputs
        transparent={true}
        title="Lymphatic filariasis Hotspots"
        text="The LF hotspots showcase areas of activity, improvements or decline. "
      />

      <SectionTitle
        top={false}
        headline="District hotspots"
        text={`Get an overview of district hotspots and areas of activity in all modelled countries. To see alternative outcomes, change your treatment scenario in the top menu.`}
      />

      <div
        style={{
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <Map
          countryFeatures={countryFeatures}
          stateFeatures={stateFeatures}
          height={720}
          disableZoom={true}
          colorScale={stateScales.prev}
        />
      </div>

      <Box className={classes.chartContainer}>
        <SectionTitle
          headline="Top improving countries"
          text={`See top improving countries and their projected development over time. To see alternative outcomes, change your treatment scenario in the top menu.`}
        />
        {countryData &&
          take(
            sortBy(values(countryData.data), 'performance').map(country => {
              const { id, name, performance } = country
              return (
                <Box key={id} p={1} mb={1} className={classes.chartContainer}>
                  <Typography variant="body2" component="p">
                    <strong>{name}</strong>
                  </Typography>
                  <Typography variant="body2" component="p" color="primary">
                    <strong>{`${-performance}% drop in the prevalence of LF`}</strong>
                  </Typography>
                  <LineChart
                    data={[country]}
                    width={800}
                    height={100}
                    yDomain={30}
                    clipDomain
                  />
                </Box>
              )
            }),
            4
          )}
      </Box>

      <SectionTitle
        headline="District Activity"
        text={`Districts in country that are improving, getting worse or are below the 1% threashold`}
      />

      <Grid container spacing={0}>
        {showDetail && (
          <Grid item md={3} xs={12}>
            {Object.entries(stateByCountryData).map(
              ([key, { data, stats }]) => {
                if (key === selectedSlope) {
                  return (
                    <Box key={key}>
                      <Typography variant="body2">
                        <strong>{countryData.data[key].name}</strong>
                      </Typography>
                      <SlopeChart
                        data={Object.values(data)}
                        width={250}
                        height={300}
                        start={2015}
                        end={2030}
                        name={countryData.data[key].name}
                        showAxis={true}
                        showInfo={true}
                        clipDomain={true}
                        svgPadding={[20, 16, 20, 16]}
                      />
                    </Box>
                  )
                }
                return null
              }
            )}
          </Grid>
        )}
        <Grid
          item
          md={showDetail ? 9 : 12}
          xs={12}
          className={classes.chartContainer}
        >
          <PanelContainer>
            {stateByCountryData &&
              countryData &&
              Object.entries(stateByCountryData).map(
                ([key, { data, stats }]) => {
                  return (
                    <Box key={key} className={classes.slopeContainer}>
                      <SlopeChart
                        data={Object.values(data)}
                        width={40}
                        height={300}
                        start={2015}
                        end={2030}
                        name={countryData.data[key].name}
                        setSelectedSlope={setSelectedSlope}
                        countryKey={key}
                        clipDomain={false}
                        svgPadding={[20, 0, 20, 0]}
                      />
                    </Box>
                  )
                }
              )}
          </PanelContainer>
        </Grid>
      </Grid>

      <DiveDeeper
        title="Dive deeper"
        links={[{ to: '/trends', name: 'Trends' }]}
      />
    </Layout>
  )
}
export default observer(HotSpots)
