import React from 'react'
import { zip, zipObject, map } from 'lodash'
import { scaleLinear, extent, line } from 'd3'

function Path({ data, prop, x, y, color }) {
  const coords = data.map(d => [x(d.ts), y(d[prop])])
  const l = line()(coords)

  return <path d={l} stroke={color} fill="none" strokeWidth="2" />
}

export default function ScenarioGraph({
  data,
  width = 600,
  height = 400,
  showAllResults,
}) {
  const dataSelection = showAllResults ? data.results : [data.results[0]]

  const x = scaleLinear()
    .domain(extent(data.results[0].ts))
    .range([0, width])
    .nice()

  const y = scaleLinear()
    .domain([0, 100])
    .range([height, 0])

  const ticksX = x.ticks()

  const renderResult = d => {
    const { ts, Ms, Ws, Ls } = d
    const series = zip(ts, Ms, Ws, Ls)
    const seriesObj = map(series, x => zipObject(['ts', 'Ms', 'Ws', 'Ls'], x))

    return (
      <>
        <Path data={seriesObj} prop="Ms" x={x} y={y} color="#ff0000" />
        <Path data={seriesObj} prop="Ws" x={x} y={y} color="#00ff00" />
        <Path data={seriesObj} prop="Ls" x={x} y={y} color="#0000ff" />
      </>
    )
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {ticksX.map((t, i) => {
        const xt = x(t)
        return (
          <g key={xt}>
            <line
              key={t}
              x1={xt}
              x2={xt}
              y1={-5}
              y2={height + 15}
              stroke="#D8D8D8"
              {...(i === 0 || i === ticksX.length - 1
                ? {}
                : { strokeDasharray: '4 3' })}
            ></line>
            <text x={xt} y={height - 16} fontSize={12} textAnchor="middle">
              {t}
            </text>
          </g>
        )
      })}

      {dataSelection.map((result, i) => (
        <g key={`results-${i}`}>{renderResult(result)}</g>
      ))}
    </svg>
  )
}
