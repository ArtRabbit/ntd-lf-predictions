import { useReducer } from 'react'
import { WebMercatorViewport, LinearInterpolator } from 'react-map-gl'
import { merge } from 'lodash'
import bbox from '@turf/bbox'
import { easeCubic } from 'd3'

const initialState = {
  // TODO: should be controlled by app state
  year: 2020,
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
      zoom,
    },
  }
}

const reduce = (state, { type, payload }) => {
  switch (type) {
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
      // TODO: deselect should jump back to overview
      console.log('Deselect')
      return merge({}, state, {
        feature: null,
        viewport: initialState.viewport,
      })
    default:
      return state
  }
}

export default function useMapReducer() {
  return useReducer(reduce, initialState)
}
