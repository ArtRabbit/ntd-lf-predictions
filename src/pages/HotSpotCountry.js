import React from 'react'
import { observer } from 'mobx-react'

import { Layout } from '../layout'
import { makeStyles } from '@material-ui/core/styles'
import { useDataAPI, useUIState } from '../hooks/stateHooks'
import ExpandableInfoStandalone from './components/ExpandableInfoStandalone'

import { Box, Typography, Grid } from '@material-ui/core'
import Map from '../components/Map'
import SlopeChart from '../components/SlopeChart'
import HeadWithInputs from './components/HeadWithInputs'
import DiveDeeper from './components/DiveDeeper'
import SectionTitle from './components/SectionTitle'

const useStyles = makeStyles(theme => ({}))

const PanelContainer = ({ children }) => (
  <div style={{ display: 'flex', overflow: 'auto', position: 'relative' }}>
    {children}
  </div>
)

const HotSpotCountry = props => {
  const classes = useStyles()
  const {
    stateData,
    countryFeatures,
    stateFeatures,
    selectedCountry,
    stateByCountryData,
  } = useDataAPI()

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
        />
      </div>

      <Box className={classes.chartContainer}>
        <SectionTitle
          headline="Top affected districts"
          text={`Get a detailed view of top affected districts and their projected development over time. To see alternative outcomes, change your treatment scenario in the top menu.`}
        />
        <img
          src={'http://ntd.artrabbit.studio/static/curve-rank.png'}
          alt="rank graph"
        />
      </Box>

      <SectionTitle
        headline="Implementation Unit Activity"
        text={`Get a detailed view of the IU performance. See where prevalence is improving, increasing, and what areas are reaching the WHO 1% threshold. To see alternative outcomes, change your treatment scenario in the top menu.`}
      />

      <Box className={classes.chartContainer}>
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
      </Box>

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
