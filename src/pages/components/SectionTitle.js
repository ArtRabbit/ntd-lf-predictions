import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ReadMore from './ReadMore'
import { Box, Typography, Grid } from '@material-ui/core'

import Arrow from '../../images/arrow-drop-down.svg';
import ArrowHover from '../../images/arrow-drop-down-hover.svg';

const useStyles = makeStyles(theme => ({

  container: {
    padding: theme.spacing(10, 0, 3, 0),
  },

  containerTop: {
    padding: theme.spacing(3, 0, 3, 0),
  },
  rightCol: {
    position: 'relative',
  },

}));

const SectionTitle = ({ children, headline, text, top }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={0} className={top ? `${classes.containerTop}` : `${classes.container}`}>
      <Grid item md={6} xs={12}>
        <Typography variant="h2" component="h2">
          {headline}
        </Typography>
        <ReadMore>
          <Typography variant="body1" component="div">
            {text}
          </Typography>
        </ReadMore>
      </Grid>
      <Grid item md={6} xs={12} className={classes.rightCol}>
        {children}
      </Grid>
    </Grid>
  );
}
export default SectionTitle;
