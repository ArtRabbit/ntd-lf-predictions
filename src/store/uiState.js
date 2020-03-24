import { observable, action, decorate } from 'mobx'
import { REGIME_NO_MDA } from '../constants'

class UiState {
  country = null
  regime = REGIME_NO_MDA
  endemicity = null
  welcomeScren = true // by default user see welcome screen on home, than intro
  infoTooltip = true // show big tooltip untill interaction

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

  setWelcomeScreen(show) {
    this.welcomeScren = show
  }

  setInfoTooltip(show) {
    this.infoTooltip = show
  }

}

decorate(UiState, {
  country: observable,
  endemicity: observable,
  regime: observable,
  welcomeScren: observable,
  infoTooltip: observable,
  setCountry: action.bound,
  setEndemicity: action.bound,
  setRegime: action.bound,
  setWelcomeScreen: action.bound,
  setInfoTooltip: action.bound,
})

export default UiState
