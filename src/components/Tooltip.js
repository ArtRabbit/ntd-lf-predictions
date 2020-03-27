import React from 'react'
import { Tooltip as MuiTooltip } from '@material-ui/core'
import { NO_DATA } from '../constants'

export default function Tooltip({ feature, year, position }) {
  const { name, performance, [`prev-${year}`]: prevalence } = feature.properties
  const [x, y] = position

  const title =
    prevalence !== 'null'
      ? `${name} ${prevalence}% ${
          performance <= 0
            ? '⬇' + -1 * performance + '%'
            : '⬆' + performance + '%'
        }`
      : `${name} ${NO_DATA}`

  return (
    <MuiTooltip title={title} open placement="top">
      <span
        style={{
          position: 'absoulte',
          display: 'inline-block',
          transform: `translate(${x}px,${y - 16}px)`,
        }}
      ></span>
    </MuiTooltip>
  )
}
