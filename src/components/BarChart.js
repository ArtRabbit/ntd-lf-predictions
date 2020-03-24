import React, { Fragment, useState } from 'react'
import { scaleLinear, line } from 'd3'
import { first, last, sortBy } from 'lodash'
import AutoSizer from 'react-virtualized-auto-sizer'
import { textColor, barColor, rankColor } from '../utils'

// TODO: derive start/end from data
const start = 2000
const end = 2030

function createVerticalAxis(scale, height) {
  return scale.ticks(4).map((prev, i) => {
    const x = scale(prev)
    return (
      <g key={prev}>
        <line
          x1={x}
          x2={x}
          y1={5}
          y2={height + 15}
          stroke={i === 0 ? '#333' : '#D8D8D8'}
          strokeDasharray={`4 ${i === 0 ? 0 : 3}`}
        ></line>
        <text x={x + 4} y={height + 32} textAnchor="middle" fontSize="12">
          {prev} %
        </text>
      </g>
    )
  })
}

function BarChart({ data: d, width }) {
  const data = sortBy(d, element => first(element.ranks).prevalence)

  const [selected, setSelected] = useState()

  const height = data.length * 20
  const lPad = 160
  const rPad = 16
  const yPad = 32
  const svgHeight = height + yPad * 2
  const svgWidth = width
  const graphWidth = width - (rPad + lPad)
  const center = graphWidth / 2
  const labelPlacement = 0 - lPad

  const labelOffset = 0
  //   TODO: derive domain from data
  const domain = [0, 40]

  const xScaleAfter = scaleLinear()
    .domain(domain)
    .range([center + labelOffset, graphWidth])

  const xScaleBefore = scaleLinear()
    .domain(domain)
    .range([center - labelOffset, 0])

  const yScale = scaleLinear()
    .domain([data.length, 0])
    .range([0, height])

  const handleEnter = id => {
    setSelected(id)
  }
  const handleLeave = () => {
    setSelected(null)
  }

  const startX = xScaleAfter(start)
  const endX = xScaleAfter(end)
  const yearWidth = xScaleAfter(start + 1) - xScaleAfter(start)
  const halfYearWidth = Math.round(yearWidth / 2)

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      <g transform={`translate(${lPad},${yPad})`}>
        <text
          fontSize="18"
          fontWeight={800}
          x={xScaleBefore(0) - 32}
          y={-16}
          textAnchor="end"
          dominantBaseline="central"
          fill="#B09AFD"
        >
          2020
        </text>
        <text
          fontSize="18"
          fontWeight={800}
          x={xScaleAfter(0) + 32}
          y={-16}
          textAnchor="start"
          dominantBaseline="central"
          fill="#6236FD"
        >
          2030
        </text>

        {createVerticalAxis(xScaleAfter, height)}
        {createVerticalAxis(xScaleBefore, height)}

        {data.map(({ ranks, id, name }, i) => {
          const prevBefore = first(ranks).prevalence
          const prevAfter = last(ranks).prevalence

          return (
            <g key={`bar-${id}`} transform={`translate(0, ${yScale(i)})`}>
              <line
                x1={xScaleAfter(0)}
                x2={xScaleAfter(prevAfter)}
                y1={0}
                y2={0}
                stroke="#6236FD"
                strokeWidth={8}
              ></line>
              <line
                x1={xScaleBefore(0)}
                x2={xScaleBefore(prevBefore)}
                y1={0}
                y2={0}
                stroke="#B09AFD"
                strokeWidth={8}
              ></line>
              <text
                fontSize="12"
                fontWeight={id === selected ? 800 : 500}
                x={labelPlacement}
                y={0}
                textAnchor="start"
                dominantBaseline="central"
                onMouseEnter={() => handleEnter(id)}
                onMouseLeave={handleLeave}
              >
                {name}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export default props => (
  <AutoSizer disableHeight>
    {({ width }) => <BarChart {...props} width={width} />}
  </AutoSizer>
)
