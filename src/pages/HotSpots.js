import React from 'react'
import { observer } from 'mobx-react'

import { Layout } from '../layout'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Typography, Grid } from '@material-ui/core'
import SectionTitle from './components/SectionTitle'

import HeadWithInputs from './components/HeadWithInputs'
import DiveDeeper from './components/DiveDeeper'
import SiteSections from './components/SiteSections'
import SlopeChart from '../components/SlopeChart'

import Map from '../components/Map'
import { useDataAPI } from '../hooks/stateHooks'

const useStyles = makeStyles(theme => ({}))

const PanelContainer = ({ children }) => (
  <div style={{ display: 'flex', overflow: 'auto', position: 'relative' }}>
    {children}
  </div>
)

const HotSpots = props => {
  const classes = useStyles()
  const { countryFeatures, stateFeatures, stateByCountryData } = useDataAPI()

  return (
    <Layout>
      <HeadWithInputs
        transparent={true}
        title="Lymphatic filariasis Hotspots"
      />

      <SectionTitle
        top={true}
        headline="District hotspots"
        text={`Showing district hotspost in all countries`}
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
          disableZoom={true}
        />
      </div>

      <Box className={classes.chartContainer}>
        <SectionTitle
          headline="Top affected countries"
          text={`And their projected development over time`}
        />
        <img
          src={'http://ntd.artrabbit.studio/static/curve-rank.png'}
          alt="rank graph"
        />
      </Box>

      <SectionTitle
        headline="Activity"
        text={`Districts in country that are improving, getting worse or are below the 1% threashold`}
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
        links={[{ to: '/trends', name: 'Trends' }]}
      />
    </Layout>
  )
}
export default observer(HotSpots)
