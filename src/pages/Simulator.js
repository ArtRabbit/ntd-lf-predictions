import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { Layout } from '../layout'
import { makeStyles } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles';
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import Button from '@material-ui/core/Button'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'

import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import Slider from '@material-ui/core/Slider'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import HeadWithInputs from './components/HeadWithInputs'
import DiveDeeper from './components/DiveDeeper'
import SectionTitle from './components/SectionTitle'
import ChartSettings from './components/ChartSettings'
import CloseButton from './components/CloseButton';

import * as SimulatorEngine from './components/simulator/SimulatorEngine'

import imgRandom from '../images/sa-random.svg'
import imgSame from '../images/sa-same.svg'
import imgAnopheles from '../images/Anopheles.jpg'
import imgCulex from '../images/Culex.jpg'
import imgArrow from '../images/popuparrow.png'

SimulatorEngine.simControler.documentReady()

const useStyles = makeStyles(theme => ({
  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    marginBottom: 24,
  },
  formControl: {
    margin: theme.spacing(0, 0, 3, 0),
    minWidth: '100%',
    '& > label': {},
  },
  formControlSelect: {
    margin: theme.spacing(0, 0, 3, 0),
  },
  contentLeftColumn: {},
  settings: {
    padding: theme.spacing(2, 4, 1, 2),
    backgroundColor: theme.palette.secondary.light,
  },
  settingsBody: {
    padding: theme.spacing(4, 0),
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      margin: theme.spacing(1, 0),
    },
  },
  simulator: {
    width: `calc(100% + ${theme.spacing(12)}px)`,
    marginLeft: -theme.spacing(6),
    position: 'relative'
  },
  tabs: {
    padding: theme.spacing(0, 6),
  },
  chartContainer: {
    position: 'relative',
    width: '100%',
  },
  progress: {
    width: '100%',
    '& > *': {
      margin: theme.spacing(2, 0),
    },
  },
  withSlider: {
    margin: theme.spacing(0, 0, 6, 0),
    whiteSpace: 'nowrap',
  },
  modalButton: {
    width: '50%',
    //borderTopLeftRadius: 0,
    //borderTopRightRadius: 0,
    borderRadius: 0,
  },
  roundModal: {
    padding: theme.spacing(3, 3, 0, 3),
    borderRadius: 0,
    width: 310,
    position: 'absolute',
    bottom: 50,
    left: 0,
    '&::after': {
      content: `''`,
      position: 'absolute',
      left: '50%',
      width: 55,
      height: 29,
      bottom: -29,
      backgroundImage: `url(${imgArrow})`,
      backgroundPosition: 'center top',
      backgroundSize: '55px 29px',
      backgroundRepeat: 'no-repeat',
      transform: 'translate(-50%, 0%)',
      /*
      bottom: '-2rem',
      transform: 'translate(-50%, 0%)',
      width: '0',
      height: '0',
      border: '1rem solid transparent',
      borderTopColor: '#fff',
      boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
      */
    },
  },
  modalButtons: {
    display: 'flex',
    flexDirection: 'row',
    margin: theme.spacing(0, 0, 0, -3),
    width: `calc(100% + ${theme.spacing(6)}px)`,
  },
  adherence: {
    height: 110,
    width: '100%',
    position: 'relative',
    '&:after, &:before': {
      content: `''`,
      position: 'absolute',
      top: 0,
      width: 72,
      height: 72,
    },
    '&:before': {
      left: 0,
      backgroundImage: `url(${imgRandom})`,
      backgroundPosition: 'left center',
      backgroundSize: 'auto',
      backgroundRepeat: 'no-repeat',
    },
    '&:after': {
      right: 0,
      backgroundImage: `url(${imgSame})`,
      backgroundPosition: 'right center',
      backgroundSize: 'auto',
      backgroundRepeat: 'no-repeat',
    },
  },

  imageOptions: {
    paddingTop: theme.spacing(2),
  },
  imageOption: {
    paddingTop: 74,
    minWidth: 120,
    marginRight: theme.spacing(1),
    '&.anopheles': {
      backgroundImage: `url(${imgAnopheles})`,
      backgroundPosition: '14px top',
      backgroundSize: '112px 74px',
      backgroundRepeat: 'no-repeat',
    },
    '&.culex': {
      backgroundImage: `url(${imgCulex})`,
      backgroundPosition: '14px top',
      backgroundSize: '112px 74px',
      backgroundRepeat: 'no-repeat',
      marginRight: 0,
    },
    '& .MuiFormControlLabel-label': {
      fontSize: '1rem',
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
  const theme = useTheme();

  const [simParams, setSimParams] = useState({
    ...SimulatorEngine.simControler.params, // params editable via UI
  })

  /* MDA object */
  useEffect(() => {
    // handleFrequencyChange()
    populateMDA()
  }, [simParams.mdaSixMonths])
  const populateMDA = () => {
    var MDAtime = []
    for (var i = 0; i < (12 / simParams.mdaSixMonths) * 20; i++) {
      MDAtime.push(
        (simParams.mdaSixMonths / 12) * 12 +
        (simParams.mdaSixMonths / 12) * 12 * i
      )
    }
    setSimMDAtime([...MDAtime])
    // SimulatorEngine.simControler.mdaObj.time = [...MDAtime]
    var MDAcoverage = []
    for (var i = 0; i < (12 / simParams.mdaSixMonths) * 20; i++) {
      MDAcoverage.push(simParams.coverage)
    }
    setSimMDAcoverage([...MDAcoverage])

    var MDAadherence = []
    for (var i = 0; i < (12 / simParams.mdaSixMonths) * 20; i++) {
      MDAadherence.push(simParams.rho)
    }
    setSimMDAadherence([...MDAadherence])

    // console.log(SimulatorEngine.simControler.mdaObj)
  }
  const [curMDARound, setCurMDARound] = useState(-1)
  const [simMDAtime, setSimMDAtime] = useState([])
  const [simMDAcoverage, setSimMDAcoverage] = useState([])
  const [simMDAadherence, setSimMDAadherence] = useState([])
  useEffect(() => {
    // console.log(simMDAtime, simMDAcoverage, simMDAadherence)
    SimulatorEngine.simControler.mdaObj.time = [...simMDAtime]
    SimulatorEngine.simControler.mdaObj.coverage = [...simMDAcoverage]
    SimulatorEngine.simControler.mdaObj.adherence = [...simMDAadherence]
  }, [simMDAtime, simMDAcoverage, simMDAadherence])

  /* Simuilation, tabs etc */
  const [simInProgress, setSimInProgress] = useState(false)
  const [tabLength, setTabLength] = useState(0)
  const [tabIndex, setTabIndex] = useState(0)
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue)
  }
  useEffect(() => {
    //    console.log('tab updated', tabIndex)
    //    console.log(scenarioInputs[tabIndex])
    if (typeof scenarioInputs[tabIndex] != 'undefined') {
      // set input arams if you have them
      setSimParams(scenarioInputs[tabIndex])
      setSimMDAtime(scenarioMDAs[tabIndex].time)
      setSimMDAcoverage(scenarioMDAs[tabIndex].coverage)
      setSimMDAadherence(scenarioMDAs[tabIndex].adherence)
    }
  }, [tabIndex])

  const handleCoverageChange = (event, newValue) => {
    // this used to be a special occastion. If nothing changes we can use the handleSlerChanges handler instead.
    setSimParams({
      ...simParams,
      coverage: newValue, // / 100
    })
  }
  const handleFrequencyChange = event => {
    setDoseSettingsOpen(false)
    setSimParams({ ...simParams, mdaSixMonths: event.target.value })
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
  const [scenarioMDAs, setScenarioMDAs] = useState([])
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
        setScenarioMDAs([
          ...scenarioMDAs,
          {
            time: [...simMDAtime],
            coverage: [...simMDAcoverage],
            adherence: [...simMDAadherence],
          },
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

        let scenarioMDAsNew = [...scenarioMDAs]
        let MDAsItem = scenarioMDAsNew[correctTabIndex]
        MDAsItem = {
          time: [...simMDAtime],
          coverage: [...simMDAcoverage],
          adherence: [...simMDAadherence],
        }
        scenarioMDAsNew[correctTabIndex] = MDAsItem

        setScenarioMDAs(scenarioMDAsNew)
      }
      setSimInProgress(false)
    }
  }
  /*   useEffect(() => {
    console.log('scenarioInputs', scenarioInputs)
  }, [scenarioInputs]) */
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
    // console.log(simParams)
  }, [basePrevalance])
  const [doseSettingsOpen, setDoseSettingsOpen] = useState(false)
  const [doseSettingsLeft, setDoseSettingsLeft] = useState(0)

  const closeRoundModal = event => {
    setDoseSettingsOpen(false)
    setCurMDARound(-1)
  }

  return (
    <Layout>
      <HeadWithInputs
        transparent={true}
        disableInputs={true}
        title="Lympahtic filariasis Prevalence Simulator"
      />
      {/*       {props.location.search}
      {window.location.search} */}

      <SectionTitle
        top={true}
        headline="Available scenarios"
        text={`Create your own scenarios and compare them to our baseline`}
        fullwidth={true}
      />
      <section className={classes.simulator}>
        <Grid container spacing={0}>
          <Grid item xs={12} className={classes.tabs}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              aria-label="Available scenarios"
              indicatorColor="secondary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Scenario 1" {...a11yProps(0)} />
              <Tab label="Scenario 2" {...a11yProps(1)} />
              <Tab label="Scenario 3" {...a11yProps(2)} />
              {tabLength > 3 && <Tab label="Scenario 4" {...a11yProps(3)} />}
              {tabLength > 4 && <Tab label="Scenario 5" {...a11yProps(4)} />}
            </Tabs>
          </Grid>

          <Grid item md={9} xs={12} className={classes.chartContainer}>
            <div className={classes.tavs}>
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

            <ChartSettings
              title="Settings"
              buttonText="Update Scenario"
              action={runCurrentScenario}
              onOpen={closeRoundModal}
            >
              <FormControl fullWidth>
                <FormLabel
                  component="legend"
                  htmlFor="endemicity"
                  className={classes.withSlider}
                >
                  Base prevalence
                </FormLabel>
                <Slider
                  value={simParams.endemicity}
                  id="endemicity"
                  min={1}
                  step={1}
                  max={100}
                  onChange={(event, newValue) => {
                    handleSliderChanges(newValue, 'endemicity')
                  }}
                  aria-labelledby="slider"
                  marks={[
                    { value: 0, label: '0' },
                    { value: 100, label: '100' },
                  ]}
                  valueLabelDisplay="on"
                />
                {/*             <p style={{ marginBottom: 0 }}>
              The mf prevalence in the population before intervention occurs.
              Due to the stochastic nature of the model this is a prevalence
              averaged over many independent runs and so should be treated as an
              approximation only.{' '}
            </p> */}
              </FormControl>
              <FormControl fullWidth>
                <FormLabel
                  component="legend"
                  htmlFor="runs"
                  className={classes.withSlider}
                >
                  Number of runs
                </FormLabel>
                <Slider
                  value={simParams.runs}
                  min={1}
                  step={1}
                  max={100}
                  onChange={(event, newValue) => {
                    handleSliderChanges(newValue, 'runs')
                  }}
                  aria-labelledby="slider"
                  marks={[
                    { value: 0, label: '0' },
                    { value: 100, label: '100' },
                  ]}
                  valueLabelDisplay="on"
                />
              </FormControl>
              <FormControl fullWidth className={classes.formControlSelect}>
                <FormLabel component="legend">Type of mosquito</FormLabel>
                <RadioGroup
                  className={classes.imageOptions}
                  row
                  aria-label="Species"
                  name="species"
                  value={simParams.species}
                  onChange={event => {
                    setSimParams({
                      ...simParams,
                      species: Number(event.target.value),
                    })
                  }}
                >
                  <FormControlLabel
                    className={`${classes.imageOption} anopheles`}
                    value={0}
                    control={<Radio color="primary" />}
                    label="Anopheles"
                  />
                  <FormControlLabel
                    className={`${classes.imageOption} culex`}
                    value={1}
                    control={<Radio color="primary" />}
                    label="Culex"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl fullWidth>
                <FormLabel
                  component="legend"
                  htmlFor="covN"
                  className={classes.withSlider}
                >
                  Vector: Bed Net Coverage (%)
                </FormLabel>
                <Slider
                  value={simParams.covN}
                  id="covN"
                  min={1}
                  step={1}
                  max={100}
                  onChange={(event, newValue) => {
                    handleSliderChanges(newValue, 'covN')
                  }}
                  aria-labelledby="slider"
                  marks={[
                    { value: 0, label: '0' },
                    { value: 100, label: '100' },
                  ]}
                  valueLabelDisplay="on"
                />
                {/*             <p style={{ marginBottom: 0 }}>
              Bed nets are assumed to have been distributed at the start of
              intervention and are assumed to be effective for the entire
              lifetime of the intervention campaign.
            </p> */}
              </FormControl>
              <FormControl fullWidth>
                <FormLabel
                  component="legend"
                  htmlFor="v_to_hR"
                  className={classes.withSlider}
                >
                  Vector: Insecticide Coverage (%)
                </FormLabel>
                <Slider
                  value={simParams.v_to_hR}
                  id="v_to_hR"
                  min={1}
                  step={1}
                  max={100}
                  onChange={(event, newValue) => {
                    handleSliderChanges(newValue, 'v_to_hR')
                  }}
                  aria-labelledby="slider"
                  marks={[
                    { value: 0, label: '0' },
                    { value: 100, label: '100' },
                  ]}
                  valueLabelDisplay="on"
                />
                {/*             <p style={{ marginBottom: 0 }}>
              Insecticide is assumed to reduce the vector to host ratio only.
            </p> */}
              </FormControl>
            </ChartSettings>
          </Grid>
          <Grid item md={3} xs={12} className={classes.settings}>
            <Typography className={classes.title} variant="h3" component="h2">
              Intervention
            </Typography>
            <div className={classes.settingsBody}>
              <FormControl
                fullWidth
                variant="outlined"
                className={classes.formControl}
              >
                <FormLabel component="legend">Frequency</FormLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={simParams.mdaSixMonths}
                  onChange={handleFrequencyChange}
                >
                  <MenuItem value={12}>Annual</MenuItem>
                  <MenuItem value={6}>Every 6 months</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth className={classes.formControl}>
                <FormLabel
                  component="legend"
                  htmlFor="coverage"
                  className={classes.withSlider}
                >
                  Target coverage
                </FormLabel>
                <Slider
                  value={simParams.coverage}
                  min={0}
                  step={1}
                  max={100}
                  onChange={handleCoverageChange}
                  aria-labelledby="slider"
                  marks={[
                    { value: 0, label: '0' },
                    { value: 100, label: '100' },
                  ]}
                  valueLabelDisplay="on"
                />
              </FormControl>
              <FormControl
                fullWidth
                variant="outlined"
                className={classes.formControl}
              >
                <FormLabel
                  component="legend"
                  htmlFor="demo-simple-select-helper-label"
                >
                  Drug regimen
                </FormLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={simParams.mdaRegimen}
                  onChange={event => {
                    setSimParams({
                      ...simParams,
                      mdaRegimen: event.target.value,
                    })
                  }}
                >
                  <MenuItem value={1}>albendazole + ivermectin</MenuItem>
                  <MenuItem value={2}>
                    albendazole + diethylcarbamazine
                  </MenuItem>
                  <MenuItem value={3}>ivermectin</MenuItem>
                  <MenuItem value={4}>
                    ivermectin + albendazole + diethylcarbamazine
                  </MenuItem>
                  <MenuItem value={5}>custom</MenuItem>
                </Select>
              </FormControl>
            </div>
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
              <div className={classes.progress}>
                <LinearProgress
                  variant="determinate"
                  value={simulationProgress}
                  color="secondary"
                />
              </div>
            )}
          </Grid>
        </Grid>
        <Grid item md={12} xs={12}>
          <div
            style={{
              display: 'flex',
              height: 100,
              justifyContent: 'space-around',
              marginTop: 30,
              marginBottom: 20,
              cursor: 'hand',
            }}
          >
            {/* {(12 / simParams.mdaSixMonths) * 20} */}
            {simMDAtime.map((e, i) => (
              <div
                key={i}
                style={{
                  background: 'grey',
                  height: 100,
                  minWidth: 10,
                  borderWidth: 1,
                  borderColor: 'white',
                  borderStyle: 'solid',
                }}
                onMouseOver={a => {
                  // a.target.style.borderColor = '#aa2323'
                }}
                onMouseOut={a => {
                  // a.target.style.borderColor = 'white'
                }}
                onClick={a => {
                  // a.target.style.backgroundColor = '#aa2323'
                  setCurMDARound(i)
                  setDoseSettingsOpen(true)
                  setDoseSettingsLeft(
                    a.target.getBoundingClientRect().left +
                    a.target.offsetWidth / 2 -
                    155
                  )
                }}
                title={
                  simMDAtime[i] +
                  ', ' +
                  simMDAcoverage[i] +
                  ', ' +
                  simMDAadherence[i]
                }
              >
                <span
                  style={{
                    display: 'block',
                    background:
                      i === curMDARound ? '#aa2323' : 'rgb(98, 54, 255)',
                    height: simMDAcoverage[i],
                    minWidth: 10,
                  }}
                ></span>
              </div>
            ))}
          </div>
        </Grid>
        {doseSettingsOpen && (
          <ClickAwayListener onClickAway={closeRoundModal}>
            <Paper
              elevation={3}
              className={classes.roundModal}
              style={{ left: doseSettingsLeft }}
            >


              <CloseButton action={closeRoundModal} />

              <Typography className={classes.title} variant="h5" component="h4">
                MDA round #{curMDARound + 1}
              </Typography>
              <FormControl fullWidth className={classes.formControl}>
                <FormLabel
                  component="legend"
                  htmlFor="rho"
                  className={classes.withSlider}
                >
                  Coverage
              </FormLabel>
                <Slider
                  value={simMDAcoverage[curMDARound]}
                  min={1}
                  step={1}
                  max={100}
                  onChange={(event, newValue) => {
                    let newArray = [...simMDAcoverage]
                    newArray[curMDARound] = newValue
                    setSimMDAcoverage([...newArray])
                  }}
                  aria-labelledby="slider"
                  marks={[
                    { value: 0, label: '0' },
                    { value: 100, label: '100' },
                  ]}
                  valueLabelDisplay="on"
                />
                {/*             <p style={{ marginBottom: 0 }}>
              Controls how randomly coverage is applied. For 0, coverage is
              completely random. For 1, the same individuals are always treated.
            </p> */}
              </FormControl>
              <FormControl fullWidth className={classes.formControl}>
                <FormLabel
                  component="legend"
                  htmlFor="rho"
                  className={classes.withSlider}
                >
                  Systemic adherence
              </FormLabel>
                <Slider
                  value={simMDAadherence[curMDARound]}
                  min={0}
                  step={0.1}
                  max={1}
                  onChange={(event, newValue) => {
                    let newArray = [...simMDAadherence]
                    newArray[curMDARound] = newValue
                    setSimMDAadherence([...newArray])
                  }}
                  aria-labelledby="slider"
                  valueLabelDisplay="on"
                />
                <div className={classes.adherence}></div>
                {/*             <p style={{ marginBottom: 0 }}>
              Controls how randomly coverage is applied. For 0, coverage is
              completely random. For 1, the same individuals are always treated.
            </p> */}
              </FormControl>
              <div className={classes.modalButtons}>
                <Button
                  className={classes.modalButton}
                  variant="contained"
                  disabled={simInProgress}
                  onClick={() => {
                    let newArray = [...simMDAcoverage]
                    newArray[curMDARound] = 0
                    setSimMDAcoverage([...newArray])
                    setCurMDARound(-1)
                    setDoseSettingsOpen(false)
                  }}
                >
                  REMOVE
              </Button>
                <Button
                  className={classes.modalButton}
                  variant="contained"
                  color="primary"
                  disabled={simInProgress}
                  onClick={() => {
                    setCurMDARound(-1)
                    setDoseSettingsOpen(false)
                  }}
                >
                  UPDATE
              </Button>
              </div>
            </Paper>
          </ClickAwayListener>
        )}
      </section>

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
