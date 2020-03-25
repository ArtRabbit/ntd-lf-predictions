import React, { Fragment, useState } from 'react'
import { scaleLinear, line } from 'd3'
import { Tooltip } from '@material-ui/core'

import { first, last, orderBy, flatten, max, find } from 'lodash'
import { slopeColor } from '../utils'

function SlopeChart({
  data,
  width,
  height,
  start,
  end,
  clipDomain,
  showLegend,
  showAxis,
  showInfo,
  setSelectedSlope,
  countryKey,
  name,
  svgPadding = [16, 0, 16, 0],
}) {
  const [selected, setSelected ] = useState()
  const [hover , setHover] = useState()
  const [tPad, rPad, bPad, lPad] = svgPadding
  const svgWidth = width + lPad + rPad
  const svgHeight = height + tPad + bPad

  const labelOffset = 0


  const xScale = scaleLinear()
    .domain([start, end])
    .range([lPad, width - rPad-lPad])

  const domain = max(flatten(data.map(d => d.ranks.map(r => r.prevalence))))

  const yScale = scaleLinear()
    .domain(clipDomain ? [0, domain] : [0, 100])
    .range([height-bPad-tPad, tPad])

  const yTicks = yScale.ticks(5)

  const handleEnter = id => {
    setSelected(id)
  }
  const handleLeave = () => {
    setSelected(null)
  }

  const handleEnterSlope = () => {
    setHover(true)
  }
  const handleLeaveSlope = () => {
    setHover(false)
  }

  const y = d => yScale(d.prevalence)
  const selectedLabel = find(data,{id:selected}) ? find(data,{id:selected}).name : ''

  return (
    <div>
      {hover && <Tooltip
            title={`${name}`}
            open
            placement="top"
          >
            <span
              style={{
                position: 'absoulte',
                display: 'inline-block',
                transform: `translate(${width/2}px,${-height/2}px)`,
              }}
            ></span>
          </Tooltip>}
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        onClick={() => { if ( setSelectedSlope ) setSelectedSlope(countryKey) } }
        onMouseEnter={() => {
         if (!showAxis )  handleEnterSlope()
        }}
        onMouseLeave={() => {
          if (!showAxis) handleLeaveSlope()
        }}
      >
        <g transform={`translate(${lPad},${rPad})`}>
          

          {/* x-axis labels */}
          <line x1={lPad} x2={lPad} y1={tPad} y2={height - bPad} stroke={ hover === true ? '#6236FF' : '#D8D8D8' }></line>
          <line x1={width-lPad-rPad} x2={width-lPad-rPad} y1={tPad} y2={height - bPad} stroke={ hover === true ? '#6236FF' : '#D8D8D8' }></line>
          <line x1={lPad} x2={width-lPad-rPad} y1={tPad} y2={tPad} stroke="#D8D8D8"></line>
          <line x1={lPad} x2={width-lPad-rPad} y1={height - bPad} y2={height - bPad} stroke="#D8D8D8"></line>
          {showAxis &&
            <g>
            
            <g key={selected}>
              <text
                x={-lPad}
                y={0}
                textAnchor="left"
                fontWeight="700"
                fill="#6236FF"
                fontSize="16px"
              >{selectedLabel}</text>

            </g>
            <g key={start}>
              <text
                x={lPad}
                y={height}
                textAnchor="middle"
                fontSize="12"
              >
                {start}
              </text>
            </g>
            <g key={end}>
            <text
              x={width - rPad - lPad}
              y={height}
              textAnchor="middle"
              fontSize="12"
            >
              {end}
            </text>
          </g>
          </g>
          }

          {/* y-axis labels */}
          {yTicks.map(t => {
              const y = yScale(t)
              if ( t === 0 ) {
                return null
              }
              if ( showAxis ) {
              return (
                <g key={t}>
                  <text x={-lPad} y={y+5} textAnchor="start" fontSize="12">
                    {t}%
                  </text>
                  <line x1={lPad} x2={width-lPad-rPad} y1={y} y2={y} stroke="#D8D8D8"
              strokeDasharray="4 3"></line>
                </g>
              
              )
              }
              return (
                <g key={t}>
                  <line x1={lPad} x2={width-lPad-rPad} y1={y} y2={y} stroke="#D8D8D8"
              strokeDasharray="4 3"></line>
                </g>
              
              )
            })}

          {/* lines */}
          {orderBy(data, x => last(x.ranks).prevalence, 'desc').map(
            ({ id, ranks }) => {
              const a = find(ranks,{year:start})
              const b = find(ranks,{year:end})
              const coords = [a, b].map(d => {
                const { year } = d
                return [xScale(year), y(d)]
              })
              const l = line()(coords)
              if ( showInfo ) {
                return (
                  <Fragment key={`ranks-${id}`}>
                    <path
                      d={l}
                      stroke={slopeColor(a, b, id === selected)}
                      strokeWidth={id === selected ? 2 : 1}
                      fill="none"
                    />
                    <path
                      d={l}
                      strokeWidth={15}
                      stroke="transparent"
                      onMouseEnter={() => handleEnter(id)}
                      onMouseLeave={handleLeave}
                    />
                  </Fragment>
                  
                )
              }
              return (
                <Fragment key={`ranks-${id}`}>
                  <path
                    d={l}
                    stroke={slopeColor(a, b, id === selected)}
                    strokeWidth={id === selected ? 2 : 1}
                    fill="none"
                  />
                </Fragment>
                
              )
            }
          )}

          {/* labels */}
          {showInfo && data.map(({ state, ranks, id }) => {
            const a = find(ranks,{year:start})
            const b = find(ranks,{year:end})
            if (id !== selected) return null

            return (
              <Fragment key={`label-${state}-${id}`}>
                <g
                  key={`circleLeft-${state}-${id}`}
                  transform={`translate(${xScale(a.year)}, ${y(a)})`}
                >
                  <circle
                    r="18"
                    fill={
                      a.prevalence <= 1
                        ? '#6ABD8E'
                        : a.prevalence > 10
                        ? '#FF4C73'
                        : '#6236FF'
                    }
                  ></circle>
                  <text x="1" y="5" textAnchor="middle" fill="white" fontSize="12px" fontFamily="Roboto" dy="-1px">{`${a.prevalence}%`}</text>
                </g>
                <g
                  key={`circleRight-${state}-${id}`}
                  transform={`translate(${xScale(b.year)}, ${y(b)})`}
                >
                  <circle
                    r="18"
                    fill={
                      b.prevalence <= 1
                        ? '#6ABD8E'
                        : b.prevalence > 10
                        ? '#FF4C73'
                        : '#6236FF'
                    }
                  ></circle>
                  <text x="1" y="5" textAnchor="middle" fill="white" fontSize="12px" fontFamily="Roboto" dy="-1px">{`${b.prevalence}%`}</text>
                </g>
                
              </Fragment>
            )
          })}
        </g>
      </svg>

      {showLegend && (
        <div style={{ fontSize: 12, paddingTop: 16, lineHeight: 2 }}>
          <div style={{ color: '#ff5e0d' }}>prevalence increasing</div>
          <div style={{ color: '#12df93' }}>{`prevalence <= 1% by ${end}`}</div>
        </div>
      )}
    </div>
  )
}

export default SlopeChart
/*
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
{b.prevalence}% {id}
</text>*/