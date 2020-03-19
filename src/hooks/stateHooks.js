import { useContext } from 'react'
import { StateContext, DispatchContext } from '../state'

export function useState() {
  const state = useContext(StateContext)
  return state
}

export function useDispatch() {
  const dispatch = useContext(DispatchContext)
  return dispatch
}
