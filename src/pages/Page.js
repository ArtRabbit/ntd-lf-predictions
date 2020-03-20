import React from 'react';
import Layout from '../layout/Layout';
import Grid from '@material-ui/core/Grid';

import Head from './components/Head';
import SiteSections from './components/SiteSections'

const Page = (props) => {

  return (
    <Layout>

      <Head
        title="Default page"
        text={
          `TBC`
        }
      />

    </Layout>
  )
}
export default Page;
