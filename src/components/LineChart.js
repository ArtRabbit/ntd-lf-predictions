import React, { Fragment, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

import { scaleLinear, line } from 'd3'
import { first, last, flatten, max } from 'lodash'

// TODO: derive start/end from data
const start = 2000
const end = 2030

function LineChart({ data, width, height, clipDomain, yDomain }) {
  const [selected, setSelected] = useState()
  const [selectedYear, setSelectedYear] = useState()
  const lPad = 50
  const rPad = 32
  const yPad = 32
  const svgHeight = height + yPad * 2
  const svgWidth = width

  const labelOffset = 32

  const xScale = scaleLinear()
    .domain([start, end])
    .range([0, width - (rPad + lPad)])

  const domain =
    yDomain || max(flatten(data.map(d => d.ranks.map(r => r.prevalence))))

  const yScale = scaleLinear()
    .domain(clipDomain ? [0, domain] : [0, 100])
    .range([height, 0])

  const yTicks = yScale.ticks(4)
  const xTicks = xScale.ticks(5)

  const handleEnter = id => {
    setSelected(id)
  }
  const handleLeave = () => {
    setSelected(null)
    setSelectedYear(null)
  }

  const handleEnterYear = (year, id) => {
    setSelected(id)
    setSelectedYear(year)
  }

  const y = d => yScale(d.prevalence)
  const nowX = xScale(new Date().getFullYear())
  const startX = xScale(start)
  const endX = xScale(end)
  const yearWidth = xScale(start + 1) - xScale(start)
  const halfYearWidth = Math.round(yearWidth / 2)

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      <g transform={`translate(${lPad},${yPad})`}>
        {/* <rect width={width} height={height} fill="#f0f0f0"></rect> */}

        {/* lable start and end years */}
        {xScale.ticks().map(year => {
          if (year === start) {
            return (
              <g key={start}>
                <text
                  x={startX - halfYearWidth}
                  y={height + 32}
                  textAnchor="left"
                  fontSize="12"
                >
                  {start}
                </text>
              </g>
            )
          } else if (year === end) {
            return (
              <g key={end}>
                <text
                  x={endX - halfYearWidth}
                  y={height + 32}
                  textAnchor="right"
                  fontSize="12"
                >
                  {end}
                </text>
              </g>
            )
          } else {
            const yearOutput = '‘' + year.toString().substr(-2)
            return (
              <g key={year}>
                <text
                  x={xScale(year)}
                  y={height + 32}
                  textAnchor="middle"
                  fontSize="12"
                >
                  {yearOutput}
                </text>
              </g>
            )
          }
        })}

        {xScale.ticks().map(year => {
          if (year === start) {
            return (
              <line
                key={year}
                x1={xScale(year)}
                x2={xScale(year)}
                y1={-5}
                y2={height + 15}
                stroke="#D8D8D8"
              ></line>
            )
          } else if (year === end) {
            return (
              <line
                key={year}
                x1={xScale(year)}
                x2={xScale(year)}
                y1={-5}
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
              y1={-5}
              y2={height + 15}
              stroke="#D8D8D8"
              strokeDasharray="4 3"
            ></line>
          )
        })}

        {/* y-axis labels */}
        {yTicks.map(t => {
          const y = yScale(t)
          return (
            <g key={t}>
              <text
                x={-lPad}
                y={y}
                textAnchor="central"
                dominantBaseline="central"
                fontSize="12"
              >
                {t}%
              </text>
              <line
                x1={0}
                x2={(end - start) * yearWidth}
                y1={y}
                y2={y}
                stroke="#cfcfcf"
                strokeDasharray="4 3"
              ></line>
            </g>
          )
        })}

        {/* mark present */}
        <line x1={nowX} x2={nowX} y1={0} y2={height} stroke="#cfcfcf"></line>

        {/* lines */}
        {data.map(({ state, id, ranks }) => {
          let coords = ranks.map(d => {
            const { year } = d
            return [xScale(year), y(d)]
          })
          coords.push([coords[coords.length - 1][0], height])
          coords.push([0, height])
          coords.push([0, coords[0][1]])
          const l = line()(coords)

          const hoverTargets = ranks.map(d => {
            const { year } = d
            return (
              <line
                key={`${state}-${id}-${year}`}
                x1={xScale(year)}
                x2={xScale(year)}
                y1={-halfYearWidth}
                y2={height + 15}
                strokeWidth={yearWidth}
                stroke="transparent"
                onMouseEnter={() => handleEnterYear(year, id)}
                onMouseLeave={handleLeave}
              ></line>
            )
          })

          const hoverDisplay = ranks.map(d => {
            const { year, rank, prevalence } = d
            if (year !== selectedYear) return null
            return (
              <g
                key={`circle-${year}-${rank}`}
                transform={`translate(${xScale(year)}, ${y(d)})`}
              >
                <circle
                  r="18"
                  fill={
                    prevalence <= 1
                      ? '#4dac26'
                      : prevalence >= 6 && prevalence <= 10
                      ? '#d01c8b'
                      : prevalence > 10
                      ? '#d01c8b'
                      : '#6236FF'
                  }
                ></circle>
                <text
                  x="1"
                  y="5"
                  textAnchor="middle"
                  fill="white"
                  fontSize="12px"
                  fontFamily="Roboto"
                  dy="-1px"
                >{`${prevalence}%`}</text>
              </g>
            )
          })

          return (
            <g key={`${state}-${id}`}>
              <path
                key={`ranks-${state}-${id}`}
                d={l}
                fill="rgba(155,102,255,0.35)"
              />
              {hoverDisplay}
              {hoverTargets}
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export default props => (
  <AutoSizer disableHeight>
    {({ width }) => <LineChart {...props} width={width} />}
  </AutoSizer>
)
