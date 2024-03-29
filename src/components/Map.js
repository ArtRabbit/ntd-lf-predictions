import React, { useEffect, forwardRef, useImperativeHandle } from 'react'
import ReactMapGL, { Source, Layer, Popup, HTMLOverlay } from 'react-map-gl'
import { useHistory, useRouteMatch, Link as RouterLink } from 'react-router-dom'
import { Typography, Slider, Box, Link, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { format } from 'd3'
import useMapReducer from '../hooks/useMapReducer'
import Legend from './Legend'
import Tooltip from './Tooltip'
import { NO_DATA } from '../constants'
import 'mapbox-gl/dist/mapbox-gl.css'

const useStyles = makeStyles({
  slider: {
    width: '60%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '20px',
    marginTop: '-15px',
    display: 'block',
  },
  mapWrap: {
    width: '100%',
    height: '100%',
    minHeight: 500,
  },
  popup: {
    zIndex: 10000,
  },
  legendTitle: {
    paddingLeft: '20px',
    paddingRight: '20px',
    fontSize: '12px',
    marginBottom: '0px',
    paddingBottom: '0px',
  },
})

function Map({
  country,
  countryFeatures,
  stateFeatures,
  iuFeatures,
  populationFeatures,
  width,
  height,
  disableZoom,
  filter,
  trendMode,
  colorScale,
  forwardRef,
}) {
  const [
    { year, viewport, feature, featureHover, popup, tooltip, playing, ready },
    dispatch,
  ] = useMapReducer()

  useImperativeHandle(forwardRef, () => ({
    start() {
      dispatch({ type: 'START_PLAY' })
    },
  }))

  if (iuFeatures) console.log(iuFeatures)

  const classes = useStyles()

  const interactiveLayers = [
    ...(!!countryFeatures ? ['fill-countries'] : []),
    // the states layer is only active if a country is selected
    ...(!!stateFeatures && country ? ['fill-states'] : []),
    ...(!!iuFeatures && country ? ['fill-iu'] : []),
  ]

  const colorProp = trendMode ? 'color-perf' : `color-${year}`

  useEffect(() => {
    if (country && ready) {
      const focus = countryFeatures.features.find(
        f => f.properties.id === country
      )
      if (focus) {
        dispatch({ type: 'FOCUS', payload: focus })
      }
    }
  }, [countryFeatures, country, dispatch, ready])

  useEffect(() => {
    let timeout

    if (playing) {
      if (year < 2030) {
        timeout = setTimeout(() => {
          dispatch({ type: 'CHANGE_YEAR', payload: year + 1 })
        }, 200)
      } else {
        dispatch({ type: 'STOP_PLAY' })
      }
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [year, dispatch, playing])

  const handleYearChange = (event, value) => {
    dispatch({ type: 'CHANGE_YEAR', payload: value })
  }

  const handleViewportChange = payload => {
    dispatch({ type: 'VIEWPORT', payload })
  }

  const handleClick = event => {
    const feature = event.features[0]
    if (feature) {
      dispatch({ type: 'SELECT', payload: { feature, event } })
    }
  }

  //   const selectCountryClickHotspots = countryId => {
  //     if (match) {
  //       if (match.params.section != 'trends') {
  //         match.params.section = 'hotspots'
  //       }

  //       history.push(`/${match.params.section}/${countryId}`)
  //     } else {
  //       history.push(`/hotspots/${countryId}`)
  //     }
  //   }

  //   const selectCountryClickTrends = countryId => {
  //     if (match) {
  //       if (match.params.section != 'trends') {
  //         match.params.section = 'trends'
  //       }

  //       history.push(`/${match.params.section}/${countryId}`)
  //     } else {
  //       history.push(`/trends/${countryId}`)
  //     }
  //   }

  const handleHover = event => {
    if (event.features) {
      const feature = event.features[0]
      if (feature) {

        dispatch({ type: 'HOVER', payload: { feature, event } })
        
      } else {
        dispatch({ type: 'HOVEROUT' })
      }
    } else {
      dispatch({ type: 'HOVEROUT' })
    }
  }

  const handleClose = () => {
    if (country) {
      const focus = countryFeatures.features.find(
        f => f.properties.id === country
      )
      if (focus) {
        dispatch({ type: 'FOCUSBACK', payload: { feature: focus } })
      }
    } else {
      dispatch({ type: 'DESELECT' })
    }
  }

  const getYearLabel = value => {
    return '‘' + value.toString().substr(-2)
  }

  // old map style mapbox://styles/kpcarter100/ck7w5zz9l026d1imn43721owm

  const renderPopup = f => {
    const { name, id, performance, endemicity, population } = f.properties
    const prevalence = feature.properties[`prev-${year}`]
    const performanceInfo =
      prevalence !== 'null'
        ? performance <= 0
          ? -1 * performance + '% decline'
          : performance + '% increase'
        : NO_DATA
    return (
      <Box display="block" variant="body1" component="div">
        <Typography variant="subtitle1" gutterBottom>
          {name}
        </Typography>
        <div>
          Prevalence: {prevalence !== 'null' ? `${prevalence}%` : NO_DATA}
        </div>
        {population && <div>Population: {format(',')(population)}</div>}
        {endemicity && <div>Endemicity: {endemicity}</div>}
        <div>Trend: {performanceInfo}</div>
        {feature.source === 'africa-countries' && (
          <ul className="links">
            <li>
              <Link
                component={RouterLink}
                to={`/trends/${id}`}
                children={`Trends ${name}`}
              />
            </li>
            <li>
              <Link
                component={RouterLink}
                to={`/hotspots/${id}`}
                children={`Hotspots ${name}`}
              />
            </li>
          </ul>
        )}
        {feature.source === 'africa-iu' && (
          <ul className="links">
            <li>
              <Link
                component={RouterLink}
                to={`/simulator/?base_prev=${prevalence}&country=${country}`}
                children={`Simulate other interventions`}
              />
            </li>
          </ul>
        )}
      </Box>
    )
  }

  return (
    <div className={classes.mapWrap}>
      <ReactMapGL
        {...viewport}
        width={width ? width : '100%'}
        height={height ? height : '100%'}
        attributionControl={false}
        scrollZoom={disableZoom ? false : true}
        doubleClickZoom={disableZoom ? false : true}
        mapStyle="mapbox://styles/kpcarter100/ck80d7xh004tt1irt06j8jkme"
        interactiveLayerIds={interactiveLayers}
        onViewportChange={handleViewportChange}
        onClick={handleClick}
        onHover={handleHover}
      >
        {/* Country features */}
        {countryFeatures && (
          <Source id="africa-countries" type="geojson" data={countryFeatures}>
            <Layer
              id="fill-countries"
              beforeId="admin-0-boundary"
              filter={['has', colorProp]}
              type="fill"
              paint={{
                'fill-color': [
                  'case',
                  !stateFeatures,
                  [
                    'coalesce',
                    ['get', colorProp],
                    // hide shape if no data available
                    'rgba(0,0,0,0)',
                  ],
                  // hide country features if stateFeatures are available
                  'rgba(0,0,0,0)',
                ],
                'fill-outline-color': [
                  'case',
                  ['==', ['get', 'id'], feature?.properties.id || null],
                  'rgba(255, 145, 170, 1)',
                  'rgba(255, 145, 170, 0.3)',
                ],
              }}
            />
            <Layer
              id="hover-countries"
              type="line"
              filter={['has', colorProp]}
              layout={{ 'line-join': 'bevel' }}
              paint={{
                'line-color': [
                  'case',
                  ['==', ['get', 'id'], featureHover?.properties.id || null],
                  '#616161',
                  'rgba(0,0,0,0)',
                ],
                'line-width': 1,
              }}
            />
          </Source>
        )}

        {/* State features */}
        {stateFeatures && (
          <Source id="africa-states" type="geojson" data={stateFeatures}>
            <Layer
              id="fill-states"
              beforeId="admin-0-boundary"
              filter={['has', colorProp]}
              type="fill"
              paint={{
                'fill-color': [
                  'case',
                  !iuFeatures,
                  [
                    'coalesce',
                    ['get', colorProp],
                    // hide shape if no data available
                    '#F2F1F1',
                  ],
                  // hide states if IUs provided
                  'rgba(0,0,0,0)',
                ],
                'fill-outline-color': [
                  'case',
                  ['==', ['get', 'id'], feature?.properties.id || null],
                  'rgba(145, 145, 145, 1)',
                  '#CCCACA',
                ],
              }}
            />
            <Layer
              id="hover-states"
              source="africa-states"
              type="line"
              filter={['has', colorProp]}
              layout={{ 'line-join': 'bevel' }}
              paint={{
                'line-color': [
                  'case',
                  ['==', ['get', 'id'], featureHover?.properties.id || null],
                  '#616161',
                  'rgba(0,0,0,0)',
                ],
                'line-width': 1,
              }}
            />
          </Source>
        )}

        {/* IU features */}
        {iuFeatures && (
          <Source id="africa-iu" type="geojson" data={iuFeatures}>
            <Layer
              id="fill-iu"
              beforeId="admin-0-boundary"
              filter={['has', colorProp]}
              type="fill"
              paint={{
                'fill-color': [
                  'coalesce',
                  ['get', colorProp],
                  // grey shapes if no data available
                  '#F2F1F1',
                ],
                'fill-outline-color': [
                  'case',
                  ['==', ['get', 'id'], feature?.properties.id || null],
                  'rgba(145, 145, 145, 1)',
                  'rgba(145, 145, 145, 0.3)',
                ],
              }}
            />
            <Layer
              id="hover-iu"
              source="africa-iu"
              type="line"
              filter={['has', colorProp]}
              layout={{ 'line-join': 'bevel' }}
              paint={{
                'line-color': [
                  'case',
                  ['==', ['get', 'id'], featureHover?.properties.id || null],
                  '#616161',
                  'rgba(0,0,0,0)',
                ],
                'line-width': 1,
              }}
            />
          </Source>
        )}

        {/* Population circles */}
        {populationFeatures && (
          <Source
            id="africa-countries-population"
            type="geojson"
            data={populationFeatures}
          >
            <Layer
              id="population-countries"
              type="circle"
              paint={{
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  3,
                  ['/', ['sqrt', ['get', 'population']], 200],
                  10,
                  ['/', ['sqrt', ['get', 'population']], 40],
                ],
                'circle-color': 'rgba(255,0,0,0)',
                'circle-stroke-color': 'rgba(0,0,0,1)',
                'circle-stroke-width': 1,
              }}
            />
          </Source>
        )}

        {/* Popup */}
        {feature && (
          <Popup
            latitude={popup[1]}
            longitude={popup[0]}
            closeButton={true}
            closeOnClick={false}
            onClose={handleClose}
            anchor="top"
            className={classes.popup}
          >
            {renderPopup(feature)}
          </Popup>
        )}

        {/* Tooltip */}
        {featureHover && !feature && (
          <Tooltip feature={featureHover} year={year} position={tooltip} />
        )}

        {/* Legend */}
        {colorScale && (
          <HTMLOverlay
            redraw={() => (
              <div
                style={{
                  right: 32,
                  bottom: 32,
                  position: 'absolute',
                }}
              >
                <Paper>
                  <Box p={1} pb={2}>
                    <Typography variant="body2" className={classes.legendTitle}>
                      {trendMode ? 'Prevalence change 2000-2030' : 'Prevalence'}
                    </Typography>

                    <Legend colorScale={colorScale} />
                  </Box>
                </Paper>
              </div>
            )}
          />
        )}
      </ReactMapGL>

      {!trendMode && (
        <Slider
          className={classes.slider}
          value={year}
          step={1}
          min={2000}
          max={2030}
          marks={[
            { value: 2000, label: '2000' },
            { value: 2030, label: '2030' },
          ]}
          valueLabelDisplay="on"
          valueLabelFormat={getYearLabel}
          onChange={handleYearChange}
        />
      )}
    </div>
  )
}

export default forwardRef((props, ref) => (
  <Map {...props} forwardRef={ref}></Map>
))
