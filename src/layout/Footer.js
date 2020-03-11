import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => ({
    footer: {
        padding: theme.spacing(3, 2),
        marginTop: 'auto',
        backgroundColor: theme.palette.grey[800],
    },
}));

const Footer = (props) => {

    const classes = useStyles();

    return (
        <footer className={classes.footer}>
            <Container maxWidth="xl">
                <Typography variant="body1">Footer</Typography>
            </Container>
        </footer>
    )
}
export default Footer;
