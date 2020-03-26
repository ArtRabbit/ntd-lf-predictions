import React from 'react';

import { Header, Footer } from './';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    minHeight: '100vh',

    [theme.breakpoints.up('lg')]: {
    }
  },
  main: {
    //paddingTop: theme.spacing(4),
    padding: theme.spacing(4, 6),
    flex: 2,
    position: 'relative',
    '&:after': {
      content: `''`,
      display: 'table',
      clear: 'both'
    },



    [theme.breakpoints.up('md')]: {
      '&.full-height': {
        height: '100vh',
        minHeight: 800,
        display: 'block',
        flex: 'none'
      }
    }
  },
}));

const Layout = (props) => {

  const classes = useStyles();
  const classAdd = props.classAdd ? props.classAdd : '';
  const disableFooter = props.disableFooter ? true : false;

  return (
    <div className={`${classes.root} ${classAdd}`}>

      <Container component="main" className={`${classes.main} ${classAdd}`} maxWidth="xl">
        {props.children}
      </Container>

      {!disableFooter && <Footer />}

    </div>
  )
}
export default Layout;