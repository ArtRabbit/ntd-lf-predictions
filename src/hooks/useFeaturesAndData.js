import { useEffect, useState } from 'react'
import { interpolateReds, scaleSequential, color } from 'd3'
import { merge, mapValues, isFinite } from 'lodash'

export default function useFeaturesAndData({
  featureCollection,
  data,
  stats,
  key,
  ready,
}) {
  const [merged, setMerged] = useState({
    type: 'FeatureCollection',
    features: [],
  })
  const [ticks, setTicks] = useState([])

  useEffect(() => {
    if (ready) {
      // TODO: add bins
      const colorScale = scaleSequential(interpolateReds)
        .domain([0, stats.prevalence.max])
        .nice(5)

      setTicks(
        colorScale.ticks(5).map(value => ({ value, color: colorScale(value) }))
      )

      setMerged(
        merge({}, featureCollection, {
          features: featureCollection.features.map(feature => {
            // get IU id
            const id = feature.properties[key]
            const prevalenceOverTime = data[id]?.prevalence ?? {}

            // get color from scale if prevalence value available
            const colorsByYear = mapValues(prevalenceOverTime, p_prevalence =>
              isFinite(p_prevalence)
                ? color(colorScale(p_prevalence)).hex()
                : null
            )

            return merge({}, feature, {
              properties: {
                ...colorsByYear,
              },
            })
          }),
        })
      )
    }
  }, [data, featureCollection, stats.prevalence.max, key, ready])

  return { merged, ticks }
}
