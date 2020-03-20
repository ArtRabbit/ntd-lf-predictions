import { useContext } from 'react'
import { MobXProviderContext } from 'mobx-react'

export function useStores() {
  const stores = useContext(MobXProviderContext)
  return stores
}

export function useDataAPI() {
  const { dataAPI } = useContext(MobXProviderContext)
  return dataAPI
}

export function useUIState() {
  const { uiState } = useContext(MobXProviderContext)
  return uiState
}
