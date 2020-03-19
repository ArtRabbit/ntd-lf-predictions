import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { NavLink } from 'react-router-dom';

import OxfordLogo from '../images/oxford-logo.svg';
import BigDataLogo from '../images/bigdata-logo.png';

const useStyles = makeStyles(theme => ({
    footer: {
        padding: theme.spacing(0, 0, 2, 0),
        marginTop: 'auto',
        backgroundColor: theme.palette.secondary.light,
        color: theme.palette.text.secondary,
    },
    column: {
        padding: theme.spacing(2, 2, 2, 0),
    },
    menu: {
        display: 'block',
        listStyleType: 'none',
        padding: 0,
        margin: 0
    },
    headline: {
        textTransform: 'uppercase'
    },
    buttonGroup: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(1, 1),
        backgroundColor: theme.palette.primary.light,
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    logo: {
        width: 83,
        height: 'auto',
        marginRight: theme.spacing(2),
    }
}));

const Footer = (props) => {

    const classes = useStyles();

    return (
        <footer className={classes.footer}>

            <div className={classes.buttonGroup}>
                <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/intro">
                    INTRO
                    </Button>

                <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/trends">
                    TRENDS
                    </Button>

                <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/hot-spots">
                    HOT SPOTS
                    </Button>
                <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/simulator">
                    SIMULATOR
                    </Button>
            </div>


            <Container maxWidth="xl" >

                <Grid container spacing={0}>
                    <Grid item md={3} xs={12} className={classes.column}>

                        <Typography variant="h6" component="h6" className={classes.headline} gutterBottom>Further information</Typography>

                        <ul className={classes.menu}>
                            <li><Link component={RouterLink} to="/about" color="inherit">About</Link></li>
                            <li><Link component={RouterLink} to="/data" color="inherit">Data</Link></li>
                            <li><Link component={RouterLink} to="/methodology" color="inherit">Methodology</Link></li>
                            <li><Link component={RouterLink} to="/ntds" color="inherit">NTDs</Link></li>
                            <li><Link component={RouterLink} to="/privacy" color="inherit">Privacy&amp;Cookies</Link></li>
                        </ul>

                    </Grid>
                    <Grid item md={3} xs={12} className={classes.column}>
                        <Typography variant="h6" component="h6" className={classes.headline} gutterBottom>Contact</Typography>
                    </Grid>
                    <Grid item md={6} xs={12} className={classes.column}>
                        <Typography variant="h6" component="h6" className={classes.headline} gutterBottom>In collaboration with</Typography>
                        <img className={classes.logo} src={OxfordLogo} alt="University of Oxford" />
                        <img className={classes.logo} src={BigDataLogo} alt="Big Data Institute" />

                    </Grid>

                    <Grid item xs={12} className={classes.column}>
                        <Typography variant="h6" component="h6" className={classes.headline} gutterBottom>designed and made by</Typography>
                        <Link href="https://www.artrabbit.studio/" rel="noopener" target="_blank" color="inherit" variant="body2">ArtRabbit Studio</Link>
                    </Grid>

                </Grid>

            </Container>
        </footer>
    )
}
export default Footer;
