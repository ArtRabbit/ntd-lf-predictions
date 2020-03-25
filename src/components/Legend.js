import React from 'react'
import { interpolate, quantize, range, quantile, format } from 'd3'

function ramp(color, n = 256) {
  const canvas = document.createElement('canvas')
  canvas.height = 1
  canvas.width = 256
  const context = canvas.getContext('2d')
  for (let i = 0; i < n; ++i) {
    context.fillStyle = color(i / (n - 1))
    context.fillRect(i, 0, 1, 1)
  }
  return canvas
}

export default function Legend({
  colorScale,
  marginLeft = 16,
  marginRight = 16,
  marginTop = 16,
  marginBottom = 16,
  height = 60,
  width = 250,
  tickFormat,
  tickSize = 6,
}) {
  // continuous scale
  if (colorScale.interpolate) {
    const n = Math.min(colorScale.domain().length, colorScale.range().length)
    const interpolateX = interpolate(marginLeft, width - marginRight)
    const interpolateDomain = interpolate(0, 1)
    const stepsX = quantize(interpolateX, n)
    const stepsDomain = quantize(interpolateDomain, n)
    const x = colorScale.copy().rangeRound(stepsX)
    const d = colorScale.copy().domain(stepsDomain)
    let tickValues
    const ticks = 10

    // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
    if (!x.ticks) {
      if (tickValues === undefined) {
        const n = Math.round(ticks + 1)
        tickValues = range(n).map(i =>
          quantile(colorScale.domain(), i / (n - 1))
        )
      }
      if (typeof tickFormat !== 'function') {
        tickFormat = format(tickFormat === undefined ? ',f' : tickFormat)
      }
    } else {
      tickValues = x.ticks()
    }

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: 'visible', display: 'block' }}
      >
        <image
          x={marginLeft}
          y={marginTop}
          width={width - marginLeft - marginRight}
          height={height - marginTop - marginBottom}
          preserveAspectRatio="none"
          xlinkHref={ramp(d).toDataURL()}
        ></image>
        <g transform={`translate(0,${height - marginBottom})`}>
          {tickValues.map(t => (
            <g key={t} transform={`translate(${x(t)},0)`}>
              <line x1={0} x2={0} y1={4} y2={12} stroke="#000000"></line>
              <text y={24} fontSize={10} textAnchor="middle">
                {t}
              </text>
            </g>
          ))}
        </g>
      </svg>
    )
  }
  return null
}
