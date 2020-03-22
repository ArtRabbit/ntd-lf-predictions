import React, { Fragment, useState } from 'react'
import { scaleLinear, line } from 'd3'
import { first, last } from 'lodash'
import { textColor, barColor, rankColor } from '../utils'

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
  const startX = xScale(start)
  const endX = xScale(end)
  const yearWidth = xScale(start+1) - xScale(start)
  const halfYearWidth = Math.round(yearWidth/2)

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      <g transform={`translate(${lPad},${yPad})`}>

        {/* lable start and end years */}
        <g key={start}>
            <text
              x={startX-halfYearWidth}
              y={height + 32}
              textAnchor="left"
              fontSize="12"
            >
              {start}
            </text>
        </g>
        <g key={end}>
            <text
              x={endX-halfYearWidth}
              y={height + 32}
              textAnchor="right"
              fontSize="12"
            >
              {end}
            </text>
        </g>

        

        {/* mark all years */}
        {xScale.ticks().map(year => {
            if ( year === start) {
              return (
                <line
                  key={year}
                  x1={xScale(year)-halfYearWidth}
                  x2={xScale(year)-halfYearWidth}
                  y1={5}
                  y2={height + 15}
                  stroke="#D8D8D8"
                ></line>
              )
            } else if ( year === end ) {
              return (
                <line
                  key={year}
                  x1={xScale(year)+halfYearWidth}
                  x2={xScale(year)+halfYearWidth}
                  y1={5}
                  y2={height + 15}
                  stroke="#D8D8D8"
                ></line>
              )
            }
            return (
              <line
                key={year}
                x1={xScale(year)}
                x2={xScale(year)}
                y1={5}
                y2={height + 15}
                stroke="#D8D8D8"
                strokeDasharray="4 3"
              ></line>
            )
          })}

        

        

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
                textAnchor="start"
                dominantBaseline="middle"
                onMouseEnter={() => handleEnter(id)}
                onMouseLeave={handleLeave}
                
              >
                <tspan
                  fill={rankColor(a, id === selected)}
                >{b.rank}</tspan>
                <tspan
                  fill={textColor(a, id === selected)}
                  x={-lPad+40}
                >{name}</tspan>
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
