import React, { useState } from 'react'
import LineChart from './LineChart'
import { NavLink } from 'react-router-dom'

const View = ({ data, label, style, clip }) => (
  <div>
    <h4>{label}</h4>
    <LineChart
      data={data}
      width={100}
      height={300}
      start={2015}
      end={2031}
      clipDomain={clip}
    />
  </div>
)

export default function CountryLines({ data }) {
  const [detailed, setDetailed] = useState(false)
  const [clipped, setClipped] = useState(false)
  const { country, units, states } = data

  return (
    <div style={{ padding: 32, border: '1px solid lightgrey' }}>
      <NavLink to={`/states/${country}`}>
        <h3>{country}</h3>
      </NavLink>
      <button onClick={e => setDetailed(!detailed)} style={{ fontSize: 16 }}>
        {detailed ? 'Combine states' : 'Break-up states'}
      </button>
      <button onClick={e => setClipped(!clipped)} style={{ fontSize: 16 }}>
        Toggle clipping
      </button>
      <div style={{ display: 'flex' }}>
        {detailed ? (
          <>
            {states.map(({ state, units: u }) => (
              <View
                label={`${country} > ${state}`}
                data={u}
                clip={clipped}
              ></View>
            ))}
          </>
        ) : (
          <View
            label={`${country} > All states`}
            data={units}
            clip={clipped}
          ></View>
        )}
      </div>
    </div>
  )
}
