import { computed, decorate } from 'mobx'
import {
  mapValues,
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
  pickBy as pickByFP,
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
import { interpolateReds, scaleSequential, color } from 'd3'

// helper that groups columns of the csv into object properties
const groupProps = (obj, pattern) =>
  flow(
    pickByFP((value, key) => new RegExp(pattern).test(key)),
    mapKeys(key => key.replace(/[^\d]/g, ''))
  )(obj)

const roundPrevalence = p => round(p * 100, 2)

function process({ data, relations, key, regime, endemicity, f }) {
  // process data
  const groupRelByKey = groupBy(key)(relations)

  const transformed = flow(
    // filtering based on values that are contained in the CSV file
    filter(
      !!endemicity
        ? { Regime: regime, Endemicity: endemicity }
        : { Regime: regime }
    ),
    keyBy(key),
    mapValues(row => {
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

      return {
        id,
        name,
        population: round(Population, 0),
        endemicity: row.Endemicity,
        prevalence: mapValues(roundPrevalence)(prev),
        probability,
        lower,
        upper,
        relatedCountries,
        relatedStates,
        relatedIU,
      }
    }),
    values,
    filter(f),
    keyBy('id')
  )(data)

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
    mapValues(v =>
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
    mapValues(ranks => map(omit('id'))(ranks))
  )(transformed)

  // add rankings to entries
  const processed = mapValues(x => ({ ...x, ranks: rankings[x.id] }))(
    transformed
  )

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

class DataAPI {
  constructor(rootStore) {
    this.dataStore = rootStore.dataStore
    this.uiState = rootStore.uiState
  }

  get countryData() {
    const { countries, relations } = this.dataStore
    const { regime, endemicity } = this.uiState

    if (countries && relations) {
      // TODO: add filtering
      return process({
        data: countries,
        relations,
        key: 'Country',
        regime,
        endemicity,
      })
    }

    return null
  }

  get stateData() {
    const { states, relations } = this.dataStore
    const { regime, endemicity } = this.uiState

    if (states && relations) {
      // TODO: add filtering
      return process({
        data: states,
        relations,
        key: 'StateCode',
        regime,
        endemicity,
      })
    }

    return null
  }

  get iuData() {
    const { ius, relations } = this.dataStore
    const { regime, endemicity } = this.uiState

    if (ius && relations) {
      // TODO: add filtering
      return process({
        data: ius,
        relations,
        key: 'IUID',
        regime,
        endemicity,
      })
    }

    return null
  }

  get countryFeatures() {
    const featureCollection = this.dataStore.featuresLevel0
    const cData = this.countryData
    const key = 'ADMIN0ISO3'

    if (featureCollection && cData) {
      const { data, stats } = cData

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
        const prevalenceOverTime = data[id]?.prevalence ?? {}

        // get color from scale if prevalence value available
        const colorsByYear = mapValuesS(prevalenceOverTime, p_prevalence =>
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

    return { type: 'FeatureCollection', features: [] }
  }

  //   TODO: combine with countryFeatures
  get stateFeatures() {
    const featureCollection = this.dataStore.featuresLevel1
    const cData = this.stateData
    const key = 'ADMIN1ID'

    if (featureCollection && cData) {
      const { data, stats } = cData

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
        const prevalenceOverTime = data[id]?.prevalence ?? {}

        // get color from scale if prevalence value available
        const colorsByYear = mapValuesS(prevalenceOverTime, p_prevalence =>
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

    return { type: 'FeatureCollection', features: [] }
  }
}

decorate(DataAPI, {
  // getData: computed,
  countryData: computed,
  stateData: computed,
  iuData: computed,
  countryFeatures: computed,
  stateFeatures: computed,
})

export default DataAPI
