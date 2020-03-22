import { useReducer } from 'react'
import { WebMercatorViewport, LinearInterpolator } from 'react-map-gl'
import { merge } from 'lodash'
import bbox from '@turf/bbox'
import { easeCubic } from 'd3'

// TODO: not needed anymore
const settings = [
  {
    source: 'data/country-level.csv',
    featureSource: 'geo/africa_country_ms_0.1.json',
    featureKey: 'ADMIN0ISO3',
    dataKey: 'Country',
  },
  {
    source: 'data/state-level.csv',
    featureSource: 'geo/africa_state_ms_0.1.json',
    featureKey: 'ADMIN1ID',
    dataKey: 'StateCode',
  },
  {
    source: 'data/iu-level.csv',
    featureSource: 'geo/africa_iu_ms_0.01.json',
    featureKey: 'IU_ID',
    dataKey: 'IUID',
  },
]

const initialState = {
  year: 2020,
  level: 0,
  Regime: 'No MDA',
  Endemicity: 0,
  viewport: {
    latitude: -4,
    longitude: 20,
    zoom: 3,
  },
}

const reduce = (state, { type, payload }) => {
  switch (type) {
    case 'LEVEL':
      return { ...state, level: payload, feature: null, ...settings[payload] }
    case 'REGIME':
      return { ...state, Regime: payload }
    case 'ENDEMICITY':
      return { ...state, Endemicity: payload }
    case 'YEAR':
      return { ...state, year: payload }
    case 'VIEWPORT':
      return { ...state, viewport: payload }
    case 'HOVER':
      return {
        ...state,
        featureHover: payload.feature,
        tooltip: payload.event.point,
      }
    case 'HOVEROUT':
        return {
          ...state,
          featureHover: null,
          tooltip: null,
        }
    case 'SELECT':
      const { feature, event } = payload
      const [minLng, minLat, maxLng, maxLat] = bbox(feature)
      const viewport = new WebMercatorViewport(state.viewport)
      const { longitude, latitude, zoom } = viewport.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          padding: 40,
        }
      )

      return merge({}, state, {
        feature,
        popup: event.lngLat,
        viewport: {
          longitude,
          latitude,
          zoom,
          transitionInterpolator: new LinearInterpolator({
            around: [event.offsetCenter.x, event.offsetCenter.y],
          }),
          transitionEasing: easeCubic,
          transitionDuration: 600,
        },
      })
    case 'DESELECT':
      console.log('Deselect')
      return merge({}, state, {
        feature:null,
        viewport: initialState.viewport,
      })
      return { ...state, feature: null }
    default:
      return state
  }
}

export default function useMapReducer({ initialLevel }) {
  return useReducer(
    reduce,
    merge({}, initialState, settings[initialLevel ?? 0])
  )
}
