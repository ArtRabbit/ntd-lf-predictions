import React, { Fragment, useState } from 'react'
import { scaleLinear, line } from 'd3'
import { first, last } from 'lodash'

export default function BumpChart({ data, width, height, start, end }) {
  const [selected, setSelected] = useState()

  const xPad = 250
  const yPad = 32
  const svgHeight = height + yPad * 2
  const svgWidth = width + xPad * 2

  const labelOffset = 16

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

        {/* lines */}
        {data.map(({ state, iu_name, ranks }) => {
          const coords = ranks.map(({ year, rank }) => [
            xScale(year),
            yScale(rank)
          ])
          const isSelected = iu_name === selected
          const l = line()(coords)
          return (
            <path
              key={`ranks-${state}-${iu_name}`}
              d={l}
              stroke={isSelected ? 'blue' : '#999'}
              strokeWidth={isSelected ? 2 : 1}
              fill='none'
              onMouseEnter={() => handleEnter(iu_name)}
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
          stroke='#cfcfcf'
        ></line>

        {/* grid */}
        {data.map(({ ranks }) => {
          return ranks.map(({ year, rank, p_prevalence }) => {
            return (
              <g
                key={`circle-${year}-${rank}`}
                transform={`translate(${xScale(year)}, ${yScale(rank)})`}
              >
                <circle
                  r='3'
                  fill={
                    p_prevalence <= 1
                      ? '#12df93'
                      : p_prevalence > 20
                      ? '#ff5e0d'
                      : 'none'
                  }
                ></circle>
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
                fontWeight={
                  iu_name === selected ? 800 : a.p_prevalence <= 1 ? 500 : 300
                }
                x={xScale(a.year) - labelOffset}
                y={yScale(a.rank)}
                textAnchor='end'
                dominantBaseline='middle'
                onMouseEnter={() => handleEnter(iu_name)}
                onMouseLeave={handleLeave}
                fill={iu_name === selected ? 'blue' : 'black'}
              >
                {iu_name} ({a.p_prevalence}%) {a.rank}.
              </text>
              <text
                fontSize='12'
                fontWeight={
                  iu_name === selected ? 800 : b.p_prevalence <= 1 ? 500 : 300
                }
                x={xScale(b.year) + labelOffset}
                y={yScale(b.rank)}
                dominantBaseline='middle'
                onMouseEnter={() => handleEnter(iu_name)}
                onMouseLeave={handleLeave}
                fill={iu_name === selected ? 'blue' : 'black'}
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
