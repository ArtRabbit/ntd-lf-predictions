import React, { Fragment, useState } from 'react'
import { scaleLinear, line } from 'd3'
import { first, last } from 'lodash'
import AutoSizer from 'react-virtualized-auto-sizer'

// TODO: derive start/end from data
const start = 2000
const end = 2030

function BumpChart({ data, width }) {
  const [selected, setSelected] = useState()

  const height = data.length * 30
  const xPad = 200
  const yPad = 32
  const svgHeight = height + yPad * 2
  const svgWidth = width

  const labelOffset = 16

  const xScale = scaleLinear()
    .domain([start, end])
    .range([0, width - xPad * 2])

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
      <g transform={`translate(${xPad},${0})`}>
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

        {/* lines */}
        {data.map(({ state, id, ranks }) => {
          const coords = ranks.map(({ year, rank }) => [
            xScale(year),
            yScale(rank),
          ])
          const isSelected = id === selected
          const l = line()(coords)
          return (
            <path
              key={`ranks-${state}-${id}`}
              d={l}
              stroke={isSelected ? 'blue' : '#999'}
              strokeWidth={isSelected ? 2 : 1}
              fill="none"
              onMouseEnter={() => handleEnter(id)}
              onMouseLeave={handleLeave}
            />
          )
        })}

        {/* mark present */}
        <line
          x1={nowX}
          x2={nowX}
          y1={0}
          y2={height + 16}
          stroke="#cfcfcf"
        ></line>

        {/* grid */}
        {data.map(({ ranks }) => {
          return ranks.map(({ year, rank, prevalence }) => {
            return (
              <g
                key={`circle-${year}-${rank}`}
                transform={`translate(${xScale(year)}, ${yScale(rank)})`}
              >
                <circle
                  r="3"
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
        {data.map(({ state, ranks, id, prevalence, name }) => {
          const a = first(ranks)
          const b = last(ranks)

          return (
            <Fragment key={`label-${state}-${id}`}>
              <text
                fontSize="12"
                fontWeight={
                  id === selected ? 800 : a.prevalence <= 1 ? 500 : 300
                }
                x={xScale(a.year) - labelOffset}
                y={yScale(a.rank)}
                textAnchor="end"
                dominantBaseline="central"
                onMouseEnter={() => handleEnter(id)}
                onMouseLeave={handleLeave}
                fill={id === selected ? 'blue' : 'black'}
              >
                {name} ({a.prevalence}%) {a.rank}.
              </text>
              <text
                fontSize="12"
                fontWeight={
                  id === selected ? 800 : b.prevalence <= 1 ? 500 : 300
                }
                x={xScale(b.year) + labelOffset}
                y={yScale(b.rank)}
                dominantBaseline="central"
                onMouseEnter={() => handleEnter(id)}
                onMouseLeave={handleLeave}
                fill={id === selected ? 'blue' : 'black'}
              >
                {b.rank}. ({b.prevalence}%) {name}
              </text>
            </Fragment>
          )
        })}
      </g>
    </svg>
  )
}

export default props => (
  <AutoSizer disableHeight>
    {({ width }) => <BumpChart {...props} width={width} />}
  </AutoSizer>
)
