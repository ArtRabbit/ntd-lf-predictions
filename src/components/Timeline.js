import React, { Fragment, useState } from 'react'
import { scaleLinear, line, scaleSqrt,scalePow } from 'd3'
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

  const height = data.length * 24
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
    .range([2, (width - (rPad + lPad)) / (end - start) / 2])

  const yScale = scaleLinear()
    .domain([0, data.length - 1])
    .range([0, height])

  const handleEnter = id => {
    setSelected(id)
  }
  const handleLeave = () => {
    setSelected(null)
  }

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
                </g>)
           } else if ( year === end ) {
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
              </g>)
           } else {
              const yearOutput = '‘'+year.toString().substr(-2)
              return (<g key={year}>
              <text
                x={xScale(year)}
                y={height + 32}
                textAnchor="middle"
                fontSize="12"
              >
                {yearOutput}
              </text>
              </g>)

           }
        })}


        {/* mark all years */}
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
                //
                //
                return (
                  <circle
                    key={year}
                    fill={
                      prevalence <= 1 ? '#32C2A2'
                    : prevalence >= 6 && prevalence <= 10
                    ? '#A91636'
                    : prevalence > 10
                    ? '#FF4C73'
                    : '#A91636'
                    }
                    fillOpacity={prevalence <= 1 ? .5 : 0.6}
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
