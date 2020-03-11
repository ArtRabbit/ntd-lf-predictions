import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
}));

const Layout = (props) => {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            {props.children}
        </div>
    )
}
export default Layout;