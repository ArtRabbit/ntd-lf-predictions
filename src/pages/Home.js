import React from 'react';
import { Layout, Header, Footer } from '../layout';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 475,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 18,
    },
    pos: {
        marginBottom: 12,
    },

    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

const Home = ({ history, location }) => {

    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    return (
        <Layout>

            <Header />

            <Container component="main" className={classes.main} maxWidth="l">
                <Card className={classes.root}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            NTD Modelling Consortium
                        </Typography>
                        <Typography variant="h3" component="h1">
                            Lympahtic filariasis Prediction Maps
                        </Typography>
                        <Typography variant="body2" component="p">
                            Welcome to the NTD Modelling Prediction Maps.
                            The predictions in this website provide guidance on
                            the impact of more frequent, longer, or higher
                            coverage treatment would have on timelines to
                            reach the WHO target.
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button variant="contained" color="primary">Enter</Button>
                    </CardActions>
                </Card>


                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>xs=12</Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={classes.paper}>xs=6</Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={classes.paper}>xs=6</Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={classes.paper}>xs=3</Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={classes.paper}>xs=3</Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={classes.paper}>xs=3</Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={classes.paper}>xs=3</Paper>
                    </Grid>
                </Grid>

            </Container>

            <Footer />

        </Layout>
    )
}
export default Home;
