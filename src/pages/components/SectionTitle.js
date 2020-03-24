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

const SectionTitle = ({ children, headline, text, top, fullwidth }) => {
  const classes = useStyles();
  const width = fullwidth ? 12 : 6;
  const displayAll = text.length <= 80;

  return (
    <Grid container spacing={0} className={top ? `${classes.containerTop}` : `${classes.container}`}>
      <Grid item md={width} xs={12}>
        <Typography variant="h2" component="h2">
          {headline}
        </Typography>
        {!displayAll &&
          <ReadMore>
            <Typography variant="body1" component="div">
              {text}
            </Typography>
          </ReadMore>
        }
        {displayAll &&
          <Typography variant="body1" component="div">
            {text}
          </Typography>
        }
      </Grid>
      <Grid item md={width} xs={12} className={classes.rightCol}>
        {children}
      </Grid>
    </Grid>
  );
}
export default SectionTitle;
