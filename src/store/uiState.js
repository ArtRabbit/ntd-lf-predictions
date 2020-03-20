import { observable, action, decorate } from 'mobx'

class UiState {
  country = null
  regime = 'No MDA'
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

  setRegime(regime) {
    this.regime = regime
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
