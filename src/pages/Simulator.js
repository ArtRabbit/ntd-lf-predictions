import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Layout } from "../layout";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Tooltip from "@material-ui/core/Tooltip";
import Slider from "@material-ui/core/Slider";

import Head from "./components/Head";
import Inputs from "./components/Inputs";
import DiveDeeper from "./components/DiveDeeper";

import * as SimulatorEngine from "./components/simulator/SimulatorEngine";
// import "./components/simulator/SimulatorEngine";

// let SimulatorEngine = await import("./components/simulator/SimulatorEngine");
// console.log(params);
console.log(SimulatorEngine.params);
console.log(SimulatorEngine.simControler.params);

// SimulatorEngine.documentReady();

const useStyles = makeStyles(theme => ({
    headLeftColumn: {
        textAlign: "left"
    },
    headRightColumn: {
        textAlign: "right",
        padding: theme.spacing(4, 2)
    },
    tabs: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
    },
    title: {
        marginBottom: 10
    },
    formControl: {
        margin: theme.spacing(0, 0, 5, 0),
        minWidth: "100%",
        "& > label": {}
    },
    contentLeftColumn: {},
    contentRightColumn: {},
    buttons: {
        display: "flex",
        flexDirection: "column",
        "& > *": {
            margin: theme.spacing(1)
        }
    }
}));

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography component="div" role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

const Simulator = ({ history, location }) => {
    const classes = useStyles();

    SimulatorEngine.simControler.documentReady();

    const [simParams, setSimParams] = useState({
        // ...SimulatorEngine.params, // default params
        ...SimulatorEngine.simControler.params // params editable via UI
    });

    const [value, setValue] = React.useState(0);
    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleInputChange = event => {
        // setFrequency(event.target.value);
        setSimParams({ ...simParams, mdaSixMonths: event.target.value });
    };

    useEffect(() => {
        console.log(simParams.mdaSixMonths);
        console.log(simParams.coverage);
    }, [simParams]);

    const handleSliderChange = (event, newValue) => {
        setSimParams({
            ...simParams,
            coverage: newValue / 100
        });
        // setSliderValue(newValue);
    };

    const [scenarioResults, setScenarioResults] = useState([]);
    const simulatorCallback = par => {
        //        console.log(par);
        setScenarioResults([...scenarioResults, par]);
    };
    const runScenario = () => {
        SimulatorEngine.simControler.runScenario(simParams, simulatorCallback);
    };

    return (
        <Layout>
            <Grid container spacing={0}>
                <Grid item md={8} xs={12} className={classes.headLeftColumn}>
                    <Head transparent={true} title="Lympahtic filariasis Prevalence Simulator" />
                </Grid>
                <Grid item md={4} xs={12} className={classes.headRightColumn}>
                    <Typography className={classes.headline} color="textSecondary" gutterBottom>
                        Number of runs (precision) type of mosquito systemic adherence
                    </Typography>
                </Grid>
            </Grid>

            <Grid container spacing={4}>
                <Grid item md={8} xs={12} className={classes.contentLeftColumn}>
                    <Typography className={classes.title} variant="h5" component="h2">
                        Prevalence over time
                    </Typography>

                    <div className={classes.tavs}>
                        <AppBar position="static">
                            <Tabs value={value} onChange={handleTabChange} aria-label="simple tabs example">
                                <Tab label="Scenario 1" {...a11yProps(0)} />
                                <Tab label="Scenario 2" {...a11yProps(1)} />
                                <Tab label="Scenario 3" {...a11yProps(2)} />
                            </Tabs>
                        </AppBar>
                        <TabPanel value={value} index={0}>
                            Scenario 1<div style={{ overflow: "hidden", height: "500px" }}>{scenarioResults[0]}</div>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            Scenario 2<div style={{ overflow: "hidden", height: "500px" }}>{scenarioResults[1]}</div>
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            Scenario 3<div style={{ overflow: "hidden", height: "500px" }}>{scenarioResults[3]}</div>
                        </TabPanel>
                    </div>
                </Grid>
                <Grid item md={4} xs={12} className={classes.contentRightColumn}>
                    <Typography className={classes.title} variant="h5" component="h2">
                        Intervention
                    </Typography>

                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-helper-label">Fruequency</InputLabel>
                        <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" value={simParams.mdaSixMonths} onChange={handleInputChange}>
                            <MenuItem value={12}>Annual</MenuItem>
                            <MenuItem value={6}>Every 6 months</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <Typography id="non-linear-slider" gutterBottom>
                            Target coverage
                        </Typography>

                        <InputLabel id="slider"></InputLabel>
                        <Slider value={simParams.coverage * 100} min={0} step={1} max={100} onChange={handleSliderChange} valueLabelDisplay="auto" aria-labelledby="slider" />
                    </FormControl>

                    <div className={classes.buttons}>
                        <Button variant="contained" color="primary" onClick={runScenario}>
                            UPDATE SCENARIO
                        </Button>
                        <Button variant="contained" color="primary">
                            NEW SCENARIO
                        </Button>
                    </div>
                </Grid>
            </Grid>

            <DiveDeeper
                title="Get an overview"
                links={[
                    { to: "/hot-spots", name: "TRENDS FOR ALL COUNTRIES" },
                    { to: "/country", name: "PROBLEM AREAS FOR ALL COUNTRIES" }
                ]}
            />
        </Layout>
    );
};
export default Simulator;
