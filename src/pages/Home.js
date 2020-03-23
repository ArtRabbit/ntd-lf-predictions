import React from 'react';
import { useHistory } from 'react-router-dom';

import { Layout } from '../layout';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import HeadWithInputs from './components/HeadWithInputs';

// demo
import map from '../images/demo/map.png';

const useStyles = makeStyles(theme => ({
  map: {
    width: '100%',
    position: "relative",
    zIndex: 1,
    opacity: 0.5,
    top: "-300px",
    marginBottom: '-300px',
    '& > img': {
      width: '100%',
      height: 'auto'
    },
  },
}));

const Home = (props) => {

  const classes = useStyles();
  const history = useHistory();

  const showIntro = (event) => {
    if (event.type === 'click' || event.key === 'Enter' || event.key === ' ') {
      history.push('/intro');
    }
  }

  return (
    <Layout classAdd="violet">

      <HeadWithInputs
        title="Lymphatic filariasis Prediction Maps"
        text={
          `Welcome to the NTD Modelling Prediction Maps.
                    The predictions in this website provide guidance on
                    the impact of more frequent, longer, or higher
                    coverage treatment would have on timelines to
                    reach the WHO target.`
        }
        actionLabel={"Enter"}
        action={showIntro}
      />


    </Layout >
  )
}
export default Home;
