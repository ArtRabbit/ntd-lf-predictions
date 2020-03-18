import React from 'react'
import ReactMapGL, { Source, Layer, Popup } from 'react-map-gl'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Tooltip, Typography } from '@material-ui/core'
import { format } from 'd3'
import { useNewData } from '../hooks/useData'
import useFeatureCollection from '../hooks/useFeatureCollection'
import useFeaturesAndData from '../hooks/useFeaturesAndData'
import useMapReducer from '../hooks/useMapReducer'
import 'mapbox-gl/dist/mapbox-gl.css'

function Map({ width, height, initialLevel }) {
  const [
    {
      year,
      level,
      Regime,
      Endemicity,
      source,
      featureSource,
      featureKey,
      dataKey,
      viewport,
      feature,
      featureHover,
      popup,
      tooltip,
    },
    dispatch,
  ] = useMapReducer({ initialLevel })

  // load geojson features
  const { featureCollection, loading: loadingFeatures } = useFeatureCollection(
    featureSource
  )

  // load data
  const { data, stats, loading } = useNewData({
    Regime,
    Endemicity: level === 2 && Endemicity,
    source,
    key: dataKey,
  })

  // merge features with data
  const { merged } = useFeaturesAndData({
    featureCollection,
    data,
    stats,
    key: featureKey,
    ready: !loading && !loadingFeatures,
  })

  const prevalenceHover =
    data[featureHover?.properties.id]?.prevalence[`Prev_Year${year}`]

  const selectedFeatureID = feature?.properties.id
  const selectedData = data[selectedFeatureID]
  const prevalenceSelected = selectedData?.prevalence[`Prev_Year${year}`]

  const handleViewportChange = payload => {
    dispatch({ type: 'VIEWPORT', payload })
  }

  const handleClick = event => {
    const feature = event.features.find(f => f.layer.id === 'fill-layer')
    dispatch({ type: 'SELECT', payload: { feature, event } })
  }

  const handleHover = event => {
    if (event.features) {
      const feature = event.features.find(f => f.layer.id === 'fill-layer')
      dispatch({ type: 'HOVER', payload: { feature, event } })
    }
  }

  const handleClose = () => {
    dispatch({ type: 'DESELECT' })
  }

  return (
    <ReactMapGL
      {...viewport}
      width={width}
      height={height}
      mapStyle="mapbox://styles/kpcarter100/ck7w5zz9l026d1imn43721owm"
      interactiveLayerIds={['fill-layer']}
      onViewportChange={handleViewportChange}
      onClick={handleClick}
      onHover={handleHover}
    >
      <Source id="africa" type="geojson" data={merged}>
        <Layer
          id="fill-layer"
          // beforeId={level === 0 ? 'admin-1-boundary-bg' : 'admin-0-boundary'}
          beforeId="admin-0-boundary"
          filter={['has', `Prev_Year${year}`]}
          type="fill"
          paint={{
            'fill-color': [
              'coalesce',
              ['get', `Prev_Year${year}`],
              // hide shape if no data available
              'rgba(0,0,0,0)',
            ],
            'fill-outline-color': [
              'case',
              ['==', ['get', 'id'], feature?.properties.id || null],
              'rgba(121, 145, 170, 1)',
              'rgba(121, 145, 170, 0.3)',
            ],
          }}
        />
        <Layer
          id="hover-layer"
          type="line"
          filter={['has', `Prev_Year${year}`]}
          layout={{ 'line-join': 'bevel' }}
          paint={{
            'line-color': [
              'case',
              ['==', ['get', 'id'], featureHover?.properties.id || null],
              '#96B4D3',
              'rgba(0,0,0,0)',
            ],
            'line-width': 2,
          }}
        />
      </Source>
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
            {level === 2 && <div>Endemicity: {selectedData.endemicity}</div>}
          </div>
        </Popup>
      )}
      {featureHover && (
        <Tooltip
          title={`${featureHover.properties.name} ${prevalenceHover} %`}
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
