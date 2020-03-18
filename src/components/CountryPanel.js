import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

const View = ({ label, children, style }) => (
  <div
    style={{
      marginBottom: 32,
      paddingBottom: 32,
      ...style,
    }}
  >
    <h4>{label}</h4>
    {children}
  </div>
)

/**
 * Generic container for visualizations, adds controls for clipping and switching
 * between country and state level
 */
export default function CountryPanel({ data, render, direction = 'row' }) {
  const [detailed, setDetailed] = useState(false)
  const [clip, setClip] = useState(false)
  const { country, units, states } = data

  return (
    <div style={{ padding: 32 }}>
      <NavLink to={`/states/${country}`}>
        <h3>{country}</h3>
      </NavLink>

      <button onClick={e => setDetailed(!detailed)} style={{ fontSize: 16 }}>
        {detailed ? 'Combine states' : 'Break-up states'}
      </button>

      <button onClick={e => setClip(!clip)} style={{ fontSize: 16 }}>
        Toggle clipping
      </button>

      <div style={{ display: 'flex', flexDirection: direction }}>
        {detailed ? (
          <>
            {states.map(({ state, units: stateUnits }) => (
              <View
                key={state}
                label={`${country} > ${state}`}
                style={{ borderBottom: '1px solid grey' }}
              >
                {render({ data: stateUnits, clip })}
              </View>
            ))}
          </>
        ) : (
          <View label={`${country} > All states`}>
            {render({ data: units, clip })}
          </View>
        )}
      </div>
    </div>
  )
}
