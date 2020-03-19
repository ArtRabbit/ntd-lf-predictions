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
import Arrow from '../images/arrow-right.svg';
import ArrowHover from '../images/arrow-right-hover.svg';

const useStyles = makeStyles(theme => ({
    root: {

    },
    footer: {
        padding: theme.spacing(4, 0, 4, 0),
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
        textTransform: 'uppercase',
        color: theme.palette.text.primary,
        margin: theme.spacing(0, 0, 3, 0),

    },
    bordered: {
        borderBottom: `1px solid ${theme.palette.primary.line}`,
        margin: theme.spacing(0, 0, 2, 0),
    },
    siteSections: {
        padding: theme.spacing(4, 0, 4, 0),

        '& ul': {
            color: theme.palette.text.primary,
            display: 'block',
            listStyleType: 'none',
            padding: 0,
            margin: 0,
            '& li': {
                display: 'block',

                '& a': {
                    display: 'block',
                    backgroundImage: `url(${Arrow})`,
                    backgroundPosition: 'left center',
                    backgroundRepeat: 'no-repeat',
                    padding: theme.spacing(0, 0, 0, 4),
                    '&:hover': {
                        backgroundImage: `url(${ArrowHover})`,
                        textDecoration: 'none'
                    }
                }
            }
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

        <div className={classes.root}>

            <Container maxWidth="xl">
                <Grid container spacing={0}>

                    <Grid item md={5} xs={12} className={classes.siteSections}>
                        <Typography variant="h6" component="h6" className={`${classes.headline} ${classes.bordered}`} >Site sections</Typography>

                        <ul>
                            <Typography component="li" variant="h5"><Link component={RouterLink} to="/intro" color="inherit">Introduction</Link></Typography>
                            <Typography component="li" variant="h5"><Link component={RouterLink} to="/trends" color="inherit">Trends</Link></Typography>
                            <Typography component="li" variant="h5"><Link component={RouterLink} to="/hot-spots" color="inherit">Hotspots</Link></Typography>
                            <Typography component="li" variant="h5"><Link component={RouterLink} to="/simulator" color="inherit">Simulator</Link></Typography>
                        </ul>
                    </Grid>
                </Grid>
            </Container>

            <footer className={classes.footer}>
                <Container maxWidth="xl" >

                    <Grid container spacing={0}>
                        <Grid item md={3} xs={12} className={classes.column}>

                            <Typography variant="h6" component="h6" className={classes.headline} >Further information</Typography>

                            <ul className={classes.menu}>
                                <Typography component="li" variant="body2"><Link component={RouterLink} to="/about" color="inherit">About</Link></Typography>
                                <Typography component="li" variant="body2"><Link component={RouterLink} to="/data" color="inherit">Data</Link></Typography>
                                <Typography component="li" variant="body2"><Link component={RouterLink} to="/methodology" color="inherit">Methodology</Link></Typography>
                                <Typography component="li" variant="body2"><Link component={RouterLink} to="/ntds" color="inherit">NTDs</Link></Typography>
                                <Typography component="li" variant="body2"><Link component={RouterLink} to="/privacy" color="inherit">Privacy&amp;Cookies</Link></Typography>
                            </ul>

                        </Grid>
                        <Grid item md={3} xs={12} className={classes.column}>
                            <Typography variant="h6" component="h6" className={classes.headline} >Contact</Typography>

                            <Typography display="block" variant="body2">Email: <Link href="mailto:contact@email.com" rel="noopener" color="inherit">contact@email.com</Link></Typography>
                            <Typography display="block" variant="body2">Twitter: <Link href="https://www.artrabbit.studio/" rel="noopener" target="_blank" color="inherit" variant="body2">@ntdmodelling</Link></Typography>


                        </Grid>
                        <Grid item md={6} xs={12} className={classes.column} >
                            <Typography variant="h6" component="h6" className={classes.headline} >In collaboration with</Typography>
                            <img className={classes.logo} src={OxfordLogo} alt="University of Oxford" />
                            <img className={classes.logo} src={BigDataLogo} alt="Big Data Institute" />

                        </Grid>

                        <Grid item xs={12} className={classes.column}>
                            <Typography variant="h6" component="h6" className={classes.headline} >designed and made by</Typography>
                            <Link href="https://www.artrabbit.studio/" rel="noopener" target="_blank" color="inherit" variant="body2">ArtRabbit Studio</Link>
                        </Grid>

                    </Grid>

                </Container>
            </footer>
        </div>
    )
}
export default Footer;
