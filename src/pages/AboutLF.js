import React from 'react';
import Layout from '../layout/Layout';
import Typography from '@material-ui/core/Typography';

import Head from './components/Head';
import TextContents from './components/TextContents'

const AboutLF = (props) => {

  return (
    <Layout>

      <Head
        title="About LF"
        text={
          `TBC`
        }
      />

      <TextContents>

        <Typography color="primary" gutterBottom variant="h2">Responsive h2 color primary gutterBottom</Typography>
        <Typography color="secondary" gutterBottom variant="h2">Responsive h2 color secondary gutterBottom</Typography>
        <Typography color="textPrimary" gutterBottom variant="h2">Responsive h2 color textPrimary gutterBottom</Typography>
        <Typography color="textSecondary" gutterBottom variant="h2">Responsive h2 color textPrimary gutterBottom</Typography>
        <Typography gutterBottom variant="h3">Responsive h3</Typography>
        <Typography variant="h4">Responsive h4</Typography>
        <Typography paragraph variant="body1" component="p">
          Need a copy text element here paragraph
        </Typography>
        <Typography variant="h5">Responsive h5</Typography>

        <Typography variant="subtitle1">subtitle 1</Typography>
        <Typography variant="subtitle2">subtitle 2</Typography>


        <Typography paragraph variant="body1" component="p">
          Need a copy text element here paragraph
        </Typography>
        <Typography paragraph variant="body2" component="p">
          Need a copy text element here paragraph
        </Typography>

      </TextContents>
    </Layout>
  )
}
export default AboutLF;
