import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    clear: 'both',
    padding: theme.spacing(4, 0, 4, 0),
  }
}));

const TextContents = (props) => {

  const classes = useStyles();

  return (
    <section className={`${classes.root}`}>

      <Box display="block" variant="body2" component="article">
        {props.children}
      </Box>
    </section>
  );
}

export default TextContents;
