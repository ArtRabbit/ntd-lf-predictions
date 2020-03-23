import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import Head from './Head'
import Inputs from './Inputs'

const useStyles = makeStyles(theme => ({
  headLeftColumn: {
    textAlign: 'left',
  },
  headRightColumn: {
    textAlign: 'right',
    padding: theme.spacing(0, 0, 0, 2),
  },
}))

const HeadWithInputs = ({ title, text, subTitle, transparent, actionLabel, action, disableInputs }) => {
  const classes = useStyles()

  return (
    <Grid container spacing={0}>
      <Grid item md={5} xs={12} className={classes.headLeftColumn}>
        <Head
          transparent={transparent}
          title={title}
          text={text}
          subTitle={subTitle}
          actionLabel={actionLabel}
          action={action}
        />
      </Grid>
      <Grid item md={7} xs={12} className={classes.headRightColumn}>
        {disableInputs !== true && <Inputs />}
      </Grid>
    </Grid>
  )
}
export default HeadWithInputs
