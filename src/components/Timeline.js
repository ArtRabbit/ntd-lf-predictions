import React, { Fragment, useState } from 'react'
import { scaleLinear, line } from 'd3'
import { first, last } from 'lodash'
import { textColor, barColor } from '../utils'

// TODO: derive start/end from data
const start = 2000
const end = 2030

export default function Timeline({ data, width }) {
  const [selected, setSelected] = useState()

  const height = data.length * 20
  const lPad = 250
  const rPad = 100
  const yPad = 32
  const svgHeight = height + yPad * 2
  const svgWidth = width + lPad + rPad

  const labelOffset = 32

  const xScale = scaleLinear()
    .domain([start, end])
    .range([0, width])

  const yScale = scaleLinear()
    .domain([data.length, 0])
    .range([height, 0])

  const handleEnter = id => {
    setSelected(id)
  }
  const handleLeave = () => {
    setSelected(null)
  }

  const nowX = xScale(new Date().getFullYear())

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      <g transform={`translate(${lPad},${yPad})`}>
        {xScale.ticks().map(year => (
          <g key={year}>
            <text
              x={xScale(year)}
              y={height + 32}
              textAnchor="middle"
              fontSize="10"
            >
              {year}
            </text>
          </g>
        ))}

        {/* mark present */}
        <line
          x1={nowX}
          x2={nowX}
          y1={0}
          y2={height + 16}
          stroke="#cfcfcf"
        ></line>

        {/* bars */}
        {data.map(({ ranks, id }) => {
          const barWidth = width / (ranks.length - 1)
          const finalRank = last(ranks).rank
          const isSelected = id === selected

          return ranks.map(entry => {
            const { year, rank } = entry
            return (
              <g
                key={`bar-${year}-${rank}`}
                transform={`translate(${xScale(year) - barWidth / 2}, ${yScale(
                  finalRank
                ) - 4})`}
              >
                <rect
                  width={barWidth}
                  height="8"
                  fill={barColor(entry, isSelected)}
                  onMouseEnter={() => handleEnter(id)}
                  onMouseLeave={handleLeave}
                ></rect>
              </g>
            )
          })
        })}

        {/* labels */}
        {data.map(({ state, ranks, id, prevalence, name }) => {
          const a = first(ranks)
          const b = last(ranks)

          return (
            <Fragment key={`label-${state}-${id}`}>
              <text
                fontSize="12"
                fontWeight={id === selected ? 800 : 500}
                x={-lPad}
                y={yScale(b.rank)}
                dominantBaseline="middle"
                onMouseEnter={() => handleEnter(id)}
                onMouseLeave={handleLeave}
                fill={textColor(a, id === selected)}
              >
                {b.rank} {name}
              </text>
              <text
                fontSize="12"
                fontWeight={id === selected ? 800 : 500}
                x={-labelOffset}
                y={yScale(b.rank)}
                textAnchor="end"
                dominantBaseline="middle"
                onMouseEnter={() => handleEnter(id)}
                onMouseLeave={handleLeave}
                fill={textColor(a, id === selected)}
              >
                {a.prevalence}%
              </text>
              <text
                fontSize="12"
                fontWeight={id === selected ? 800 : 500}
                x={xScale(b.year) + labelOffset}
                y={yScale(b.rank)}
                dominantBaseline="middle"
                onMouseEnter={() => handleEnter(id)}
                onMouseLeave={handleLeave}
                fill={textColor(b, id === selected)}
              >
                {b.prevalence}%
              </text>
            </Fragment>
          )
        })}
      </g>
    </svg>
  )
}
