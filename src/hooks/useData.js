// TODO: remove hook

import { useState, useEffect } from 'react'
import { csv } from 'd3'
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
} from 'lodash/fp'
import { sortBy, pick } from 'lodash'

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
