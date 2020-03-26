import React, { Fragment, useState } from 'react'
import { scaleLinear, line } from 'd3'
import { first, last } from 'lodash'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
  },
}))

// TODO: derive start/end from data
const start = 2000
const end = 2030

function BumpChart({ data, width }) {
  const [selected, setSelected] = useState()
  const [hover, setHover] = useState()
  const classes = useStyles()

  const height = data.length * 30
  const lPad = 170
  const rPad = 32
  const yPad = 32
  const svgHeight = height + yPad * 2
  const svgWidth = width

  const labelOffset = 16

  const xScale = scaleLinear()
    .domain([start, end])
    .range([0, width - lPad * 2])

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
  const yearWidth = xScale(start + 1) - xScale(start)
  const halfYearWidth = Math.round(yearWidth / 2)

  return (
    <div className={classes.root}>
      {hover && (
        <Tooltip
          title={hover.value}
          open
          placement="top"
          className={classes.tooltip}
          style={{
            transform: `translate(${hover.x + lPad}px,${hover.y}px)`,
          }}
        >
          <div></div>
        </Tooltip>
      )}
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        <g transform={`translate(${lPad},${0})`}>
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
                  y1={0}
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
                  y1={0}
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
                y1={0}
                y2={height + 15}
                stroke="#D8D8D8"
                strokeDasharray="4 3"
              ></line>
            )
          })}

          {/* lines */}
          {data.map(({ state, id, ranks }) => {
            const coords = ranks.map(({ year, rank }) => [
              xScale(year),
              yScale(rank),
            ])
            const isSelected = id === selected
            const l = line()(coords)
            return (
              <g key={`ranks-${state}-${id}`}>
                <path
                  d={l}
                  stroke={isSelected ? '#6236FF' : '#aaa'}
                  strokeWidth={isSelected ? 3 : 1}
                  fill="none"
                />
                <path
                  d={l}
                  stroke="transparent"
                  strokeWidth={25}
                  fill="none"
                  onMouseEnter={() => handleEnter(id)}
                  onMouseLeave={handleLeave}
                />
              </g>
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
              const x = xScale(year)
              const y = yScale(rank)
              return (
                <g
                  key={`circle-${year}-${rank}`}
                  transform={`translate(${x}, ${y})`}
                >
                  <circle
                    onMouseEnter={e =>
                      setHover({ x, y, value: `${year}: ${prevalence} %` })
                    }
                    onMouseLeave={e => setHover(null)}
                    r={prevalence > 5 ? 4 : 4}
                    fillOpacity={prevalence < 1 || prevalence > 5 ? 1 : 0.3}
                    fill={
                      prevalence < 1
                        ? '#4dac26'
                        : prevalence >= 6 && prevalence <= 10
                        ? '#d01c8b'
                        : prevalence > 10
                        ? '#d01c8b'
                        : '#f1b6da'
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
            const rankOutput = a.rank.toString().padStart(2, '0')
            const rankOutputB = b.rank.toString().padStart(2, '0')

            return (
              <Fragment key={`label-${state}-${id}`}>
                <text
                  fontSize="12"
                  x={-lPad}
                  y={yScale(a.rank)}
                  textAnchor="start"
                  fontWeight="500"
                  dominantBaseline="central"
                  onMouseEnter={() => handleEnter(id)}
                  onMouseLeave={handleLeave}
                  fill={id === selected ? '#6236FF' : 'black'}
                >
                  <tspan fill={id === selected ? '#6236FF' : '#616161'}>
                    {rankOutput}
                  </tspan>
                  <tspan dx={5}>
                    {name} ({a.prevalence}%)
                  </tspan>
                </text>
                <text
                  fontSize="12"
                  dx={5}
                  x={xScale(b.year) + labelOffset}
                  y={yScale(b.rank)}
                  fontWeight="500"
                  dominantBaseline="central"
                  onMouseEnter={() => handleEnter(id)}
                  onMouseLeave={handleLeave}
                  fill={id === selected ? '#6236FF' : 'black'}
                >
                  <tspan fill={id === selected ? '#6236FF' : '#616161'}>
                    {rankOutputB}
                  </tspan>
                  <tspan dx={5}>
                    {name} ({b.prevalence}%)
                  </tspan>
                </text>
              </Fragment>
            )
          })}
        </g>
      </svg>
    </div>
  )
}

export default props => (
  <AutoSizer disableHeight>
    {({ width }) => <BumpChart {...props} width={width} />}
  </AutoSizer>
)