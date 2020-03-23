import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import Head from './Head'
import Inputs from './Inputs'

const useStyles = makeStyles(theme => ({
  root: {
    '&:after': {
      content: `''`,
      display: 'table',
      clear: 'both'
    }
  },
  head: {
    textAlign: 'left',
    [theme.breakpoints.up('sm')]: {
      float: 'left',
    },
    [theme.breakpoints.up('md')]: {
      width: '50%',
    },
  },
  inputs: {
    textAlign: 'right',
    padding: theme.spacing(0, 0, 18, 0),
    minWidth: 300,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 0, 6, 0),
    },
    [theme.breakpoints.up('sm')]: {
      float: 'right',
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(0),
      width: '50%',
    },
  },
}))

const HeadWithInputs = ({ title, text, subTitle, transparent, actionLabel, action, disableInputs }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Grid item md={6} xs={12} className={classes.inputs}>
        {disableInputs !== true && <Inputs />}
      </Grid>
      <Grid item md={6} xs={12} className={classes.head}>
        <Head
          transparent={transparent}
          title={title}
          text={text}
          subTitle={subTitle}
          actionLabel={actionLabel}
          action={action}
        />
      </Grid>
    </div>
  )
}
export default HeadWithInputs
