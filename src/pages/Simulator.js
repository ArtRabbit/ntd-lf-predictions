import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { Layout } from '../layout'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'

import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Tooltip from '@material-ui/core/Tooltip'
import Slider from '@material-ui/core/Slider'

import HeadWithInputs from './components/HeadWithInputs'
import DiveDeeper from './components/DiveDeeper'

import * as SimulatorEngine from './components/simulator/SimulatorEngine'
SimulatorEngine.simControler.documentReady()

const useStyles = makeStyles(theme => ({
  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    marginBottom: 10,
  },
  formControl: {
    margin: theme.spacing(0, 0, 5, 0),
    minWidth: '100%',
    '& > label': {},
  },
  contentLeftColumn: {},
  contentRightColumn: {},
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}))

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

const Simulator = props => {
  const classes = useStyles()

  const [simParams, setSimParams] = useState({
    // ...SimulatorEngine.params, // default params
    ...SimulatorEngine.simControler.params, // params editable via UI
  })

  const [simInProgress, setSimInProgress] = useState(false)
  const [tabLength, setTabLength] = useState(0)
  const [tabIndex, setTabIndex] = useState(0)
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue)
  }
  const handleInputChange = event => {
    setSimParams({ ...simParams, species: event.target.value })
  }
  const handleInputChange2 = event => {
    setSimParams({ ...simParams, mdaSixMonths: event.target.value })
  }
  useEffect(() => {
    //    console.log('tab updated', tabIndex)
    //    console.log(scenarioInputs[tabIndex])
    if (typeof scenarioInputs[tabIndex] != 'undefined') {
      // set input arams if you have them
      setSimParams(scenarioInputs[tabIndex])
    }
  }, [tabIndex])

  const handleCoverageChange = (event, newValue) => {
    // this used to be a special occastion. If nothing changes we can use the handleSlerChanges handler instead.
    setSimParams({
      ...simParams,
      coverage: newValue, // / 100
    })
  }
  const handleSliderChanges = (newValue, paramPropertyName) => {
    let newObject = {}
    newObject[paramPropertyName] = newValue
    setSimParams({
      ...simParams,
      ...newObject,
    })
  }
  const [simulationProgress, setSimulationProgress] = useState(0)
  const [scenarioInputs, setScenarioInputs] = useState([])
  const [scenarioResults, setScenarioResults] = useState([])
  const simulatorCallback = (resultObject, newScenario) => {
    if (typeof resultObject == 'number') {
      setSimulationProgress(resultObject)
    } else {
      console.log('Simulation returned results!')

      if (typeof scenarioResults[tabIndex] === 'undefined') {
        // console.log('scenarioResults')
        setScenarioResults([...scenarioResults, JSON.parse(resultObject)])
        setScenarioInputs([
          ...scenarioInputs,
          JSON.parse(resultObject).params.inputs,
        ])
      } else {
        //        console.log('tabIndex', tabIndex)
        //        console.log('newScenario', newScenario)
        let correctTabIndex = newScenario === true ? tabIndex + 1 : tabIndex
        // let correctTabIndex = tabIndex + 1
        //        console.log('correctTabIndex', correctTabIndex)

        let scenarioResultsNew = [...scenarioResults] // 1. Make a shallow copy of the items
        let resultItem = scenarioResultsNew[correctTabIndex] // 2. Make a shallow copy of the resultItem you want to mutate
        resultItem = JSON.parse(resultObject) // 3. Replace the property you're intested in
        scenarioResultsNew[correctTabIndex] = resultItem // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        setScenarioResults(scenarioResultsNew) // 5. Set the state to our new copy

        let scenarioInputsNew = [...scenarioInputs]
        let inputsItem = scenarioInputsNew[correctTabIndex]
        inputsItem = JSON.parse(resultObject).params.inputs
        scenarioInputsNew[correctTabIndex] = inputsItem
        setScenarioInputs(scenarioInputsNew)
      }
      setSimInProgress(false)
    }
  }
  useEffect(() => {
    console.log('scenarioInputs', scenarioInputs)
  }, [scenarioInputs])
  const runCurrentScenario = () => {
    if (!simInProgress) {
      setSimInProgress(true)
      console.log(tabIndex, simParams)
      SimulatorEngine.simControler.newScenario = false
      SimulatorEngine.simControler.runScenario(simParams, simulatorCallback)
    }
  }
  const runNewScenario = () => {
    if (!simInProgress) {
      if (tabLength < 5) {
        setSimInProgress(true)
        // console.log('settingTabLength', tabLength + 1)
        setTabIndex(tabLength)
        setTabLength(tabLength + 1)
        console.log(tabIndex, simParams)
        SimulatorEngine.simControler.newScenario = true
        SimulatorEngine.simControler.runScenario(simParams, simulatorCallback)
      } else {
        alert('Sorry maximum number of Scenarios is 5.')
      }
    }
  }
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const basePrevalance = urlParams.get('base_prev') // endemicity from URL
  useEffect(() => {
    if (basePrevalance)
      setSimParams({
        ...simParams,
        endemicity: parseInt(basePrevalance),
      })
  })
  return (
    <Layout>
      <HeadWithInputs
        transparent={true}
        disableInputs={true}
        title="Lympahtic filariasis Prevalence Simulator"
      />
      {/*       {props.location.search}
      {window.location.search} */}

      <Grid container spacing={4}>
        <Grid item md={6} xs={12} className={classes.contentLeftColumn}>
          <Typography className={classes.title} variant="h5" component="h2">
            Prevalence over time
          </Typography>

          <div className={classes.tavs}>
            <AppBar position="static">
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                aria-label="simple tabs example"
              >
                <Tab label="Scenario 1" {...a11yProps(0)} />
                {tabLength > 1 && <Tab label="Scenario 2" {...a11yProps(1)} />}
                {tabLength > 2 && <Tab label="Scenario 3" {...a11yProps(2)} />}
                {tabLength > 3 && <Tab label="Scenario 4" {...a11yProps(3)} />}
                {tabLength > 4 && <Tab label="Scenario 5" {...a11yProps(4)} />}
              </Tabs>
            </AppBar>
            <TabPanel value={tabIndex} index={0}>
              Scenario 1
              <div style={{ overflow: 'hidden', height: '400px' }}>
                {JSON.stringify(scenarioResults[0])}
              </div>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              Scenario 2
              <div style={{ overflow: 'hidden', height: '400px' }}>
                {JSON.stringify(scenarioResults[1])}
              </div>
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              Scenario 3
              <div style={{ overflow: 'hidden', height: '400px' }}>
                {JSON.stringify(scenarioResults[2])}
              </div>
            </TabPanel>
            <TabPanel value={tabIndex} index={3}>
              Scenario 4
              <div style={{ overflow: 'hidden', height: '400px' }}>
                {JSON.stringify(scenarioResults[3])}
              </div>
            </TabPanel>
            <TabPanel value={tabIndex} index={4}>
              Scenario 5
              <div style={{ overflow: 'hidden', height: '400px' }}>
                {JSON.stringify(scenarioResults[4])}
              </div>
            </TabPanel>
          </div>
        </Grid>
        <Grid item md={3} xs={12} className={classes.contentRightColumn}>
          <Typography className={classes.title} variant="h5" component="h2">
            Settings
          </Typography>
          <FormControl className={classes.formControl}>
            <Typography gutterBottom>Base prevalence</Typography>
            <InputLabel htmlFor="endemicity"></InputLabel>
            <Slider
              value={simParams.endemicity}
              id="endemicity"
              min={1}
              step={1}
              max={100}
              onChange={(event, newValue) => {
                handleSliderChanges(newValue, 'endemicity')
              }}
              valueLabelDisplay="auto"
              aria-labelledby="slider"
            />
            {/*             <p style={{ marginBottom: 0 }}>
              The mf prevalence in the population before intervention occurs.
              Due to the stochastic nature of the model this is a prevalence
              averaged over many independent runs and so should be treated as an
              approximation only.{' '}
            </p> */}
          </FormControl>
          <FormControl className={classes.formControl}>
            <Typography gutterBottom>Number of runs</Typography>
            <InputLabel htmlFor="runs"></InputLabel>
            <Slider
              value={simParams.runs}
              min={1}
              step={1}
              max={100}
              onChange={(event, newValue) => {
                handleSliderChanges(newValue, 'runs')
              }}
              valueLabelDisplay="auto"
              aria-labelledby="slider"
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-helper-label">
              Species
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={simParams.species}
              onChange={handleInputChange}
            >
              <MenuItem value={0}>Anopheles</MenuItem>
              <MenuItem value={1}>Culex</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <Typography gutterBottom>Vector: Bed Net Coverage (%)</Typography>
            <InputLabel htmlFor="covN"></InputLabel>
            <Slider
              value={simParams.covN}
              id="covN"
              min={1}
              step={1}
              max={100}
              onChange={(event, newValue) => {
                handleSliderChanges(newValue, 'covN')
              }}
              valueLabelDisplay="auto"
              aria-labelledby="slider"
            />
            {/*             <p style={{ marginBottom: 0 }}>
              Bed nets are assumed to have been distributed at the start of
              intervention and are assumed to be effective for the entire
              lifetime of the intervention campaign.
            </p> */}
          </FormControl>
          <FormControl className={classes.formControl}>
            <Typography gutterBottom>
              Vector: Insecticide Coverage (%)
            </Typography>
            <InputLabel htmlFor="v_to_hR"></InputLabel>
            <Slider
              value={simParams.v_to_hR}
              id="v_to_hR"
              min={1}
              step={1}
              max={100}
              onChange={(event, newValue) => {
                handleSliderChanges(newValue, 'v_to_hR')
              }}
              valueLabelDisplay="auto"
              aria-labelledby="slider"
            />
            {/*             <p style={{ marginBottom: 0 }}>
              Insecticide is assumed to reduce the vector to host ratio only.
            </p> */}
          </FormControl>
        </Grid>
        <Grid item md={3} xs={12} className={classes.contentRightColumn}>
          <Typography className={classes.title} variant="h5" component="h2">
            Intervention
          </Typography>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-helper-label">
              Fruequency
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={simParams.mdaSixMonths}
              onChange={handleInputChange2}
            >
              <MenuItem value={12}>Annual</MenuItem>
              <MenuItem value={6}>Every 6 months</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <Typography gutterBottom>Target coverage</Typography>
            <InputLabel htmlFor="coverage"></InputLabel>
            <Slider
              value={simParams.coverage}
              min={0}
              step={1}
              max={100}
              onChange={handleCoverageChange}
              valueLabelDisplay="auto"
              aria-labelledby="slider"
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="demo-simple-select-helper-label">
              Drug regimen
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={simParams.mdaRegimen}
              onChange={event => {
                setSimParams({ ...simParams, mdaRegimen: event.target.value })
              }}
            >
              <MenuItem value={1}>albendazole + ivermectin</MenuItem>
              <MenuItem value={2}>albendazole + diethylcarbamazine</MenuItem>
              <MenuItem value={3}>ivermectin</MenuItem>
              <MenuItem value={4}>
                ivermectin + albendazole + diethylcarbamazine
              </MenuItem>
              <MenuItem value={5}>custom</MenuItem>
            </Select>
          </FormControl>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              disabled={simInProgress || scenarioInputs.length === 0}
              onClick={runCurrentScenario}
            >
              UPDATE SCENARIO
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={simInProgress}
              onClick={runNewScenario}
            >
              NEW SCENARIO
            </Button>
          </div>
          {simulationProgress !== 0 && simulationProgress !== 100 && (
            <p style={{ textAlign: 'center' }}>{simulationProgress}%</p>
          )}
        </Grid>
      </Grid>
      <Grid item md={6} xs={12} className={classes.contentRightColumn}>
        <FormControl className={classes.formControl}>
          <Typography gutterBottom>Systemic adherence</Typography>
          <InputLabel htmlFor="rho"></InputLabel>
          <Slider
            value={simParams.rho}
            min={1}
            step={1}
            max={100}
            onChange={(event, newValue) => {
              handleSliderChanges(newValue, 'rho')
            }}
            valueLabelDisplay="auto"
            aria-labelledby="slider"
          />
          {/*             <p style={{ marginBottom: 0 }}>
              Controls how randomly coverage is applied. For 0, coverage is
              completely random. For 1, the same individuals are always treated.
            </p> */}
        </FormControl>
      </Grid>

      <DiveDeeper
        title="Get an overview"
        links={[
          { to: '/hotspots', name: 'TRENDS FOR ALL COUNTRIES' },
          { to: '/country', name: 'PROBLEM AREAS FOR ALL COUNTRIES' },
        ]}
      />
    </Layout>
  )
}
export default Simulator
