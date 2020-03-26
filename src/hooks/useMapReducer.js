import { useReducer } from 'react'
import { WebMercatorViewport, LinearInterpolator } from 'react-map-gl'
import { merge } from 'lodash'
import bbox from '@turf/bbox'
import { easeCubic } from 'd3'

const initialState = {
  // TODO: should be controlled by app state
  year: 2020,
  playing: false,
  ready: false,
  viewport: {
    latitude: -4,
    longitude: 20,
    zoom: 3,
  },
}

const fit = (feature, vp) => {
  const [minLng, minLat, maxLng, maxLat] = bbox(feature)
  const viewport = new WebMercatorViewport(vp)
  const { longitude, latitude, zoom } = viewport.fitBounds(
    [
      [minLng, minLat],
      [maxLng, maxLat],
    ],
    {
      padding: 40,
    }
  )

  return {
    viewport: {
      longitude,
      latitude,
      //   only zoom-in if country
      zoom: !!feature.properties.ADMIN0ISO3 ? zoom : vp.zoom,
    },
  }
}

const reduce = (state, { type, payload }) => {
  switch (type) {
    case 'CHANGE_YEAR':
      return { ...state, year: payload }
    case 'START_PLAY':
      return { ...state, year: 2000, playing: true }
    case 'STOP_PLAY':
      return { ...state, playing: false }
    case 'VIEWPORT':
      return { ...state, viewport: payload, ready: true }
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
    case 'FOCUS':
      return merge({}, state, fit(payload, state.viewport))
    case 'SELECT':
      const { feature, event } = payload

      return merge({}, state, fit(feature, state.viewport), {
        feature,
        popup: event.lngLat,
        viewport: {
          transitionInterpolator: new LinearInterpolator({
            around: [event.offsetCenter.x, event.offsetCenter.y],
          }),
          transitionEasing: easeCubic,
          transitionDuration: 600,
        },
      })
    case 'DESELECT':
      return merge({}, state, {
        feature: null,
        viewport: initialState.viewport,
      })
    case 'FOCUSBACK':
      let newState = merge({}, state, fit(payload.feature, state.viewport))
      newState.featureHover = null
      newState.tooltip = null
      newState.feature = null
      return newState
    default:
      return state
  }
}

export default function useMapReducer(props) {
  return useReducer(reduce, merge({}, initialState, props))
}
