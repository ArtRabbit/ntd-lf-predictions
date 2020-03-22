import { observable, action, decorate } from 'mobx'
import { REGIME_NO_MDA } from '../constants'

class UiState {
  country = null
  regime = REGIME_NO_MDA
  endemicity = null

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  setCountry(id) {
    this.country = id
  }

  setEndemicity(endemicity) {
    this.endemicity = endemicity
  }

  setRegime(event) {
    this.regime = event.target.value
  }
}

decorate(UiState, {
  country: observable,
  endemicity: observable,
  regime: observable,
  setCountry: action.bound,
  setEndemicity: action.bound,
  setRegime: action.bound,
})

export default UiState
