import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';

import Arrow from '../../images/arrow-right.svg';
import ArrowHover from '../../images/arrow-right-hover.svg';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4, 6),
    '&.gutter': {
      paddingTop: theme.spacing(12),
    }
  },
  headline: {
    color: theme.palette.text.primary,
    margin: theme.spacing(0, 0, 3, 0),

  },
  bordered: {
    borderBottom: `1px solid ${theme.palette.primary.line}`,
    margin: theme.spacing(0, 0, 2, 0),
  },
  siteSections: {

    '& ul': {
      color: theme.palette.text.primary,
      display: 'block',
      listStyleType: 'none',
      padding: 0,
      margin: 0,
      '& li': {
        display: 'block',
        padding: '0px 0px .4rem 0px',

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
  }
}));

const SiteSections = (props) => {

  const classes = useStyles();
  const classAdd = props.classAdd ? props.classAdd : '';

  return (

    <section className={`${classes.root} ${classAdd}`}>
      <Grid container spacing={0}>

        <Grid item md={5} xs={12} className={classes.siteSections}>
          <Typography variant="h6" component="h6" className={`${classes.headline} ${classes.bordered}`} >Site sections</Typography>

          <ul>
            <Typography component="li" variant="h3"><Link component={RouterLink} to="/intro" color="inherit">Introduction</Link></Typography>
            <Typography component="li" variant="h3"><Link component={RouterLink} to="/trends" color="inherit">Trends</Link></Typography>
            <Typography component="li" variant="h3"><Link component={RouterLink} to="/hot-spots" color="inherit">Hotspots</Link></Typography>
            <Typography component="li" variant="h3"><Link component={RouterLink} to="/simulator" color="inherit">Simulator</Link></Typography>
          </ul>
        </Grid>
      </Grid>
    </section>
  )
}
export default SiteSections;
