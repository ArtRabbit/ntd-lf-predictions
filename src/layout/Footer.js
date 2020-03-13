import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
    footer: {
        padding: theme.spacing(0, 0, 2, 0),
        marginTop: 'auto',
        backgroundColor: theme.palette.grey[900],
        color: 'white',
    },
    footerColumn: {
        padding: theme.spacing(2, 2, 2, 0),
    },
    footerMenu: {
        display: 'block',
        listStyleType: 'none',
        padding: 0,
        margin: 0
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


            <Container maxWidth="xl">

                <Grid container spacing={0}>
                    <Grid item xs={12} className={classes.footerColumn}>
                        <Typography variant="body1">Footer</Typography>
                    </Grid>
                    <Grid item md={4} xs={12} className={classes.footerColumn}>

                        Logos
                        <ul className={classes.footerMenu}>
                            <li><Link component={RouterLink} to="/about">About</Link></li>
                            <li><Link component={RouterLink} to="/contact">Contact</Link></li>
                        </ul>



                    </Grid>
                    <Grid item md={4} xs={12} className={classes.footerColumn}>
                        About LF
                    </Grid>
                    <Grid item md={4} xs={12} className={classes.footerColumn}>
                        copy
                    </Grid>
                </Grid>

            </Container>
        </footer>
    )
}
export default Footer;
