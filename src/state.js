import { createContext } from 'react'

export const SELECT_COUNTRY = 'SELECT_COUNTRY'
export const SELECT_STATE = 'SELECT_STATE'

export const StateContext = createContext()
export const DispatchContext = createContext()

// initial application state
export const initialState = {
  country: null,
  state: null,
}

export function reducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case SELECT_COUNTRY:
      return { ...state, country: payload }
    case SELECT_STATE:
      return { ...state, state: payload }
    default:
      return state
  }
}
