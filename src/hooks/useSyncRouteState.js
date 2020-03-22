import { useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { useUIState } from './stateHooks'

export default function() {
  const matchSub = useRouteMatch('/:section/:country')
  const matchTop = useRouteMatch('/:section')
  const { country: currentCountry, setCountry } = useUIState()

  useEffect(() => {
    if (matchSub) {
      const { country } = matchSub.params
      if (country !== currentCountry) {
        setCountry(country)
      }
    } else if (matchTop) {
      if (currentCountry) {
        setCountry(null)
      }
    }
  }, [matchSub, matchTop, setCountry, currentCountry])
}
