import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { Layout } from '../layout'
import { makeStyles } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/styles'
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Paper,
  Slider,
  ClickAwayListener,
  Tooltip,
} from '@material-ui/core'

import HeadWithInputs from './components/HeadWithInputs'
import DiveDeeper from './components/DiveDeeper'
import SectionTitle from './components/SectionTitle'
import ChartSettings from './components/ChartSettings'
import CloseButton from './components/CloseButton'
import ConfirmationDialog from './components/ConfirmationDialog'

import * as SimulatorEngine from './components/simulator/SimulatorEngine'

import ScenarioGraph from '../components/ScenarioGraph'

import imgRandom from '../images/systemic-random.svg'
import imgSame from '../images/systemic-same.svg'
import imgAnopheles from '../images/Anopheles.jpg'
import imgCulex from '../images/Culex.jpg'
import imgInfoIcon from '../images/info-24-px.svg'

SimulatorEngine.simControler.documentReady()

const useStyles = makeStyles((theme) => ({
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
  formControlChart: {
    margin: theme.spacing(-2, 0, 0, 3),
  },
  contentLeftColumn: {},
  settings: {
    position: 'relative',
    padding: theme.spacing(4, 4, 8, 2),
    backgroundColor: theme.palette.secondary.light,
  },
  settingsBody: {
    padding: theme.spacing(4, 0),
  },
  simulatorBody: {
    position: 'relative',
    padding: theme.spacing(4, 2, 2, 6),
  },
  simulatorInnerBody: {
    position: 'relative',
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
    position: 'relative',
  },
  tabs: {
    padding: theme.spacing(0, 6),
    borderBottom: '1px solid #e0e0e0',
  },
  chartContainer: {
    position: 'relative',
    width: '100%',
    padding: 0,
  },
  chartTitle: {
    display: 'inline-block',
  },
  progress: {
    width: '100%',
    position: 'absolute',
    textAlign: 'center',
    bottom: theme.spacing(3),
    left: 0,
    fontSize: 0,
    '& > span': {
      margin: 0,
      fontSize: 12,
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    },
  },
  withSlider: {
    margin: theme.spacing(0, 0, 6, 0),
    whiteSpace: 'nowrap',
  },
  withHelp: {
    cursor: 'help',
    backgroundImage: `url(${imgInfoIcon})`,
    backgroundPosition: 'right center',
    backgroundSize: 'auto',
    backgroundRepeat: 'no-repeat',
    width: 'fit-content',
    paddingRight: 30,
    margin: theme.spacing(-1, 0, 5, 0),
    padding: theme.spacing(1, 0),
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
    left: '50%',
    bottom: 116,
    transform: 'translate(-50%, 0%)',
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
      width: 100,
      height: 100,
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
      backgroundSize: '100px',
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
      {value === index && <Box>{children}</Box>}
    </Typography>
  )
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

let countryLinks = []

const Simulator = (props) => {
  const classes = useStyles()
  const theme = useTheme()

  const [simParams, setSimParams] = useState({
    ...SimulatorEngine.simControler.params, // params editable via UI
  })
  const [editingMDAs, setEditingMDAs] = useState(false)
  /* MDA object */
  const populateMDA = () => {
    var MDAtime = []
    for (var i = 0; i < (12 / simParams.mdaSixMonths) * 20; i++) {
      MDAtime.push(
        (simParams.mdaSixMonths / 12) * 12 +
          (simParams.mdaSixMonths / 12) * 12 * i
      )
    }
    SimulatorEngine.simControler.mdaObj.time = [...MDAtime]
    SimulatorEngine.simControler.mdaObjOrig.time = [...MDAtime]

    var MDAcoverage = []
    for (var i = 0; i < (12 / simParams.mdaSixMonths) * 20; i++) {
      MDAcoverage.push(simParams.coverage)
    }
    SimulatorEngine.simControler.mdaObj.coverage = [...MDAcoverage]
    SimulatorEngine.simControler.mdaObjOrig.coverage = [...MDAcoverage]

    var MDAadherence = []
    for (var i = 0; i < (12 / simParams.mdaSixMonths) * 20; i++) {
      MDAadherence.push(simParams.rho)
    }
    SimulatorEngine.simControler.mdaObj.adherence = [...MDAadherence]
    SimulatorEngine.simControler.mdaObjOrig.adherence = [...MDAadherence]
    console.log(
      'SimulatorEngine.simControler.mdaObj',
      SimulatorEngine.simControler.mdaObj
    )
  }
  const populateMDAOnTheFly = () => {
    var MDAtime = []
    for (var i = 0; i < (12 / simParams.mdaSixMonths) * 20; i++) {
      MDAtime.push(
        (simParams.mdaSixMonths / 12) * 12 +
          (simParams.mdaSixMonths / 12) * 12 * i
      )
    }
    setSimMDAtime([...MDAtime])
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
  const [graphMetric, setGraphMetric] = useState('Ms')
  const [curMDARound, setCurMDARound] = useState(-1)
  const [simMDAtime, setSimMDAtime] = useState([])
  const [simMDAcoverage, setSimMDAcoverage] = useState([])
  const [simMDAadherence, setSimMDAadherence] = useState([])
  useEffect(() => {
    const zeroExistsAtThisPos = simMDAcoverage.indexOf(0)
    // console.log('zeroExistsAtThisPos', zeroExistsAtThisPos)

    if (zeroExistsAtThisPos > -1) {
      let newSimMDAcoverage = [...simMDAcoverage]
      let newSimMDAtime = [...simMDAtime]
      let newSimMDAadherence = [...simMDAadherence]
      for (let i = 0; newSimMDAcoverage.indexOf(0) > -1; i++) {
        newSimMDAtime.splice(newSimMDAcoverage.indexOf(0), 1)
        newSimMDAcoverage.splice(newSimMDAcoverage.indexOf(0), 1)
        newSimMDAadherence.splice(newSimMDAcoverage.indexOf(0), 1)
      }
      SimulatorEngine.simControler.mdaObj.time = [...newSimMDAtime]
      SimulatorEngine.simControler.mdaObj.coverage = [...newSimMDAcoverage]
      SimulatorEngine.simControler.mdaObj.adherence = [...newSimMDAadherence]
    } else {
      SimulatorEngine.simControler.mdaObj.time = [...simMDAtime]
      SimulatorEngine.simControler.mdaObj.coverage = [...simMDAcoverage]
      SimulatorEngine.simControler.mdaObj.adherence = [...simMDAadherence]
    }
    SimulatorEngine.simControler.mdaObjOrig.time = [...simMDAtime]
    SimulatorEngine.simControler.mdaObjOrig.coverage = [...simMDAcoverage]
    SimulatorEngine.simControler.mdaObjOrig.adherence = [...simMDAadherence]

    // console.log('MDA change', simMDAtime, simMDAcoverage, simMDAadherence)
    // console.log('mdaObjOrig', SimulatorEngine.simControler.mdaObjOrig)
  }, [simMDAtime, simMDAcoverage, simMDAadherence])

  // check for stale scenarios object in LS
  const LSSessionData = JSON.parse(window.localStorage.getItem('sessionData'))
  if (
    LSSessionData !== null &&
    LSSessionData.scenarios &&
    LSSessionData.scenarios[0] &&
    LSSessionData.scenarios[0].mda &&
    typeof LSSessionData.scenarios[0].mdaOrig === 'undefined'
  ) {
    // clear LS and relaod if stale project is found
    window.localStorage.removeItem('sessionData')
    window.localStorage.removeItem('scenarioIndex')
    console.log('reloading')
    window.location.reload()
  }

  /* Simuilation, tabs etc */
  const [simInProgress, setSimInProgress] = useState(false)
  // console.log(parseInt(window.localStorage.getItem('scenarioIndex')))
  // console.log(parseInt(window.localStorage.getItem('scenarioIndex')) + 1)
  // console.log(window.localStorage.getItem('sessionData'))
  const [tabLength, setTabLength] = useState(
    JSON.parse(window.localStorage.getItem('sessionData')) === null
      ? 0
      : JSON.parse(window.localStorage.getItem('sessionData')).scenarios.length
  )
  const [tabIndex, setTabIndex] = useState(
    JSON.parse(window.localStorage.getItem('scenarioIndex')) || 0
  )
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue)
  }
  useEffect(() => {
    //    console.log('tab updated', tabIndex)
    //    console.log(scenarioInputs[tabIndex])
    if (typeof scenarioInputs[tabIndex] != 'undefined') {
      // set input arams if you have them
      setSimParams(scenarioInputs[tabIndex])
      SimulatorEngine.ScenarioIndex.setIndex(tabIndex)
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
  const handleFrequencyChange = (event) => {
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
  const [scenarioResults, setScenarioResults] = useState(
    window.localStorage.getItem('sessionData')
      ? JSON.parse(window.localStorage.getItem('sessionData')).scenarios
      : []
  )
  const [scenarioMDAs, setScenarioMDAs] = useState([])
  const simulatorCallback = (resultObject, newScenario) => {
    if (typeof resultObject == 'number') {
      setSimulationProgress(resultObject)
    } else {
      console.log('Simulation returned results!')

      if (typeof scenarioResults[tabIndex] === 'undefined') {
        //console.log('scenarioResults',resultObject)
        setScenarioResults([...scenarioResults, JSON.parse(resultObject)])
        setScenarioInputs([
          ...scenarioInputs,
          JSON.parse(resultObject).params.inputs,
        ])
        setScenarioMDAs([
          ...scenarioMDAs,
          JSON.parse(resultObject).mdaOrig.time,
        ])
        setSimMDAtime([...JSON.parse(resultObject).mdaOrig.time])
        setSimMDAcoverage([...JSON.parse(resultObject).mdaOrig.coverage])
        setSimMDAadherence([...JSON.parse(resultObject).mdaOrig.adherence])
      } else {
        let correctTabIndex = newScenario === true ? tabIndex + 1 : tabIndex
        //console.log('scenarioResults',resultObject)
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
        const returnedMDAOrig = JSON.parse(resultObject)
        MDAsItem = {
          time: [...returnedMDAOrig.mdaOrig.time],
          coverage: [...returnedMDAOrig.mdaOrig.coverage],
          adherence: [...returnedMDAOrig.mdaOrig.adherence],
        }
        scenarioMDAsNew[correctTabIndex] = MDAsItem
        // console.log('ccc', correctTabIndex, scenarioMDAsNew)
        setScenarioMDAs(scenarioMDAsNew)

        setSimMDAtime([...JSON.parse(resultObject).mdaOrig.time])
        setSimMDAcoverage([...JSON.parse(resultObject).mdaOrig.coverage])
        setSimMDAadherence([...JSON.parse(resultObject).mdaOrig.adherence])
      }
      setSimInProgress(false)
      // console.log('newScenario', newScenario)
      if (newScenario === true) {
        setTabLength(tabLength + 1)
        setTabIndex(tabLength > 5 ? 4 : tabLength)
      }
    }
  }
  /*   useEffect(() => {
    console.log('scenarioInputs', scenarioInputs)
  }, [scenarioInputs]) */
  const runCurrentScenario = () => {
    if (!simInProgress) {
      setSimInProgress(true)
      //console.log(tabIndex, simParams)
      SimulatorEngine.simControler.newScenario = false
      SimulatorEngine.simControler.runScenario(
        simParams,
        tabIndex,
        simulatorCallback
      )
    }
  }

  const removeCurrentScenario = () => {
    if (!simInProgress) {
      // alert('todo')

      SimulatorEngine.SessionData.deleteScenario(tabIndex)
      //console.log(scenarioResults)
      //console.log(scenarioResults[tabIndex])

      let newScenarios = [...scenarioResults]
      newScenarios = newScenarios.filter(
        (item) => item !== scenarioResults[tabIndex]
      )
      setScenarioResults([...newScenarios])

      let newScenarioInputs = [...scenarioInputs]
      newScenarioInputs = newScenarioInputs.filter(
        (item) => item !== scenarioInputs[tabIndex]
      )
      setScenarioInputs([...newScenarioInputs])

      let newScenarioMDAs = [...scenarioMDAs]
      newScenarioMDAs = newScenarioMDAs.filter(
        (item) => item !== scenarioMDAs[tabIndex]
      )
      setScenarioMDAs(newScenarioMDAs)
      /*       setSimMDAtime(scenarioMDAs[tabIndex].time) // !!!!!!!!!! doesnt work because previous line hasn't happenned yet
      setSimMDAcoverage(scenarioMDAs[tabIndex].coverage)
      setSimMDAadherence(scenarioMDAs[tabIndex].adherence) */

      setTabLength(tabLength >= 1 ? tabLength - 1 : 0)
      setTabIndex(tabIndex >= 1 ? tabIndex - 1 : 0)
    }
  }

  // confirmation for remove scenario
  const [confirmatonOpen, setConfirmatonOpen] = useState(false)
  const confirmRemoveCurrentScenario = () => {
    if (!simInProgress) {
      setConfirmatonOpen(true)
    }
  }
  const confirmedRemoveCurrentScenario = () => {
    if (!simInProgress) {
      setConfirmatonOpen(false)
      removeCurrentScenario()
    }
  }

  const runNewScenario = () => {
    if (!simInProgress) {
      if (tabLength < 5) {
        populateMDA()
        setSimInProgress(true)
        // console.log('settingTabLength', tabLength + 1)
        //console.log(tabIndex, simParams)
        SimulatorEngine.simControler.newScenario = true
        SimulatorEngine.simControler.runScenario(
          simParams,
          tabLength,
          simulatorCallback
        )
        //        console.log(tabLength)
      } else {
        alert('Sorry maximum number of Scenarios is 5.')
      }
    }
  }
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const basePrevalance = urlParams.get('base_prev') // endemicity from URL
  const country = urlParams.get('country')

  useEffect(() => {
    if (basePrevalance)
      setSimParams({
        ...simParams,
        endemicity: parseInt(basePrevalance),
      })
    // console.log(simParams)
  }, [basePrevalance])

  useEffect(() => {
    if (country)
      countryLinks = [
        {
          to: '/trends/' + country,
          name:
            'TRENDS ' +
            (urlParams.get('name') ? urlParams.get('name') : country),
        },
        {
          to: '/hotspots/' + country,
          name:
            'HOTSPOTS ' +
            (urlParams.get('name') ? urlParams.get('name') : country),
        },
      ]
    //console.log(countryLinks)
  }, [country])
  const [doseSettingsOpen, setDoseSettingsOpen] = useState(false)

  const closeRoundModal = (event) => {
    setDoseSettingsOpen(false)
    setCurMDARound(-1)
  }

  useEffect(() => {
    if (typeof scenarioResults[tabIndex] === 'undefined') {
      console.log('No scenarios? Running a new one...')
      populateMDA()
      runNewScenario()
    }

    /* let sessionDataJson =
      JSON.parse(window.localStorage.getItem('scenarios')) || [] */
    let scenariosArray = JSON.parse(window.localStorage.getItem('sessionData'))
      ? JSON.parse(window.localStorage.getItem('sessionData')).scenarios
      : null
    // console.log('scenariosArray', scenariosArray)
    if (scenariosArray) {
      let paramsInputs = scenariosArray.map((item) => item.params.inputs)
      let MDAs = scenariosArray.map((item) => item.mdaOrig)
      setScenarioInputs(paramsInputs)
      if (typeof paramsInputs[tabIndex] != 'undefined') {
        // set input arams if you have them
        setSimParams(paramsInputs[tabIndex])
        setEditingMDAs(true)
        setScenarioMDAs(MDAs)
        setSimMDAtime(MDAs[tabIndex].time)
        setSimMDAcoverage(MDAs[tabIndex].coverage)
        setSimMDAadherence(MDAs[tabIndex].adherence)
      }
    }
  }, [])
  useEffect(() => {
    // console.log('editingMDAs', editingMDAs)
    if (scenarioResults[tabIndex]) {
      let calculNeeded =
        simParams.mdaSixMonths !==
          scenarioResults[tabIndex].params.inputs.mdaSixMonths ||
        simParams.coverage !== scenarioResults[tabIndex].params.inputs.coverage
      console.log(
        'Shall I re-calculate MDA rounds?',
        editingMDAs && calculNeeded
      )
      if (calculNeeded === true) {
        setEditingMDAs(true)
      }
      if (editingMDAs && calculNeeded) {
        populateMDAOnTheFly()
      }
    }
  }, [simParams.mdaSixMonths, simParams.coverage])

  /*   useEffect(() => {
    console.log('change of editingMDAs', editingMDAs)
  }, [editingMDAs]) */
  return (
    <Layout>
      <HeadWithInputs
        transparent={true}
        disableInputs={true}
        title="Lymphatic filariasis Simulator"
        text={`This simulator provides a way of assessing the impact of various interventions for a variety of backgrounds for Lymphatic filariasis transmission.`}
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
              {scenarioResults.map((result, i) => (
                <Tab
                  key={`tab-element-${i}`}
                  label={`Scenario ${i + 1}`}
                  {...a11yProps(i)}
                />
              ))}

              {tabLength < 5 && (
                <Tab
                  key={`tab-element-99`}
                  label={`+ Add one`}
                  disabled={simInProgress}
                  onClick={runNewScenario}
                ></Tab>
              )}
            </Tabs>
          </Grid>

          <Grid item md={9} xs={12} className={classes.chartContainer}>
            {scenarioResults.map((result, i) => (
              <TabPanel key={`scenario-result-${i}`} value={tabIndex} index={i}>
                <div className={classes.simulatorBody}>
                  <div className={classes.simulatorInnerBody}>
                    <Typography
                      className={classes.chartTitle}
                      variant="h3"
                      component="h2"
                    >
                      {`Scenario ${i + 1}`}
                    </Typography>

                    <FormControl
                      variant="outlined"
                      className={classes.formControlChart}
                    >
                      <Select
                        labelId="larvae-prevalence"
                        id="larvae-prevalence"
                        value={graphMetric}
                        onChange={(ev) => {
                          // console.log(ev.target.value)
                          setGraphMetric(ev.target.value)
                        }}
                      >
                        <MenuItem value={'Ms'}>
                          Prevalence mirofilerima
                        </MenuItem>
                        <MenuItem value={'Ls'}>
                          Prevalence in the mosquito population
                        </MenuItem>
                        <MenuItem value={'Ws'}>
                          Prevalence of worms in the lymph nodes
                        </MenuItem>
                      </Select>
                    </FormControl>

                    <div>
                      <ScenarioGraph
                        data={result}
                        inputs={simMDAcoverage}
                        showAllResults={false}
                        metrics={[graphMetric]}
                        simInProgress={simInProgress}
                      />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        height: 100,
                        justifyContent: 'space-around',
                        marginTop: 30,
                        marginBottom: 20,
                        marginRight: 20,
                        marginLeft: 55,
                        cursor: 'hand',
                      }}
                    >
                      {/* {(12 / simParams.mdaSixMonths) * 20} */}
                      {simMDAtime.map((e, i) => (
                        <div
                          key={i}
                          style={{
                            background: '#B09AFF',
                            height: 100,
                            minWidth: 1,
                            borderWidth: 1,
                            borderColor: 'white',
                            borderStyle: 'solid',
                            opacity: simMDAcoverage[i] === 0 ? 0.3 : 1,
                          }}
                          onMouseOver={(a) => {
                            //a.target.style.borderColor = '#d01c8b'
                          }}
                          onMouseOut={(a) => {
                            //a.target.style.borderColor = 'white'
                          }}
                          onClick={(a) => {
                            setCurMDARound(i)
                            setDoseSettingsOpen(true)
                          }}
                          className="bar"
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
                                i === curMDARound ? '#d01c8b' : '#6236FF',
                              height: simMDAcoverage[i],
                              minWidth: 10,
                            }}
                          ></span>
                        </div>
                      ))}
                    </div>

                    {doseSettingsOpen && (
                      <ClickAwayListener onClickAway={closeRoundModal}>
                        <Paper elevation={3} className={classes.roundModal}>
                          <CloseButton action={closeRoundModal} />

                          <Typography
                            className={classes.title}
                            variant="h5"
                            component="h4"
                          >
                            {/* MDA round #  */}
                            {simParams.mdaSixMonths === 6
                              ? curMDARound % 2
                                ? new Date().getFullYear() +
                                  Math.floor(curMDARound / 2)
                                : new Date().getFullYear() + curMDARound / 2
                              : new Date().getFullYear() + curMDARound}
                            {curMDARound % 2 ? ' (2nd round)' : ''}
                          </Typography>
                          <FormControl
                            fullWidth
                            className={classes.formControl}
                          >
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
                          <FormControl
                            fullWidth
                            className={classes.formControl}
                          >
                            <Tooltip
                              title="Controls how randomly coverage is applied. For 0, coverage is completely random. For 1, the same individuals are always treated."
                              aria-label="info"
                            >
                              <FormLabel
                                component="legend"
                                htmlFor="rho"
                                className={`${classes.withSlider} ${classes.withHelp}`}
                              >
                                Systematic adherence
                              </FormLabel>
                            </Tooltip>
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
                  </div>
                </div>
              </TabPanel>
            ))}

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
                  min={5}
                  step={0.5}
                  max={18}
                  onChange={(event, newValue) => {
                    handleSliderChanges(newValue, 'endemicity')
                  }}
                  aria-labelledby="slider"
                  marks={[
                    { value: 5, label: '5%' },
                    { value: 18, label: '18%' },
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
                  onChange={(event) => {
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
                  onChange={(event) => {
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
                disabled={
                  simInProgress || scenarioResults.length === 0
                } /*  || scenarioInputs.length === 0 */
                onClick={runCurrentScenario}
              >
                UPDATE SCENARIO
              </Button>

              <Button
                variant="contained"
                disabled={
                  simInProgress || scenarioResults.length === 0
                } /*  || scenarioInputs.length === 0 */
                onClick={confirmRemoveCurrentScenario}
              >
                REMOVE SCENARIO
              </Button>

              <ConfirmationDialog
                title="Do you want to delete this scenario?"
                onClose={() => {
                  setConfirmatonOpen(false)
                }}
                onConfirm={confirmedRemoveCurrentScenario}
                open={confirmatonOpen}
              />
            </div>
            {simulationProgress !== 0 && simulationProgress !== 100 && (
              <div className={classes.progress}>
                <CircularProgress
                  variant="determinate"
                  value={simulationProgress}
                  color="secondary"
                />
                <span>{simulationProgress}%</span>
              </div>
            )}
          </Grid>
        </Grid>
      </section>

      <DiveDeeper
        title="Get an overview"
        links={[
          ...countryLinks,
          { to: '/trends', name: 'TRENDS FOR ALL COUNTRIES' },
          { to: '/hotspots', name: 'HOTSPOTS FOR ALL COUNTRIES' },
        ]}
      />
    </Layout>
  )
}
export default Simulator
