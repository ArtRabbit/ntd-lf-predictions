import { useEffect, useState } from 'react'
import { merge } from 'lodash'

export default function useFeatureCollection(file) {
  const [loading, setLoading] = useState(false)
  const [featureCollection, setFeatureCollection] = useState({
    type: 'FeatureCollection',
    features: []
  })

  useEffect(() => {
    let mounted = true
    setLoading(true)

    fetch(file)
      .then(response => response.json())
      .then(({ features }) => {
        // standardize IDs
        const featuresWithID = features.map(f => {
          const {
            ADMIN0,
            ADMIN1,
            IUs_NAME,
            ADMIN0ISO3,
            ADMIN1ID,
            IU_ID
          } = f.properties
          const name = ADMIN0 || ADMIN1 || IUs_NAME
          const id = ADMIN0ISO3 || ADMIN1ID || IU_ID
          return merge({}, f, { properties: { id, name } })
        })

        if (mounted) {
          setFeatureCollection({
            type: 'FeatureCollection',
            features: featuresWithID
          })
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [file])

  return { featureCollection, loading }
}
