import React, { useEffect } from 'react'
import ReactMapGL, { Source, Layer, Popup } from 'react-map-gl'
import { useHistory, useRouteMatch } from 'react-router-dom'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Tooltip, Typography } from '@material-ui/core'
import { format } from 'd3'
import useMapReducer from '../hooks/useMapReducer'
import 'mapbox-gl/dist/mapbox-gl.css'

function Map({ data, country, features, width, height, disableZoom, filter, countryFeatures }) {
  const [
    { year, viewport, feature, featureHover, popup, tooltip },
    dispatch,
  ] = useMapReducer()

  const history = useHistory()
  const match = useRouteMatch('/:section')
  const matchesDetails = useRouteMatch('/:section/:country')

  const selectedFeatureID = feature?.properties.id
  const selectedData = data ? data[selectedFeatureID] : null
  const prevalenceSelected = selectedData?.prevalence[`${year}`]


  useEffect(() => {
    if (country) {
      let focus = null
      if ( !countryFeatures ) {
        focus = features.features.find(f => f.properties.id === country)
      } else {
        focus = countryFeatures.features.find(f => f.properties.id === country)
      }
      if (focus) {
        dispatch({ type: 'FOCUS', payload: { feature: focus } })
      }
    }
  }, [features, country, dispatch])

  const handleViewportChange = payload => {
    dispatch({ type: 'VIEWPORT', payload })
  }

  const handleClick = event => {
    if ( !selectedFeatureID ) {
      const feature = event.features.find(f => f.layer.id === 'fill-layer')
      if (feature) {
        dispatch({ type: 'SELECT', payload: { feature, event } })
      }
    }
  }

  const selectCountryClickHotspots = countryId => {
    if ( match.params.section != 'trends' ) {
      match.params.section = 'hotspots'
    }

    history.push(`/${match.params.section}/${countryId}`)
  }

  const selectCountryClickTrends = countryId => {
    if ( match.params.section != 'trends' ) {
      match.params.section = 'trends'
    }

    history.push(`/${match.params.section}/${countryId}`)
  }

  const handleHover = event => {
    if (event.features) {
      const feature = event.features.find(f => f.layer.id === 'fill-layer')
      if (feature) {
        dispatch({ type: 'HOVER', payload: { feature, event } })
      } else {
        dispatch({ type: 'HOVEROUT', payload: { feature, event } })
      }
    } else {
      dispatch({ type: 'HOVEROUT' })
    }
  }

  const handleClose = () => {
    if (country) {
      let focus = null
      if ( !countryFeatures ) {
        focus = features.features.find(f => f.properties.id === country)
      } else {
        focus = countryFeatures.features.find(f => f.properties.id === country)
      }
      if (focus) {
        dispatch({ type: 'FOCUSBACK', payload: { feature: focus } })
      }
    } else {
      dispatch({ type: 'DESELECT', payload: { country: country } })
    }
  }

  // old map style mapbox://styles/kpcarter100/ck7w5zz9l026d1imn43721owm

  return (
    <ReactMapGL
      {...viewport}
      width={width}
      height={height}
      attributionControl={false}
      scrollZoom={disableZoom ? false : true}
      doubleClickZoom={disableZoom ? false : true}
      mapStyle="mapbox://styles/kpcarter100/ck80d7xh004tt1irt06j8jkme"
      interactiveLayerIds={['fill-layer']}
      onViewportChange={handleViewportChange}
      onClick={handleClick}
      onHover={handleHover}
    >
      {features && (
        <Source id="africa" type="geojson" data={features}>
          <Layer
            id="fill-layer"
            beforeId="admin-0-boundary"
            filter={['has', `${year}`]}
            type="fill"
            paint={{
              'fill-color': [
                'coalesce',
                ['get', `${year}`],
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
            id="hover-layer"
            type="line"
            filter={['has', `${year}`]}
            layout={{ 'line-join': 'bevel' }}
            paint={{
              'line-color': [
                'case',
                ['==', ['get', 'id'], featureHover?.properties.id || null],
                '#6236FF',
                'rgba(0,0,0,0)',
              ],
              'line-width': 1,
            }}
          />
        </Source>
      )}
      {feature && selectedData && (
        <Popup
          latitude={popup[1]}
          longitude={popup[0]}
          closeButton={true}
          closeOnClick={false}
          onClose={handleClose}
          anchor="top"
        >
          <div>
            <Typography variant="subtitle1">
              {feature.properties.name}
            </Typography>
            <div>Prevalence: {prevalenceSelected} %</div>
            <div>Population: {format(',')(selectedData.population)}</div>
            <div>Endemicity: {selectedData.endemicity}</div>
            <p><a style={{color:'green'}} onClick={()=>selectCountryClickHotspots(feature.properties.id)}>Hotspots {feature.properties.name}</a> | 
            <a style={{color:'green'}} onClick={()=>selectCountryClickTrends(feature.properties.id)}>Trends {feature.properties.name}</a></p>
          </div>
        </Popup>
      )}
      {featureHover && !selectedData && (
        <Tooltip
          title={`${featureHover.properties.name} ${
            data[featureHover?.properties.id]?.prevalence[`${year}`]
          } %`}
          open
          placement="top"
        >
          <span
            style={{
              position: 'absoulte',
              display: 'inline-block',
              transform: `translate(${tooltip[0]}px,${tooltip[1] - 16}px)`,
            }}
          ></span>
        </Tooltip>
      )}
    </ReactMapGL>
  )
}

export default ({ height, ...props }) => (
  <AutoSizer disableHeight>
    {({ width }) => <Map width={width} height={height} {...props}></Map>}
  </AutoSizer>
)
