import React, { Fragment, useState } from 'react'
import { scaleLinear, line } from 'd3'
import { first, last, flatten, max } from 'lodash'

// TODO: derive start/end from data
const start = 2000
const end = 2030

export default function SlopeChart({
  data,
  width,
  height,
  clipDomain,
  yDomain,
}) {
  const [selected, setSelected] = useState()

  const xPad = 64
  const yPad = 32
  const svgHeight = height + yPad * 2
  const svgWidth = width + xPad * 2

  const labelOffset = 32

  const xScale = scaleLinear()
    .domain([start, end])
    .range([0, width])

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
  }

  const y = d => yScale(d.prevalence)
  const nowX = xScale(new Date().getFullYear())

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      <g transform={`translate(${xPad},${yPad})`}>
        {/* <rect width={width} height={height} fill="#f0f0f0"></rect> */}

        {/* x-axis labels */}
        {xTicks.map(year => (
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

        {/* y-axis labels */}
        {yTicks.map(t => {
          const y = yScale(t)
          return (
            <g key={t}>
              <text
                x={-16}
                y={y}
                textAnchor="end"
                dominantBaseline="central"
                fontSize="10"
              >
                {t}%
              </text>
              <line x1="0" x2={width} y1={y} y2={y} stroke="#cfcfcf"></line>
            </g>
          )
        })}

        {/* mark present */}
        <line x1={nowX} x2={nowX} y1={0} y2={height} stroke="#cfcfcf"></line>

        {/* lines */}
        {data.map(({ state, id, ranks }) => {
          const coords = ranks.map(d => {
            const { year } = d
            return [xScale(year), y(d)]
          })
          const l = line()(coords)
          return (
            <path
              key={`ranks-${state}-${id}`}
              d={l}
              stroke={id === selected ? 'blue' : '#333'}
              strokeWidth={id === selected ? 2 : 1}
              fill="none"
              onMouseEnter={() => handleEnter(id)}
              onMouseLeave={handleLeave}
            />
          )
        })}

        {/* grid */}
        {data.map(({ ranks }) => {
          return ranks.map(d => {
            const { year, rank, prevalence } = d
            return (
              <g
                key={`circle-${year}-${rank}`}
                transform={`translate(${xScale(year)}, ${y(d)})`}
              >
                <circle
                  r="2"
                  fill={
                    prevalence <= 1
                      ? '#12df93'
                      : prevalence > 20
                      ? '#ff5e0d'
                      : 'none'
                  }
                ></circle>
              </g>
            )
          })
        })}

        {/* labels */}
        {data.map(({ state, ranks, name, id }) => {
          const a = first(ranks)
          const b = last(ranks)

          if (id !== selected) return null

          return (
            <Fragment key={`label-${id}`}>
              <text
                fontSize="12"
                fontWeight="800"
                x={xScale(a.year) - labelOffset}
                y={y(a)}
                textAnchor="end"
                dominantBaseline="central"
                onMouseEnter={() => handleEnter(id)}
                onMouseLeave={handleLeave}
                fill={id === selected ? 'blue' : 'black'}
              >
                {name} ({a.prevalence}%)
              </text>
              <text
                fontSize="12"
                fontWeight="800"
                x={xScale(b.year) + labelOffset}
                y={y(b)}
                dominantBaseline="central"
                onMouseEnter={() => handleEnter(id)}
                onMouseLeave={handleLeave}
                fill={id === selected ? 'blue' : 'black'}
              >
                ({b.prevalence}%) {name}
              </text>
            </Fragment>
          )
        })}
      </g>
    </svg>
  )
}
