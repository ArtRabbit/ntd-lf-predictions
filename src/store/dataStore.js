import { computed, decorate } from 'mobx'
import { lazyObservable } from 'mobx-utils'
import { csv, autoType } from 'd3'
import { merge } from 'lodash'

class DataStore {
  static loadCSV = (url, parser) =>
    lazyObservable(async sink => {
      const result = await csv(url, autoType)
      return sink(result)
    })

  static loadGeojson = url =>
    lazyObservable(async sink => {
      const result = await fetch(url)
      const { features } = await result.json()

      // standardize IDs
      const featuresWithID = features.map(f => {
        const {
          ADMIN0,
          ADMIN1,
          IUs_NAME,
          ADMIN0ISO3,
          ADMIN1ID,
          IU_ID,
        } = f.properties
        const name = ADMIN0 || ADMIN1 || IUs_NAME
        const id = ADMIN0ISO3 || ADMIN1ID || IU_ID
        return merge({}, f, { properties: { id, name } })
      })

      const collection = {
        type: 'FeatureCollection',
        features: featuresWithID,
      }

      return sink(collection)
    })

  relationsLoader = DataStore.loadCSV('/data/relations.csv')
  countryLevelLoader = DataStore.loadCSV('/data/country-level.csv')
  stateLevelLoader = DataStore.loadCSV('/data/state-level.csv')
  iuLevelLoader = DataStore.loadCSV('/data/iu-level-nopred.csv')

  level0Loader = DataStore.loadGeojson('/geo/africa_country_ms_0.1.json')
  level1Loader = DataStore.loadGeojson('/geo/africa_state_ms_0.1.json')
  level2Loader = DataStore.loadGeojson('/geo/africa_iu_ms_0.01.json')

  get relations() {
    return this.relationsLoader.current()
  }

  get countries() {
    return this.countryLevelLoader.current()
  }

  get states() {
    return this.stateLevelLoader.current()
  }

  get ius() {
    return this.iuLevelLoader.current()
  }

  get featuresLevel0() {
    return this.level0Loader.current()
  }

  get featuresLevel1() {
    return this.level1Loader.current()
  }

  get featuresLevel2() {
    return this.level2Loader.current()
  }
}

decorate(DataStore, {
  relations: computed,
  countries: computed,
  states: computed,
  ius: computed,
  featuresLevel0: computed,
  featuresLevel1: computed,
  featuresLevel2: computed,
})

export default DataStore
