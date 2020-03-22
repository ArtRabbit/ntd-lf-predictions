import React from 'react'
import ReactMapGL, { Source, Layer, Popup } from 'react-map-gl'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Tooltip, Typography } from '@material-ui/core'
import { format } from 'd3'
import useMapReducer from '../hooks/useMapReducer'
import 'mapbox-gl/dist/mapbox-gl.css'

function Map({ data, features, width, height, initialLevel, disableZoom, filter }) {
  const [
    { year, level, viewport, feature, featureHover, popup, tooltip },
    dispatch,
  ] = useMapReducer({ initialLevel })

  const selectedFeatureID = feature?.properties.id
  const selectedData = data ? data[selectedFeatureID] : null
  const prevalenceSelected = selectedData?.prevalence[`${year}`]

  const handleViewportChange = payload => {
    dispatch({ type: 'VIEWPORT', payload })
  }

  const handleClick = event => {
    const feature = event.features.find(f => f.layer.id === 'fill-layer')
    if (feature) {
      dispatch({ type: 'SELECT', payload: { feature, event } })
    }
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
    dispatch({ type: 'DESELECT' })
  }

  // old map style mapbox://styles/kpcarter100/ck7w5zz9l026d1imn43721owm
  

  return (
    
    <ReactMapGL
      {...viewport}
      width={width}
      height={height}
      attributionControl={false}
      scrollZoom={disableZoom ? false: true}
      doubleClickZoom={ disableZoom ? false : true }
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
            // beforeId={level === 0 ? 'admin-1-boundary-bg' : 'admin-0-boundary'}
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
            <a href="/trends">Link</a>
            {level === 2 && <div>Endemicity: {selectedData.endemicity}</div>}
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
