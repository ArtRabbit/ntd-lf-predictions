import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Grid } from '@material-ui/core'
import { values, sortBy, take } from 'lodash'

import { useDataAPI, useUIState } from '../hooks/stateHooks'

import { Layout } from '../layout'
import ExpandableInfoStandalone from './components/ExpandableInfoStandalone'
import HeadWithInputs from './components/HeadWithInputs'
import DiveDeeper from './components/DiveDeeper'
import SectionTitle from './components/SectionTitle'

import SlopeChart from '../components/SlopeChart'
import Map from '../components/Map'
import LineChart from '../components/LineChart'

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

const HotSpotCountry = props => {
  const classes = useStyles()

  const {
    countryFeatures,
    stateFeatures,
    iuFeatures,
    selectedCountry,
    iuByStateData,
    stateData,
    iuScales,
  } = useDataAPI()

  const [selectedSlope, setSelectedSlope] = useState()
  const showDetail = selectedSlope && iuByStateData

  const { country } = useUIState()

  return (
    <Layout>
      <HeadWithInputs
        transparent={true}
        title={`Lymphatic filariasis Hotspots: ${selectedCountry?.name ||
          '...'}`}
        text="The LF hotspots showcase areas of activity, improvements or decline."
      />

      <ExpandableInfoStandalone
        title={`${selectedCountry?.name || '...'} facts`}
      >
        <Typography component="p">
          Population xxx
          <br />
          50k people affected in 2030
          <br />3 districts with high prevalence
        </Typography>
      </ExpandableInfoStandalone>

      <div
        style={{
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <Map
          countryFeatures={countryFeatures}
          stateFeatures={stateFeatures}
          iuFeatures={iuFeatures}
          height={720}
          disableZoom={true}
          country={country}
          colorScale={iuScales.prev}
        />
      </div>

      <Box className={classes.chartContainer}>
        <SectionTitle
          headline="Top affected districts"
          text={`Get a detailed view of top affected districts and their projected development over time. To see alternative outcomes, change your treatment scenario in the top menu.`}
        />
        {stateData &&
          take(
            sortBy(values(stateData.data), 'performance').map(state => {
              const { id, name, performance } = state
              return (
                <Box key={id} p={1} mb={1} className={classes.chartContainer}>
                  <Typography variant="body2" component="p">
                    <strong>{name}</strong>
                  </Typography>
                  <Typography variant="body2" component="p" color="primary">
                    <strong>{`${-performance}% drop in the prevalence of LF`}</strong>
                  </Typography>
                  <LineChart
                    data={[state]}
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
        headline="District activity"
        text={`Get a detailed view of performance in districts. See where prevalence is improving, increasing, and what areas are reaching the WHO 1% threshold. To see alternative outcomes, change your treatment scenario in the top menu.`}
      />

      <Grid container spacing={0}>
        {showDetail && (
          <Grid item md={3} xs={12}>
            {Object.entries(iuByStateData).map(([key, { data, stats }]) => {
              // some entries might have no ranks attached because of NaN values for some years
              const withRanks = Object.values(data).filter(d => !!d.ranks)
              if (key === selectedSlope) {
                return (
                  <Box key={key}>
                    <Typography variant="body2">
                      <strong>{stateData.data[key].name}</strong>
                    </Typography>
                    <SlopeChart
                      data={withRanks}
                      width={250}
                      height={300}
                      start={2015}
                      end={2030}
                      name={stateData.data[key].name}
                      showAxis={true}
                      showInfo={true}
                      clipDomain={true}
                      svgPadding={[20, 16, 20, 16]}
                    />
                  </Box>
                )
              }
              return null
            })}
          </Grid>
        )}
        <Grid
          item
          md={showDetail ? 9 : 12}
          xs={12}
          className={classes.chartContainer}
        >
          <PanelContainer>
            {iuByStateData &&
              Object.entries(iuByStateData).map(([key, { data, stats }]) => {
                // some entries might have no ranks attached because of NaN values for some years
                const withRanks = Object.values(data).filter(d => !!d.ranks)
                return (
                  <Box key={key} className={classes.slopeContainer}>
                    <SlopeChart
                      data={withRanks}
                      width={40}
                      height={300}
                      start={2015}
                      end={2030}
                      name={stateData.data[key].name}
                      setSelectedSlope={setSelectedSlope}
                      countryKey={key}
                      clipDomain={false}
                      svgPadding={[20, 0, 20, 0]}
                    />
                  </Box>
                )
              })}
          </PanelContainer>
        </Grid>
      </Grid>

      <DiveDeeper
        title="Dive deeper"
        links={[
          {
            to: `/trends/${country}`,
            name: `TRENDS ${selectedCountry?.name || '...'}`,
          },
        ]}
      />
    </Layout>
  )
}
export default observer(HotSpotCountry)
