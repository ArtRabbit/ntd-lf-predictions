import React from 'react';
import Layout from '../layout/Layout';
import Grid from '@material-ui/core/Grid';

import Head from './components/Head';

const Page = (props) => {

  return (
    <Layout>

      <Head
        title="This page could not be found"
        text={
          `404`
        }
      />

    </Layout>
  )
}
export default Page;
