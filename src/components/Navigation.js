import React from 'react'
import { NavLink } from 'react-router-dom'

const Link = props => <NavLink style={{ marginRight: 16 }} {...props}></NavLink>

export default function Navigation() {
  return (
    <div>
      <Link to='/'>Slopes by Country</Link>
      <Link to='/map'>Map</Link>
      <Link to='/lines'>Lines by Country</Link>
      <Link to='/states'>Everything! (slow)</Link>
    </div>
  )
}
