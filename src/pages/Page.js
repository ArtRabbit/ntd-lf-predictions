import React from 'react';
import Layout from '../layout/Layout';
import Grid from '@material-ui/core/Grid';

import Head from './components/Head';
import SiteSections from './components/SiteSections'

const Page = ({ history, location }) => {

  return (
    <Layout>

      <Head
        title="Default page"
        text={
          `TBC`
        }
      />

      <SiteSections />
    </Layout>
  )
}
export default Page;
