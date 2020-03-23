import React, { useEffect, forwardRef, useImperativeHandle } from 'react'
import ReactMapGL, { Source, Layer, Popup } from 'react-map-gl'
import { useHistory, useRouteMatch, NavLink } from 'react-router-dom'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Tooltip, Typography, Slider, Box, Link } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { format } from 'd3'
import useMapReducer from '../hooks/useMapReducer'
import 'mapbox-gl/dist/mapbox-gl.css'

const useStyles = makeStyles({
  slider: {
    width: 200,
  },
})

function Map({
  country,
  countryFeatures,
  stateFeatures,
  width,
  height,
  disableZoom,
  filter,
  forwardRef,
}) {
  const [
    { year, viewport, feature, featureHover, popup, tooltip, playing },
    dispatch,
  ] = useMapReducer()

  useImperativeHandle(forwardRef, () => ({
    start() {
      dispatch({ type: 'START_PLAY' })
    },
  }))

  const classes = useStyles()

  const history = useHistory()
  const match = useRouteMatch('/:section')
  const matchesDetails = useRouteMatch('/:section/:country')

  const interactiveLayers = [
    ...(!!countryFeatures ? ['fill-countries'] : []),
    ...(!!stateFeatures ? ['fill-states'] : []),
  ]

  useEffect(() => {
    if (country) {
      const focus = countryFeatures.features.find(
        f => f.properties.id === country
      )
      if (focus) {
        dispatch({ type: 'FOCUS', payload: focus })
      }
    }
  }, [countryFeatures, country, dispatch])

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
    const feature = event.features.find(f => f.layer.id === 'fill-countries')
    if (feature) {
      dispatch({ type: 'SELECT', payload: { feature, event } })
    }
  }

  const selectCountryClickHotspots = countryId => {
    if (match.params.section != 'trends') {
      match.params.section = 'hotspots'
    }

    history.push(`/${match.params.section}/${countryId}`)
  }

  const selectCountryClickTrends = countryId => {
    if (match.params.section != 'trends') {
      match.params.section = 'trends'
    }

    history.push(`/${match.params.section}/${countryId}`)
  }

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

  // old map style mapbox://styles/kpcarter100/ck7w5zz9l026d1imn43721owm

  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <div>
          <ReactMapGL
            {...viewport}
            width={width}
            height={height}
            attributionControl={false}
            scrollZoom={disableZoom ? false : true}
            doubleClickZoom={disableZoom ? false : true}
            mapStyle="mapbox://styles/kpcarter100/ck80d7xh004tt1irt06j8jkme"
            interactiveLayerIds={interactiveLayers}
            onViewportChange={handleViewportChange}
            onClick={handleClick}
            onHover={handleHover}
          >
            {countryFeatures && (
              <Source
                id="africa-countries"
                type="geojson"
                data={countryFeatures}
              >
                <Layer
                  id="fill-countries"
                  beforeId="admin-0-boundary"
                  filter={['has', `color-${year}`]}
                  type="fill"
                  paint={{
                    'fill-color': [
                      'case',
                      !stateFeatures,
                      [
                        'coalesce',
                        ['get', `color-${year}`],
                        // hide shape if no data available
                        'rgba(0,0,0,0)',
                      ],
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
                  filter={['has', `color-${year}`]}
                  layout={{ 'line-join': 'bevel' }}
                  paint={{
                    'line-color': [
                      'case',
                      [
                        '==',
                        ['get', 'id'],
                        featureHover?.properties.id || null,
                      ],
                      '#6236FF',
                      'rgba(0,0,0,0)',
                    ],
                    'line-width': 2,
                  }}
                />
              </Source>
            )}

            {stateFeatures && (
              <Source id="africa-states" type="geojson" data={stateFeatures}>
                <Layer
                  id="fill-states"
                  beforeId="admin-0-boundary"
                  filter={['has', `color-${year}`]}
                  type="fill"
                  paint={{
                    'fill-color': [
                      'coalesce',
                      ['get', `color-${year}`],
                      // hide shape if no data available
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
                  id="hover-states"
                  type="line"
                  filter={['has', `color-${year}`]}
                  layout={{ 'line-join': 'bevel' }}
                  paint={{
                    'line-color': [
                      'case',
                      [
                        '==',
                        ['get', 'id'],
                        featureHover?.properties.id || null,
                      ],
                      '#6236FF',
                      'rgba(0,0,0,0)',
                    ],
                    'line-width': 1,
                  }}
                />
              </Source>
            )}

            {feature && (
              <Popup
                latitude={popup[1]}
                longitude={popup[0]}
                closeButton={true}
                closeOnClick={false}
                onClose={handleClose}
                anchor="top"
              >
                <Box display="block" variant="body1" component="div">
                  <Typography variant="subtitle1">
                    {feature.properties.name}
                  </Typography>
                  <Link href="/trends">Link</Link>
                  <div>Prevalence: {feature.properties[`prev-${year}`]} %</div>
                  <div>
                    Population: {format(',')(feature.properties.population)}
                  </div>
                  <div>Endemicity: {feature.properties.endemicity}</div>
                  <ul className="links">
                    <li>
                      <Link href="#"
                        onClick={() =>
                          selectCountryClickHotspots(feature.properties.id)
                        }
                      >
                        Hotspots {feature.properties.name}
                      </Link >{' '}
                    </li>
                    <li>
                      <Link href="#"
                        onClick={() =>
                          selectCountryClickTrends(feature.properties.id)
                        }
                      >
                        Trends {feature.properties.name}
                      </Link>
                    </li>
                  </ul>
                </Box>
              </Popup>
            )}

            {featureHover && (
              <Tooltip
                title={`${featureHover.properties.name} ${
                  featureHover.properties[`prev-${year}`]
                  } %`}
                open
                placement="top"
              >
                <span
                  style={{
                    position: 'absoulte',
                    display: 'inline-block',
                    transform: `translate(${tooltip[0]}px,${tooltip[1] -
                      16}px)`,
                  }}
                ></span>
              </Tooltip>
            )}
          </ReactMapGL>
          <div>year: {year}</div>
          <Slider
            className={classes.slider}
            min={2000}
            max={2030}
            step={1}
            value={year}
            onChange={handleYearChange}
          ></Slider>
        </div>
      )}
    </AutoSizer>
  )
}

export default forwardRef((props, ref) => (
  <Map {...props} forwardRef={ref}></Map>
))
