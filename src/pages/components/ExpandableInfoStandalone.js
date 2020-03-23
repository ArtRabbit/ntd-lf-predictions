import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core'
import ExpandableInfo from './ExpandableInfo'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 0),
  },
  rightCol: {
    position: 'relative',
  },

}));

const ExpandableInfoStandalone = ({ title, children }) => {
  const classes = useStyles();

  return (
    <Grid container direction="row-reverse" spacing={0} className={classes.root}>
      <Grid item md={6} xs={12} className={classes.rightCol}>
        <ExpandableInfo title={title} standalone={true}>
          {children}
        </ExpandableInfo>
      </Grid>
    </Grid>
  );
}
export default ExpandableInfoStandalone;
