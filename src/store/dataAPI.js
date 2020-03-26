import { computed, decorate } from 'mobx'
import centroid from '@turf/centroid'
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
  flatMap,
  every as everyFP,
  mapValues as mapValuesFP,
  pickBy as pickByFP,
  sortBy as sortByFP,
} from 'lodash/fp'
import {
  merge,
  min,
  max,
  zip,
  mapValues,
  first,
  last,
  transform,
  findIndex,
} from 'lodash'
import { color, extent, scaleSymlog, scaleLinear, interpolateHcl } from 'd3'

import {
  REGIME_COVERAGE,
  REGIME_WHO,
  REGIME_FREQUENCY,
  REGIME_NO_MDA,
} from '../constants'

const seq5 = ['#BA455E', '#CB7386', '#DDA2AF', '#EED0D7', '#ffffff']
const seq5b = ['#A91636', '#BA455E', '#CB7386', '#DDA2AF', '#FFFFFF']
const div3 = ['#32C2A2', '#ededed', '#fe4c73']
const div5 = ['#32C2A2', '#84DAC7', '#ededed', '#FFB2C3', '#fe4c73']
const div7 = [
  '#32C2A2',
  '#ADE6DA',
  '#D6F3EC',
  '#0000ff',
  '#DDA2AF',
  '#CB7386',
  '#BA455E',
]

const emptyFeatureCollection = { type: 'FeatureCollection', features: [] }

// helper that groups columns of the csv into object properties
const groupProps = (obj, pattern) =>
  flow(
    pickByFP((value, key) => new RegExp(pattern).test(key)),
    mapKeys(key => key.replace(/[^\d]/g, ''))
  )(obj)

const roundPrevalence = p => round(p * 100, 2)

const buildScales = ({ data, stats }) => {
  //   const prev = scaleSequential(interpolateReds)
  //     .domain([0, stats.prevalence.max])
  //     .nice(5)

  const prev = scaleSymlog()
    .domain([0, stats.prevalence.max])
    .range(['#fff','#d01c8b'])
    .nice()

  const mp = max(stats.performance.map(x => Math.abs(x)))

  const perf = scaleSymlog()
    .domain([-mp, 0.1, 0, 0.1, mp])
    .range(['#4dac26','#fff', '#fff','#fff', '#d01c8b'])
    .interpolate(interpolateHcl)
    .nice()

  //   const perfDiv1 = scaleDiverging([-mp, 0, mp], t => interpolateRdBu(1 - t))
  //   const perfDiv2 = scaleDiverging()
  //     .domain([-mp, 0, mp])
  //     .interpolator(t =>
  //       piecewise(interpolateHcl, ['#32C2A2', '#D6F3EC', '#A91636'])(t)
  //     )

  //   const perfQuantize = scaleQuantize()
  //     .domain([-mp, mp])
  //     .range(steps5)

  //   const perfTresh = scaleThreshold()
  //     .domain([-mp / 2, mp / 2])
  //     .range(steps3)

  return { prev, perf }
}

const defaultScales = {
  prev: () => '#000000',
  perf: () => '#000000',
}

function addRankingAndStats(data) {
  const dataMap = keyBy('id')(data)

  // create entries for each prevalence value and year
  const prevByYear = flow(
    flatMap(({ prevalence, id }) => {
      return entries(prevalence).map(([year, prevalence]) => ({
        year,
        prevalence,
        id,
      }))
    }),
    groupBy('year')
  )(data)

  // sort entries and add ranks
  const sortedPrev = transform(
    prevByYear,
    (result, value, year, data) => {
      const prevYear = (parseInt(year) - 1).toString()
      const sorted = sortByFP([
        x => x.prevalence,
        x => findIndex(result[prevYear], ['id', x.id]),
        x => dataMap[x.id].name,
      ])(value)
      result[year] = sorted.map((x, i) => ({
        ...x,
        year: +x.year,
        rank: i + 1,
      }))
    },
    {}
  )

  // group entries by ID
  const sortedPrevByID = flow(
    values,
    flatten,
    groupBy('id'),
    mapValuesFP(map(omit('id')))
  )(sortedPrev)

  // add rankings and performance (delta start to end) to entries
  const processed = mapValuesFP(x => {
    const ranks = sortedPrevByID[x.id]
    // check if prevalence series contains NaN values
    const isValid = flow(
      values,
      map(x => isFinite(x.prevalence)),
      everyFP(x => x)
    )(ranks)

    if (isValid) {
      const pValues = ranks.map(x => x.prevalence)
      const performance = last(pValues) - first(pValues)
      return { ...x, ranks, performance }
    }

    return { ...x, ranks: null, performance: null }
  })(dataMap)

  // create prevalence stats
  const prevExtent = flow(
    values,
    map(({ prevalence }) => {
      const pValues = values(prevalence)
      return [min(pValues), max(pValues)]
    })
  )(processed)

  const [minN, maxN] = zip(...prevExtent)

  // create performance stats
  const performances = flow(values, map('performance'))(processed)

  const stats = {
    //   TODO: use array for prevalence extent (more consistent)
    prevalence: { min: min(minN) ?? 0, max: max(maxN) ?? 0 },
    performance: extent(performances),
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

function mergeFeatures({ data, featureCollection, key, scales }) {
  const { prev, perf } = scales
  const features = featureCollection.features
    // only take features, which are in the data
    .filter(feature => {
      const id = feature.properties[key]
      return data[id] ?? false
    })
    .map(feature => {
      const id = feature.properties[key]
      const featureData = data[id]
      const { performance } = featureData
      const prevalenceOverTime = featureData?.prevalence ?? {}
      const population = featureData?.population ?? '–'
      const endemicity = featureData?.endemicity ?? '–'

      // get color from scale if prevalence value available
      const colorsByYear = mapValues(prevalenceOverTime, p_prevalence =>
        isFinite(p_prevalence) ? color(prev(p_prevalence)).hex() : null
      )

      return merge({}, feature, {
        properties: {
          ...mapKeys(year => `color-${year}`)(colorsByYear),
          ...mapKeys(year => `prev-${year}`)(prevalenceOverTime),
          performance,
          'color-perf': perf(performance),
          endemicity,
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
    const { country } = this.uiState

    if (states && relations) {
      const stateSelection = country
        ? filter(['relatedCountries.0', country])(states)
        : states
      return addRankingAndStats(stateSelection)
    }

    return null
  }

  // returns all states grouped by country
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

  // returns all IUs grouped by state for the selected country
  get iuByStateData() {
    const IUs = this.filteredIUsWithMeta
    const { country } = this.uiState
    const { relations } = this.dataStore

    if (IUs && relations) {
      return flow(
        filter(x => x.relatedCountries[0] === country),
        groupBy(x => x.relatedStates[0]),
        mapValuesFP(addRankingAndStats)
      )(IUs)
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
    const countries = this.countryData
    const scales = this.countryScales

    if (featureCollection && countries) {
      const { data } = countries
      return mergeFeatures({
        data,
        featureCollection,
        key: 'ADMIN0ISO3',
        scales,
      })
    }

    return emptyFeatureCollection
  }

  get countryCentroids() {
    const countries = this.countryFeatures

    if (countries) {
      const centroids = {
        ...countries,
        features: countries.features.map(f => {
          const population = f.properties.population
          const c = centroid(f)
          return merge({}, c, { properties: { population } })
        }),
      }
      return centroids
    }

    return emptyFeatureCollection
  }

  get stateFeatures() {
    const featureCollection = this.dataStore.featuresLevel1
    const states = this.stateData
    const { country } = this.uiState
    const scales = this.stateScales

    if (featureCollection && states) {
      const { data } = states

      return mergeFeatures({
        data: country
          ? pickByFP(x => x.relatedCountries.includes(country))(data)
          : data,
        featureCollection,
        key: 'ADMIN1ID',
        scales,
      })
    }

    return emptyFeatureCollection
  }

  get iuFeatures() {
    const featureCollection = this.dataStore.featuresLevel2
    const IUs = this.iuData
    const scales = this.iuScales
    const { country } = this.uiState

    if (featureCollection && IUs) {
      const { data } = IUs
      return mergeFeatures({
        data: country
          ? pickByFP(x => x.relatedCountries.includes(country))(data)
          : data,
        featureCollection,
        key: 'IU_ID',
        scales,
      })
    }

    return emptyFeatureCollection
  }

  get countryScales() {
    const countries = this.countryData
    if (countries) return buildScales(countries)
    return defaultScales
  }

  get stateScales() {
    const states = this.stateData
    if (states) return buildScales(states)
    return defaultScales
  }

  get iuScales() {
    const IUs = this.iuData
    if (IUs) return buildScales(IUs)
    return defaultScales
  }

  get countrySuggestions() {
    const countries = this.filteredCountriesWithMeta

    if (countries) {
      const result = flow(
        map(({ id, name }) => ({ id, name })),
        sortByFP('name')
      )(countries)
      return result
    }

    return []
  }

  get selectedCountry() {
    const { country } = this.uiState
    const countryMap = this.countryData

    if (country && countryMap) {
      const selected = countryMap.data[country]
      return selected
    }

    return null
  }

  get regimes() {
    return [REGIME_NO_MDA, REGIME_WHO, REGIME_COVERAGE, REGIME_FREQUENCY]
  }
}

decorate(DataAPI, {
  countryData: computed,
  stateData: computed,
  stateByCountryData: computed,
  iuByStateData: computed,
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
  regimes: computed,
  selectedCountry: computed,
  countryCentroids: computed,
  countryScales: computed,
  stateScales: computed,
  iuScales: computed,
})

export default DataAPI
