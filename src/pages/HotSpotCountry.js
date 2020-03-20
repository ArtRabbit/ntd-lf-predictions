import React from 'react';

import { Layout } from '../layout';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import Head from './components/Head';
import Inputs from './components/Inputs';
import DiveDeeper from './components/DiveDeeper';

const useStyles = makeStyles(theme => ({
  headLeftColumn: {
    textAlign: 'left'
  },
  headRightColumn: {
    textAlign: 'right',
    padding: theme.spacing(2),
  },
}));

const HotSpotCountry = (props) => {

  const classes = useStyles();


  return (
    <Layout>

      <Grid maxWidth="xl" container spacing={0}>
        <Grid item md={5} xs={12} className={classes.headLeftColumn}>
          <Head
            transparent={true}
            title="Lympahtic filariasis
                        Problem areas
                        Kenya"
          />
        </Grid>
        <Grid item md={7} xs={12} className={classes.headRightColumn}>
          <Inputs />
        </Grid>
      </Grid>

      <DiveDeeper
        title="Dive deeper"
        links={[{ to: '/hot-spots', name: 'PROBLEM AREAS' }, { to: '/country', name: 'SELECT COUNTRY' }]}
      />

    </Layout >
  )
}
export default HotSpotCountry;
