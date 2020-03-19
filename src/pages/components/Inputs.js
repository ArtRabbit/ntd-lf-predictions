import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { flow, values, map, sortBy, pick } from 'lodash/fp'

import Box from '@material-ui/core/Box'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Tooltip from '@material-ui/core/Tooltip'

import { useCountryData } from '../../hooks/useData'

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: 9,
    position: 'relative',
  },
  formControl: {
    margin: theme.spacing(0, 1),
    minWidth: 220,
    textAlign: 'left',
    '& > label': {},
  },
  largeTooltip: {
    width: '100%',
    maxWidth: 345,
    minWidth: 320,
    background: theme.palette.error.main,
    color: 'white',
    padding: theme.spacing(2),
    position: 'absolute',
    top: '5rem',
    left: '50%',
    transform: 'translate(-50%, 0%)',
    textAlign: 'center',
    '&::after': {
      content: `''`,
      position: 'absolute',
      left: '50%',
      top: '-2rem',
      transform: 'translate(-50%, 0%)',
      width: '0',
      height: '0',
      border: '1rem solid transparent',
      borderBottomColor: theme.palette.error.main,
    },
  },
}))

const Inputs = props => {
  const classes = useStyles()
  const [regime, setRegime] = useState(10)

  const handleChange = event => {
    setRegime(event.target.value)
  }

  const { data } = useCountryData()
  const countries = flow(
    values,
    map(x => pick(['id', 'name'])(x)),
    sortBy('name')
  )(data)

  return (
    <Box className={classes.root}>
      <FormControl className={classes.formControl}>
        <Autocomplete
          id="combo-box-demo"
          options={countries}
          getOptionLabel={option => option.name}
          style={{ width: 300 }}
          renderInput={params => (
            <TextField {...params} label="View - Countries" />
          )}
        />
        <FormHelperText>Some important helper text</FormHelperText>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-helper-label">
          Treatment regime
        </InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={regime}
          onChange={handleChange}
        >
          <MenuItem value={10}>WHO guidelines</MenuItem>
          <MenuItem value={20}>WHO guidelines 2</MenuItem>
          <MenuItem value={30}>WHO guidelines 3</MenuItem>
        </Select>
        <div className={classes.largeTooltip}>
          <Typography variant="subtitle2" color="inherit" component="p">
            See how other treatement regimes can save lives
          </Typography>
        </div>
      </FormControl>
    </Box>
  )
}
export default Inputs
