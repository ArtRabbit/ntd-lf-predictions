import React from 'react'
import { zip, zipObject, map, flatten, flattenDeep, pick, values } from 'lodash'
import { scaleLinear, extent, line } from 'd3'
import AutoSizer from 'react-virtualized-auto-sizer'

function Path({ data, prop, x, y, color }) {
  const coords = data.map(d => [x(d.ts), y(d[prop])])
  const l = line()(coords)

  return <path d={l} stroke={color} fill="none" strokeWidth="2" />
}

function ScenarioGraph({
  data,
  width = 600,
  height = 400,
  metrics = ['Ms', 'Ws', 'Ls'],
  showAllResults,
  inputs,
}) {
  const dataSelection = showAllResults ? data.results : [data.results[0]]
  const domainX = extent(flatten(map(dataSelection, 'ts')))
  const domainY = extent(
    flattenDeep(map(dataSelection, x => values(pick(x, metrics))))
  )

  const lPad = 50
  const rPad = 32
  const tPad = 20
  const yPad = 32
  const svgHeight = height + yPad * 2
  const svgWidth = width

  const x = scaleLinear()
    .domain(domainX)
    .range([0, width])
    .nice()

  const y = scaleLinear()
    .domain(domainY)
    .range([height, 0])
    .nice()

  const ticksX = x.ticks()
  const ticksY = y.ticks()

  const renderResult = d => {
    const { ts, Ms, Ws, Ls } = d
    const series = zip(ts, Ms, Ws, Ls)
    const seriesObj = map(series, x => zipObject(['ts', 'Ms', 'Ws', 'Ls'], x))

    return (
      <>
        {metrics.map(m => (
          <Path key={m} data={seriesObj} prop={m} x={x} y={y} color="#6236FF" />
        ))}
      </>
    )
  }

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      <g transform={`translate(${lPad},${yPad})`}>
        {ticksX.map((t, i) => {
          const xt = x(t)
          return (
            <g key={xt}>
              <line
                key={t}
                x1={xt}
                x2={xt}
                y1={-5}
                y2={height}
                stroke="#D8D8D8"
                {...(i === 0 || i === ticksX.length - 1
                  ? {}
                  : { strokeDasharray: '4 3' })}
              ></line>
              <text x={xt} y={height + yPad} fontSize={12} textAnchor="middle">
                {t}
              </text>
            </g>
          )
        })}
        {ticksY.map((t, i) => {
          const yt = y(t)
          return (
            <g key={yt}>
              <line
                key={t}
                x1={0}
                x2={width - lPad}
                y1={yt}
                y2={yt}
                stroke="#D8D8D8"
                {...(i === 0 || i === ticksY.length - 1
                  ? {}
                  : { strokeDasharray: '4 3' })}
              ></line>
              <text x={-rPad} y={yt + 4} fontSize={12} textAnchor="middle">
                {`${t}%`}
              </text>
            </g>
          )
        })}

        {dataSelection.map((result, i) => (
          <g key={`results-${i}`}>{renderResult(result)}</g>
        ))}
      </g>
    </svg>
  )
}

export default props => (
  <AutoSizer disableHeight>
    {({ width }) => <ScenarioGraph {...props} width={width} />}
  </AutoSizer>
)
