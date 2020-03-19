import { useState, useEffect } from 'react'
import { csv, autoType } from 'd3'
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
import { sortBy, pick, merge, min, max, zip } from 'lodash'
import config from '../config'

// TODO: remove function
function process(data, filter) {
  const input = data.filter(filter)
  return flow(
    // group all values by year
    groupBy('year'),
    mapValues(byYearValues =>
      // add year and rank
      sortBy(byYearValues, ['p_prevalence', 'iu_name']).map(
        ({ p_prevalence, year, ...rest }, i) => ({
          ...rest,
          year: +year,
          // TODO: leave rounding?
          p_prevalence: round(p_prevalence * 100, 2),
          rank: i + 1,
        })
      )
    ),
    // break up grouping by year (year is sto#ff5e0d in items)
    values,
    flatten,
    // build rank series
    groupBy('iu_code'),
    mapValues(ranksByYear => {
      const ranks = ranksByYear.map(x =>
        pick(x, ['year', 'rank', 'p_prevalence'])
      )
      const { country, state, iu_name, iu_code } = ranksByYear[0]
      return {
        id: iu_code,
        country,
        iu_name,
        state,
        ranks,
      }
    }),
    values
  )(input)
}

// helper that groups columns of the csv into object properties
const groupProps = (obj, pattern) =>
  flow(
    pickByFP((value, key) => new RegExp(pattern).test(key)),
    mapKeys(key => key.replace(/[^\d]/g, ''))
  )(obj)

const roundPrevalence = p => round(p * 100, 2)

// hook that loads data from CSV files
function useCSV(source) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    csv(source, autoType).then(result => {
      setData(result)
      setLoading(false)
    })
  }, [source])

  return { data, loading }
}

export function useNewData({ source, Regime, Endemicity, key, f }) {
  const { data, loading } = useCSV(source)
  const { data: relations, loading: relationsLoading } = useCSV(
    'data/relations.csv'
  )
  const [processed, setProcessed] = useState({})
  const [stats, setStats] = useState({
    prevalence: {
      min: 0,
      max: 0,
    },
  })

  const isLoading = loading || relationsLoading

  // process data
  useEffect(() => {
    if (!isLoading) {
      const groupRelByKey = groupBy(key)(relations)

      const transformed = flow(
        // filtering based on values that are contained in the CSV file
        filter(!!Endemicity ? { Regime, Endemicity } : { Regime }),
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
      const merged = mapValues(x => ({ ...x, ranks: rankings[x.id] }))(
        transformed
      )

      setProcessed(merged)
    }
  }, [data, Regime, Endemicity, key, isLoading, relations, f])

  // create stats
  useEffect(() => {
    const extremes = flow(
      values,
      map(({ prevalence }) => {
        const pValues = values(prevalence)
        return [min(pValues), max(pValues)]
      })
    )(processed)

    const [minN, maxN] = zip(...extremes)

    setStats(state =>
      merge({}, state, {
        prevalence: { min: min(minN) ?? 0, max: max(maxN) ?? 0 },
      })
    )
  }, [processed])

  return { data: processed, stats, loading: isLoading }
}

export function useCountryData(props) {
  const [countries, setCountries] = useState([])
  const { data, stats, loading } = useNewData({
    source: 'data/country-level.csv',
    Regime: 'No MDA',
    key: 'Country',
    ...props,
  })

  //   useEffect(() => {
  //     setCountries(flow()(data))
  //   }, [data])

  return { data, stats, loading }
}

export function useStateData(props) {
  return useNewData({ ...props, source: config.dataSources[1] })
}

export function useIUData(props) {
  return useNewData({ ...props, source: config.dataSources[2] })
}

export function useOldData() {
  const [countryData, setCountryData] = useState([])

  useEffect(() => {
    csv('data/predictive-map-sample-data.csv').then(result => {
      const series = flow(
        groupBy('country'),
        mapValues(states =>
          flow(
            keyBy('state'),
            mapValues(({ country, state }) =>
              process(result, d => d.country === country && d.state === state)
            ),
            entries,
            map(([state, data]) => ({ state, units: data }))
          )(states)
        ),
        entries,
        map(([country, data]) => ({
          country,
          states: data,
          units: process(result, d => d.country === country),
        }))
      )(result)
      setCountryData(series)
    })
  }, [])

  return countryData
}
