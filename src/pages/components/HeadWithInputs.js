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
    },
    '&.no-clear': {
      '&:after': {
        display: 'none'
      }
    }
  },
  head: {
    textAlign: 'left',
    '&:after': {
      content: `''`,
      display: 'table',
      clear: 'both'
    },

    [theme.breakpoints.up('sm')]: {
    },
    [theme.breakpoints.up('md')]: {
      float: 'left',
      width: 420,
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
    },
    [theme.breakpoints.up('md')]: {
      float: 'right',
      padding: theme.spacing(0),
      width: 'calc(100% - 420px)',
    },
  },
}))

const HeadWithInputs = ({ title, text, subTitle, transparent, actionLabel, action, disableInputs, classAdd }) => {
  const classes = useStyles()
  classAdd = classAdd ? classAdd : '';

  return (
    <div className={`${classes.root} ${classAdd}`}>
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
          classAdd={classAdd}
        />
      </Grid>
    </div>
  )
}
export default HeadWithInputs
