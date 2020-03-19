import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Link as RouterLink } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    buttonGroup: {
        padding: theme.spacing(4, 0),
        minWidth: 220,
        float: 'left',
        '& > *': {
            margin: theme.spacing(0, 0, 1, 0),
            float: 'left',
            clear: 'both'
        },
    },
    buttonGroupTitle: {
        borderBottom: `1px solid ${theme.palette.primary.line}`,
        margin: theme.spacing(0, 0, 2, 0),
        width: '100%'
    }
}));

const Head = ({ title, links }) => {

    const classes = useStyles();

    return (
        <Box className={classes.buttonGroup}>

            <Typography className={classes.buttonGroupTitle} variant="h6" component="h3">{title}</Typography>

            {links.map((link, i) => {
                return (<Button
                    key={i}
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to={link.to}>
                    {link.name}
                </Button>)
            })}


        </Box>
    )
}
export default Head;
