import React from 'react';

import { Header, Footer } from './';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'white',
  },
  main: {
    //paddingTop: theme.spacing(4),
    padding: theme.spacing(4, 6),
    flex: 2,

  },
}));

const Layout = (props) => {

  const classes = useStyles();

  return (
    <div className={classes.root}>

      <Header />

      <Container component="main" className={classes.main} maxWidth="xl">
        {props.children}
      </Container>

      <Footer />

    </div>
  )
}
export default Layout;