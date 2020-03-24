import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';

import Logo from '../../images/ntd-logo.svg';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 410,
    zIndex: 9,
    position: "relative",
    float: 'left',
    backgroundColor: '#fff',
    /*boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',*/
    padding: theme.spacing(2, 4, 4, 4),
    margin: theme.spacing(-2, 0, -2, -4),
  },
  transparent: {
    background: 'transparent',
    boxShadow: 'none',
    margin: theme.spacing(0),
    padding: theme.spacing(0),
    '&.no-clear': {
      [theme.breakpoints.only('md')]: {
        backgroundColor: '#fff',
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
        padding: theme.spacing(2, 4, 4, 4),
        margin: theme.spacing(-2, 0, -2, -4),
      }
    }
  },
  logo: {
    display: 'block',
    backgroundImage: `url(${Logo})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: 228,
    height: 50,
    margin: theme.spacing(0, 0, 6, 0),
    '& > span': {
      display: 'none'
    }
  },
  title: {
    margin: theme.spacing(0, 0, 3, 0),
  },
  subTitle: {
    marginBottom: 10
  },
  actions: {
    padding: theme.spacing(4, 0, 0, 0),
  }
}));

const Head = ({ title, text, subTitle, transparent, actionLabel, action, classAdd }) => {

  const classes = useStyles();
  classAdd = classAdd ? classAdd : '';

  return (
    <Box className={`${classes.card} ${transparent ? classes.transparent : ''} ${classAdd}`}>


      <NavLink to='/' className={classes.logo}>
        <span>NTD Modelling Consortium</span>
      </NavLink>

      <Typography className={classes.title} variant="h1" component="h1">{title}</Typography>

      {subTitle && <Typography className={classes.subTitle} variant="subtitle2" component="h2">{subTitle}</Typography>}

      {text && <Typography variant="body1" component="p">{text}</Typography>}


      {actionLabel &&
        <div className={classes.actions}>
          <Button onClick={(event) => action(event)} onKeyDown={(event) => action(event)} size="large" variant="contained" color="primary">{actionLabel}</Button>
        </div>
      }
    </Box>
  )
}
export default Head;
