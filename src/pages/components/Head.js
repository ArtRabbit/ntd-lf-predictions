import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';

import Logo from '../../images/ntd-logo.svg';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 475,
        zIndex: 9,
        position: "relative",
        float: 'left'

    },
    transparent: {
        background: 'transparent',
        boxShadow: 'none',
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

const Head = ({ title, text, subTitle, transparent, actionLabel, action }) => {

    const classes = useStyles();

    return (
        <Box className={`${classes.card} ${transparent ? classes.transparent : ''}`}>


            <NavLink to='/' className={classes.logo}>
                <span>NTD Modelling Consortium</span>
            </NavLink>

            <Typography className={classes.title} variant="h4" component="h1">{title}</Typography>

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
