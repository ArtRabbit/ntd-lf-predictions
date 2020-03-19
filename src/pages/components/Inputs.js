import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Tooltip from '@material-ui/core/Tooltip'

import { flow, pick, values, map, sortBy } from 'lodash/fp'
import { useCountryData } from '../../hooks/useData'

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: 9,
    position: 'relative',
  },
  formControl: {
    margin: theme.spacing(0, 1),
    minWidth: 120,
    '& > label': {},
  },
}))

const Inputs = props => {
  const classes = useStyles()
  const [regime, setRegime] = useState('')

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
        <InputLabel id="demo-simple-select-helper-label">Regime</InputLabel>
        <Tooltip title="See how other treatement regimes can save lives">
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
        </Tooltip>
      </FormControl>
    </Box>
  )
}
export default Inputs
