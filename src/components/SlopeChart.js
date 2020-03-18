import React, { Fragment, useState } from 'react'
import { scaleLinear, line } from 'd3'
import { first, last, orderBy, flatten, max } from 'lodash'
import { slopeColor } from '../utils'

export default function SlopeChart({
  data,
  width,
  height,
  start,
  end,
  clipDomain
}) {
  const [selected, setSelected] = useState()

  const lPad = 64
  const rPad = 200
  const xPad = lPad + rPad
  const yPad = 32
  const svgHeight = height + yPad * 2
  const svgWidth = width + xPad

  const labelOffset = 32

  const xScale = scaleLinear()
    .domain([start, end])
    .range([0, width])

  const domain = max(flatten(data.map(d => d.ranks.map(r => r.p_prevalence))))

  const yScale = scaleLinear()
    .domain(clipDomain ? [0, domain] : [0, 100])
    .range([height, 0])

  const yTicks = yScale.ticks(5)

  const handleEnter = id => {
    setSelected(id)
  }
  const handleLeave = () => {
    setSelected(null)
  }

  const y = d => yScale(d.p_prevalence)

  return (
    <div>
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        <g transform={`translate(${lPad},${yPad})`}>
          <rect width={width} height={height} fill='#f0f0f0'></rect>

          {/* x-axis labels */}

          {[start, end].map(year => (
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

          {/* y-axis labels */}
          {yTicks.map(t => {
            const y = yScale(t)
            return (
              <g key={t}>
                <text x={-16} y={y} textAnchor='end' fontSize='10'>
                  {t}%
                </text>
                <line x1='0' x2={width} y1={y} y2={y} stroke='#cfcfcf'></line>
              </g>
            )
          })}

          {/* lines */}
          {orderBy(data, x => last(x.ranks).p_prevalence, 'desc').map(
            ({ state, iu_name, ranks }) => {
              const a = first(ranks)
              const b = last(ranks)
              const coords = [a, b].map(d => {
                const { year } = d
                return [xScale(year), y(d)]
              })
              const l = line()(coords)

              return (
                <path
                  key={`ranks-${state}-${iu_name}`}
                  d={l}
                  stroke={slopeColor(a, b, iu_name === selected)}
                  strokeWidth={iu_name === selected ? 2 : 1}
                  fill='none'
                  onMouseEnter={() => handleEnter(iu_name)}
                  onMouseLeave={handleLeave}
                />
              )
            }
          )}

          {/* labels */}
          {data.map(({ state, ranks, iu_name }) => {
            const a = first(ranks)
            const b = last(ranks)

            if (iu_name !== selected) return null

            return (
              <Fragment key={`label-${state}-${iu_name}`}>
                <text
                  fontSize='12'
                  fontWeight='800'
                  x={xScale(a.year) - labelOffset}
                  y={y(a)}
                  textAnchor='end'
                  dominantBaseline='middle'
                  onMouseEnter={() => handleEnter(iu_name)}
                  onMouseLeave={handleLeave}
                  fill={iu_name === selected ? 'blue' : 'black'}
                >
                  {a.p_prevalence}%
                </text>
                <text
                  fontSize='12'
                  fontWeight='800'
                  x={xScale(b.year) + labelOffset}
                  y={y(b)}
                  dominantBaseline='middle'
                  onMouseEnter={() => handleEnter(iu_name)}
                  onMouseLeave={handleLeave}
                  fill={iu_name === selected ? 'blue' : 'black'}
                >
                  {b.p_prevalence}% {iu_name}
                </text>
              </Fragment>
            )
          })}
        </g>
      </svg>
      <div style={{ fontSize: 12, paddingTop: 16, lineHeight: 2 }}>
        <div style={{ color: '#ff5e0d' }}>prevalence increasing</div>
        <div style={{ color: '#12df93' }}>{`prevalence <= 1% by ${end}`}</div>
      </div>
    </div>
  )
}
