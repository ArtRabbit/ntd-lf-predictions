import React from 'react';

import { Layout } from '../layout';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import Head from './components/Head';

// demo
import map from '../images/demo/map.png';

const useStyles = makeStyles(theme => ({
    map: {
        width: '100%',
        position: "relative",
        zIndex: 1,
        margin: "-300px 0px 0px 0px",
        '& > img': {
            width: '100%',
            height: 'auto'
        },
        '&:after': {
            content: "''",
            display: 'block',
            width: '100%',
            height: '100%',
            background: 'red'
        },
    },
}));

const Intro = ({ history, location }) => {

    const classes = useStyles();

    const playScenario = (event) => {
        if (event.type === 'click' || event.key === 'Enter' || event.key === ' ') {
            alert('Playing');
        }
    }

    return (
        <Layout>

            <Head
                transparent={true}
                title="Lympahtic filariasis Predicted outcome 2030"
                text={
                    `Welcome to the NTD Modelling Prediction Maps.
                    The predictions in this website provide guidance on
                    the impact of more frequent, longer, or higher
                    coverage treatment would have on timelines to
                    reach the WHO target.`
                }
                subTitle={"Current WHO guidelines"}
                actionLabel={"PLAY SCENARIO"}
                action={playScenario}
            />



            <Box component="figure" m={1} className={classes.map}>
                <img src={map} alt="map" />
            </Box>

        </Layout >
    )
}
export default Intro;
