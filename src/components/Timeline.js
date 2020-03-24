import React, { Fragment, useState } from 'react'
import { scaleLinear, line, scaleSqrt } from 'd3'
import { first, last, sortBy } from 'lodash'
import AutoSizer from 'react-virtualized-auto-sizer'
import { textColor, barColor, rankColor } from '../utils'

// TODO: derive start/end from data
const start = 2000
const end = 2030

function Timeline({ dataAndStats, width }) {
  const { data: dataMap, stats } = dataAndStats
  const { min: pMin, max: pMax } = stats.prevalence

  const data = sortBy(Object.values(dataMap), 'name')

  const [selected, setSelected] = useState()

  const height = data.length * 20
  const lPad = 200
  const rPad = 32
  const yPad = 32
  const svgHeight = height + yPad * 2
  const svgWidth = width

  const xScale = scaleLinear()
    .domain([start, end])
    .range([0, width - (rPad + lPad)])

  const radiusScale = scaleSqrt()
    .domain([pMin, pMax])
    .range([0, (width - (rPad + lPad)) / (end - start) / 2])

  const yScale = scaleLinear()
    .domain([0, data.length - 1])
    .range([0, height])

  const handleEnter = id => {
    setSelected(id)
  }
  const handleLeave = () => {
    setSelected(null)
  }

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      <g transform={`translate(${lPad},${yPad})`}>
        {/* mark all years */}
        {xScale.ticks().map(year => {
          return (
            <text
              key={year}
              x={xScale(year)}
              y={height + 32}
              textAnchor="middle"
              fontSize="12"
            >
              {year}
            </text>
          )
        })}

        {/* symbols */}
        {data.map(({ ranks, id, name }, i) => {
          return (
            <g key={name} transform={`translate(${0},${yScale(i)})`}>
              <text
                fontSize="12"
                fontWeight="500"
                x={-lPad}
                y={0}
                textAnchor="start"
                dominantBaseline="central"
                onMouseEnter={() => handleEnter(id)}
                onMouseLeave={handleLeave}
              >
                {name}
              </text>
              {ranks.map(({ year, prevalence }) => {
                return (
                  <circle
                    key={year}
                    fill={prevalence <= 1 ? '#03D386' : '#6236FD'}
                    fillOpacity={0.7}
                    r={radiusScale(prevalence)}
                    cx={xScale(year)}
                  ></circle>
                )
              })}
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export default props => (
  <AutoSizer disableHeight>
    {({ width }) => <Timeline {...props} width={width} />}
  </AutoSizer>
)
