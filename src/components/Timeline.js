import React, { Fragment, useState } from 'react'
import { scaleLinear, line } from 'd3'
import { first, last } from 'lodash'
import { textColor, barColor } from '../utils'

export default function Timeline({ data, width, height, start, end }) {
  const [selected, setSelected] = useState()

  const xPad = 250
  const yPad = 32
  const svgHeight = height + yPad * 2
  const svgWidth = width + xPad * 2

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
      <g transform={`translate(${xPad},${yPad})`}>
        {data[0].ranks.map(({ year }) => (
          <g key={year}>
            <text
              x={xScale(year)}
              y={height + 32}
              textAnchor='middle'
              fontSize='10'
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
          stroke='#cfcfcf'
        ></line>

        {/* bars */}
        {data.map(({ ranks, iu_name }) => {
          const barWidth = width / (ranks.length - 1)
          const finalRank = last(ranks).rank
          const isSelected = iu_name === selected

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
                  height='8'
                  fill={barColor(entry, isSelected)}
                  onMouseEnter={() => handleEnter(iu_name)}
                  onMouseLeave={handleLeave}
                ></rect>
              </g>
            )
          })
        })}

        {/* labels */}
        {data.map(({ state, ranks, iu_name, p_prevalence }) => {
          const a = first(ranks)
          const b = last(ranks)

          return (
            <Fragment key={`label-${state}-${iu_name}`}>
              <text
                fontSize='12'
                fontWeight={iu_name === selected ? 800 : 500}
                x={xScale(a.year) - labelOffset}
                y={yScale(b.rank)}
                textAnchor='end'
                dominantBaseline='middle'
                onMouseEnter={() => handleEnter(iu_name)}
                onMouseLeave={handleLeave}
                fill={textColor(a, iu_name === selected)}
              >
                {a.p_prevalence}%
              </text>
              <text
                fontSize='12'
                fontWeight={iu_name === selected ? 800 : 500}
                x={xScale(b.year) + labelOffset}
                y={yScale(b.rank)}
                dominantBaseline='middle'
                onMouseEnter={() => handleEnter(iu_name)}
                onMouseLeave={handleLeave}
                fill={textColor(b, iu_name === selected)}
              >
                {b.rank}. ({b.p_prevalence}%) {iu_name}
              </text>
            </Fragment>
          )
        })}
      </g>
    </svg>
  )
}
