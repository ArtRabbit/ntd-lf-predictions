import React from 'react'
import { observer } from 'mobx-react'

import { Layout } from '../layout'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import Head from './components/Head'
import Inputs from './components/Inputs'
import DiveDeeper from './components/DiveDeeper'
import SiteSections from './components/SiteSections'

import Map from '../components/Map'
import { useDataAPI } from '../hooks/stateHooks'

const useStyles = makeStyles(theme => ({
  headLeftColumn: {
    textAlign: 'left',
  },
  headRightColumn: {
    textAlign: 'right',
    padding: theme.spacing(2),
  },
}))

const HotSpots = (props) => {
  const classes = useStyles()
  const { stateData, stateFeatures } = useDataAPI()


  return (
    <Layout>
      <Grid container spacing={0}>
        <Grid item md={5} xs={12} className={classes.headLeftColumn}>
          <Head transparent={true} title="Lympahtic filariasis Problem areas" />
        </Grid>
        <Grid item md={7} xs={12} className={classes.headRightColumn}>
          <Inputs />
        </Grid>
      </Grid>

      <div style={{borderTop: "1px solid #BDBDBD",borderBottom: "1px solid #BDBDBD"}}>
      <Map
        data={stateData?.data}
        features={stateFeatures}
        height={720}
        initialLevel={0}
        disableZoom={true}
      />
      </div>

      <DiveDeeper
        title="Dive deeper"
        links={[
          { to: '/trends', name: 'Trends' },
          { to: '/country', name: 'SELECT COUNTRY' },
        ]}
      />
    </Layout>
  )
}
export default observer(HotSpots)
