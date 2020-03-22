import { computed, decorate } from 'mobx'
import {
  groupBy,
  keyBy,
  flow,
  values,
  flatten,
  entries,
  map,
  round,
  keys,
  filter,
  mapKeys,
  omit,
  mapValues as mapValuesFP,
  pickBy as pickByFP,
  sortBy as sortByFP,
} from 'lodash/fp'

import {
  sortBy,
  pick,
  merge,
  min,
  max,
  zip,
  mapValues as mapValuesS,
} from 'lodash'
import { interpolateReds, scaleSequential, color, interpolateCubehelixDefault } from 'd3'

const emptyFeatureCollection = { type: 'FeatureCollection', features: [] }

// helper that groups columns of the csv into object properties
const groupProps = (obj, pattern) =>
  flow(
    pickByFP((value, key) => new RegExp(pattern).test(key)),
    mapKeys(key => key.replace(/[^\d]/g, ''))
  )(obj)

const roundPrevalence = p => round(p * 100, 2)

function addRankingAndStats(data) {
  const dataMap = keyBy('id')(data)

  // create ranking
  const rankings = flow(
    values,
    map(({ prevalence, id }) =>
      entries(prevalence).map(([year, prevalence]) => ({
        year,
        prevalence,
        id,
      }))
    ),
    flatten,
    // group all values by year
    groupBy('year'),
    // add year and rank
    mapValuesFP(v =>
      sortBy(v, ['prevalence', 'id']).map((x, i) => ({
        ...x,
        year: +x.year,
        rank: i + 1,
      }))
    ),
    // break-up grouping by year
    values,
    flatten,
    // build rank series
    groupBy('id'),
    mapValuesFP(ranks => map(omit('id'))(ranks))
  )(dataMap)

  // add rankings to entries
  const processed = mapValuesFP(x => ({ ...x, ranks: rankings[x.id] }))(dataMap)

  // create stats
  const extremes = flow(
    values,
    map(({ prevalence }) => {
      const pValues = values(prevalence)
      return [min(pValues), max(pValues)]
    })
  )(processed)

  const [minN, maxN] = zip(...extremes)

  const stats = {
    prevalence: { min: min(minN) ?? 0, max: max(maxN) ?? 0 },
  }

  return { data: processed, stats }
}

function addIDRelations({ data, relations, key }) {
  const groupRelByKey = groupBy(key)(relations)
  return flow(
    map(row => {
      const { [key]: id, Population } = row
      const meta = groupRelByKey[id][0]

      // retrieve entity names from relations
      const name =
        key === 'Country'
          ? meta.CountryName
          : key === 'StateCode'
          ? meta.StateName
          : meta.IUName

      const probability = groupProps(row, 'elimination')
      const prev = groupProps(row, 'Prev_')
      const lower = groupProps(row, 'Lower')
      const upper = groupProps(row, 'Upper')

      const related = groupRelByKey[id]
      const relatedCountries = flow(groupBy('Country'), keys)(related)
      const relatedStates = flow(groupBy('StateCode'), keys)(related)
      const relatedIU = flow(groupBy('IUID'), keys)(related)

      const enhanced = {
        id,
        name,
        population: round(Population, 0),
        endemicity: row.Endemicity,
        prevalence: mapValuesFP(roundPrevalence)(prev),
        probability,
        lower,
        upper,
        relatedCountries,
        relatedStates,
        relatedIU,
      }
      return enhanced
    })
  )(data)
}

function mergeFeatures(data, featureCollection, key) {
  const { data: d, stats } = data

  // TODO: add bins
  const colorScale = scaleSequential(interpolateReds)
    .domain([0, stats.prevalence.max])
    .nice(5)

  const ticks = colorScale
    .ticks(5)
    .map(value => ({ value, color: colorScale(value) }))

  const features = featureCollection.features.map(feature => {
    // get IU id
    const id = feature.properties[key]
    const prevalenceOverTime = d[id]?.prevalence ?? {}

    // get color from scale if prevalence value available
    const colorsByYear = mapValuesFP(prevalenceOverTime, p_prevalence =>
      isFinite(p_prevalence) ? color(colorScale(p_prevalence)).hex() : null
    )

    return merge({}, feature, {
      properties: {
        ...colorsByYear,
      },
    })
  })

  return { type: 'FeatureCollection', features }
}

class DataAPI {
  constructor(rootStore) {
    this.dataStore = rootStore.dataStore
    this.uiState = rootStore.uiState
  }

  get rowFilter() {
    const { endemicity, regime } = this.uiState
    return !!endemicity
      ? { Regime: regime, Endemicity: endemicity }
      : { Regime: regime }
  }

  // filter countries by endemicity and regime
  get filteredCountries() {
    const { countries } = this.dataStore

    if (countries) {
      return filter(this.rowFilter)(countries)
    }

    return null
  }

  // filter states by endemicity and regime
  get filteredStates() {
    const { states } = this.dataStore

    if (states) {
      return filter(this.rowFilter)(states)
    }

    return null
  }

  // filter states by endemicity and regime
  get filteredIU() {
    const { ius } = this.dataStore

    if (ius) {
      return filter(this.rowFilter)(ius)
    }

    return null
  }

  // add relations to countries
  get filteredCountriesWithMeta() {
    const countries = this.filteredCountries
    const { relations } = this.dataStore

    if (countries && relations) {
      return addIDRelations({ data: countries, relations, key: 'Country' })
    }

    return null
  }

  // add relations to states
  get filteredStatesWithMeta() {
    const states = this.filteredStates
    const { relations } = this.dataStore

    if (states && relations) {
      return addIDRelations({ data: states, relations, key: 'StateCode' })
    }

    return null
  }

  // add relations to IUs
  get filteredIUsWithMeta() {
    const ius = this.filteredIU
    const { relations } = this.dataStore

    if (ius && relations) {
      return addIDRelations({ data: ius, relations, key: 'IUID' })
    }

    return null
  }

  get countryData() {
    const countries = this.filteredCountriesWithMeta
    const { relations } = this.dataStore

    if (countries && relations) {
      return addRankingAndStats(countries)
    }

    return null
  }

  get stateData() {
    const states = this.filteredStatesWithMeta
    const { relations } = this.dataStore

    if (states && relations) {
      return addRankingAndStats(states)
    }

    return null
  }

  get stateByCountryData() {
    const states = this.filteredStatesWithMeta
    const { relations } = this.dataStore

    if (states && relations) {
      return flow(
        groupBy(x => x.relatedCountries[0]),
        mapValuesFP(addRankingAndStats)
      )(states)
    }

    return null
  }

  get iuData() {
    const ius = this.filteredIUsWithMeta
    const { relations } = this.dataStore

    if (ius && relations) {
      return addRankingAndStats(ius)
    }

    return null
  }

  get countryFeatures() {
    const featureCollection = this.dataStore.featuresLevel0
    const data = this.countryData

    if (featureCollection && data) {
      return mergeFeatures(data, featureCollection, 'ADMIN0ISO3')
    }

    return emptyFeatureCollection
  }

  get stateFeatures() {
    const featureCollection = this.dataStore.featuresLevel1
    const data = this.stateData

    if (featureCollection && data) {
      return mergeFeatures(data, featureCollection, 'ADMIN1ID')
    }

    return emptyFeatureCollection
  }

  get iuFeatures() {
    const featureCollection = this.dataStore.featuresLevel2
    const data = this.iuData

    if (featureCollection && data) {
      return mergeFeatures(data, featureCollection, 'IU_ID')
    }

    return emptyFeatureCollection
  }

  get countrySuggestions() {
    const countries = this.filteredCountriesWithMeta

    if (countries) {
      debugger
      const result = flow(
        map(({ id, name }) => ({ id, name })),
        sortByFP('name')
      )(countries)
      return result
    }

    return []
  }
}

decorate(DataAPI, {
  countryData: computed,
  stateData: computed,
  stateByCountryData: computed,
  iuData: computed,
  countryFeatures: computed,
  stateFeatures: computed,
  iuFeatures: computed,
  filteredCountries: computed,
  filteredStates: computed,
  filteredIU: computed,
  filteredCountriesWithMeta: computed,
  filteredStatesWithMeta: computed,
  filteredIUsWithMeta: computed,
  rowFilter: computed,
  countrySuggestions: computed,
})

export default DataAPI
