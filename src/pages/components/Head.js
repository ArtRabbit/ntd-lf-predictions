import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';

import Logo from '../../images/ntd-logo.svg';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 475,
        padding: theme.spacing(2),/*
        position: 'absolute',
        top: theme.spacing(3),
        left: theme.spacing(3),*/
        zIndex: 9,
        position: "relative",
        float: 'left'

    },
    transparent: {
        background: 'transparent',
        boxShadow: 'none',
        padding: theme.spacing(2, 0)
    },
    cardContent: {
        padding: theme.spacing(2),

    },
    cardContentTransparent: {
        padding: theme.spacing(2, 0)

    },
    logo: {
        display: 'block',
        backgroundImage: `url(${Logo})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: 228,
        height: 50,
        '& > span': {
            display: 'none'
        }
    },
    title: {
        marginBottom: 10
    },
    subTitle: {
        marginBottom: 10
    },
}));

const Head = ({ title, text, subTitle, transparent, actionLabel, action }) => {

    const classes = useStyles();

    return (
        <Card className={`${classes.card} ${transparent ? classes.transparent : ''}`}>

            <CardContent className={`${classes.cardContent} ${transparent ? classes.cardContentTransparent : ''}`}>

                <NavLink to='/' className={classes.logo}>
                    <span>NTD Modelling Consortium</span>
                </NavLink>

                <Typography className={classes.title} variant="h4" component="h1">{title}</Typography>

                {subTitle && <Typography className={classes.subTitle} variant="h6" component="h2">{subTitle}</Typography>}

                {text && <Typography variant="body2" component="p">{text}</Typography>}

            </CardContent>

            {actionLabel &&
                <CardActions>
                    <Button onClick={(event) => action(event)} onKeyDown={(event) => action(event)} variant="contained" color="primary">{actionLabel}</Button>
                </CardActions>
            }
        </Card>
    )
}
export default Head;
