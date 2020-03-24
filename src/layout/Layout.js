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
    '&.violet': {
      backgroundImage: 'linear-gradient(to bottom, #ebe1ff, #d4cdef)',
    }
  },
  main: {
    //paddingTop: theme.spacing(4),
    padding: theme.spacing(4, 6),
    flex: 2,
    position: 'relative',

  },
}));

const Layout = (props) => {

  const classes = useStyles();
  const classAdd = props.classAdd ? props.classAdd : '';

  return (
    <div className={`${classes.root} ${classAdd}`}>

      <Header />

      <Container component="main" className={classes.main} maxWidth="xl">
        {props.children}
      </Container>

      <Footer />

    </div>
  )
}
export default Layout;