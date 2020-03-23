import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { match, useRouteMatch } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import { useDataAPI, useUIState } from '../../hooks/stateHooks'
import { useHistory } from 'react-router-dom'

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
    textAlign: 'left',
    background: theme.palette.primary.main,
    color: 'white',
    padding: theme.spacing(2),
    position: 'absolute',
    top: '5rem',
    left: '50%',
    transform: 'translate(-50%, 0%)',
    '&::after': {
      content: `''`,
      position: 'absolute',
      left: '30%',
      top: '-2rem',
      transform: 'translate(-50%, 0%)',
      width: '0',
      height: '0',
      border: '1rem solid transparent',
      borderBottomColor: theme.palette.primary.main,
    },
  },
}))

const Inputs = props => {
  const classes = useStyles()

  const { countrySuggestions, regimes } = useDataAPI()
  const { regime, setRegime, country } = useUIState()
  const history = useHistory()
  const matchSection = useRouteMatch('/:section')

  const handleCountryChange = (event, value) => {

    if (matchSection) {
      let { section } = matchSection.params
      // country has been selected // are we already on a page that can show country data
      if ( section !== 'trends' && section !== 'hotspots' ) {
        section = 'trends'
      }
      if (value) {
        history.push({ pathname: `/${section}/${value.id}` })
        // country has been deselected
      } else {
        history.push({ pathname: `/${section}` })
      }
    }
  }

  const selected = countrySuggestions.find(x => x.id === country)

  return (
    <Box className={classes.root}>
      <FormControl className={classes.formControl}>
        <Autocomplete
          id="combo-box-demo"
          options={countrySuggestions}
          getOptionLabel={option => option.name}
          style={{ width: 300 }}
          value={selected ?? { name: 'All countries' }}
          renderInput={params => (
            <TextField {...params} label="View" />
          )}
          onChange={handleCountryChange}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-helper-label">{regime}</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={regime}
          onChange={setRegime}
        >
          {regimes.map(r => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </Select>
        <div className={classes.largeTooltip}>
          <Typography color="inherit" component="p">
            See how other treatement regimes can save lives
          </Typography>
        </div>
      </FormControl>
    </Box>
  )
}

export default observer(Inputs)
