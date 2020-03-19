import { useMemo } from 'react'
import { map, flatten, keyBy, mapValues } from 'lodash'
import { useOldData } from './useData'

// creates a map of all units and adds `byYear` prop to each unit, which contains rank values as a map (by year)
export default () => {
  const data = useOldData()
  return useMemo(
    () =>
      mapValues(keyBy(flatten(map(data, 'units')), 'id'), unit => ({
        ...unit,
        byYear: keyBy(unit.ranks, 'year')
      })),
    [data]
  )
}
