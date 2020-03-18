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
  filter,
  mapKeys,
  pickBy as pickByFP,
} from 'lodash/fp'
import { sortBy, pick, pickBy, merge, min, max, zip } from 'lodash'
import config from '../config'

const { precision } = config

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
          p_prevalence: round(p_prevalence * 100, precision),
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

const groupProps = (obj, pattern) =>
  flow(
    pickByFP((value, key) => new RegExp(pattern).test(key)),
    mapKeys(key => key.replace(/[^\d]/g, ''))
  )(obj)

const roundPrevalence = p => round(p * 100, 2)

export function useNewData({ source, Regime, Endemicity, key }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [processed, setProcessed] = useState({})
  const [stats, setStats] = useState({
    prevalence: {
      min: 0,
      max: 0,
    },
  })

  // load data
  useEffect(() => {
    setLoading(true)
    csv(source, autoType).then(result => {
      setData(result)
      setLoading(false)
    })
  }, [source])

  // process data
  useEffect(() => {
    if (!loading) {
      const p = flow(
        filter(!!Endemicity ? { Regime, Endemicity } : { Regime }),
        keyBy(key),
        mapValues(country => {
          const { [key]: id, Population } = country

          const probability = groupProps(country, 'elimination')
          const prev = groupProps(country, 'Prev_')
          const lower = groupProps(country, 'Lower')
          const upper = groupProps(country, 'Upper')

          return {
            id,
            population: round(Population, 0),
            endemicity: country.Endemicity,
            prevalence: mapValues(roundPrevalence)(prev),
            probability,
            lower,
            upper,
          }
        })
      )(data)

      setProcessed(p)
    }
  }, [data, Regime, Endemicity, key, loading])

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

  return { data: processed, stats, loading }
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
