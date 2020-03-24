import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';

import SiteSections from '../pages/components/SiteSections'

import OxfordLogo from '../images/oxford-logo.svg';
import BigDataLogo from '../images/bigdata-logo.png';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 'auto',
  },
  footer: {
    marginTop: 'auto',
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.text.secondary,
  },
  container: {
    padding: theme.spacing(4, 6),
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
    color: theme.palette.text.primary,
    margin: theme.spacing(0, 0, 3, 0),

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
      <footer className={classes.footer}>
        <Container className={classes.container} maxWidth="xl" >

          <Grid container spacing={0}>
            <Grid item md={3} sm={6} xs={12} className={classes.column}>

              <Typography variant="h6" component="h6" className={classes.headline} >Site sections</Typography>


              <ul className={classes.menu}>
                <Typography component="li" variant="body2"><Link component={RouterLink} to="/" color="inherit">Introduction</Link></Typography>
                <Typography component="li" variant="body2"><Link component={RouterLink} to="/trends" color="inherit">Trends</Link></Typography>
                <Typography component="li" variant="body2"><Link component={RouterLink} to="/hotspots" color="inherit">Hotspots</Link></Typography>
                <Typography component="li" variant="body2"><Link component={RouterLink} to="/simulator" color="inherit">Simulator</Link></Typography>
              </ul>

            </Grid>

            <Grid item md={3} sm={6} xs={12} className={classes.column}>

              <Typography variant="h6" component="h6" className={classes.headline} >Further information</Typography>

              <ul className={classes.menu}>
                <Typography component="li" variant="body2"><Link component={RouterLink} to="/about" color="inherit">About</Link></Typography>
                <Typography component="li" variant="body2"><Link component={RouterLink} to="/data" color="inherit">Data</Link></Typography>
                <Typography component="li" variant="body2"><Link component={RouterLink} to="/methodology" color="inherit">Methodology</Link></Typography>
                <Typography component="li" variant="body2"><Link component={RouterLink} to="/ntds" color="inherit">NTDs</Link></Typography>
                <Typography component="li" variant="body2"><Link component={RouterLink} to="/privacy" color="inherit">Privacy&amp;Cookies</Link></Typography>
              </ul>

            </Grid>
            <Grid item md={3} sm={6} xs={12} className={classes.column}>
              <Typography variant="h6" component="h6" className={classes.headline} >Contact</Typography>

              <Typography display="block" variant="body2">Email: <Link href="mailto:contact@email.com" rel="noopener" color="inherit">contact@email.com</Link></Typography>
              <Typography display="block" variant="body2">Twitter: <Link href="https://www.artrabbit.studio/" rel="noopener" target="_blank" color="inherit" variant="body2">@ntdmodelling</Link></Typography>


            </Grid>
            <Grid item md={3} sm={6} xs={12} className={classes.column} >
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
