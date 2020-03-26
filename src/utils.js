// TOOD: use theme

export const textColor = (a, selected) => {
  if (selected) return '#6236FF'
  //   if (a.prevalence <= 1) return theme.palette.text.greens.full
  //   if (a.prevalence >= 20) return '#d01c8b'
  return 'black'
}

export const rankColor = (a, selected) => {
  if (selected) return '#6236FF'
  //   if (a.prevalence <= 1) return '#b8e186'
  //   if (a.prevalence >= 20) return '#d01c8b'
  return '#616161'
  
}

export const slopeColor = (a, b, selected, noLightGreen = false) => {
  if (selected) return '#6236FF'
  if (b.prevalence <= 1) {
    if ( noLightGreen ) return '#6236FF'
    return '#b8e186'
  }
    if (b.prevalence > 5) return '#d01c8b'
  if (b.prevalence > a.prevalence) return '#d01c8b'
  return '#4dac26'
}

export const barColor = (a, selected) => {
  if (selected) return '#6236FF'
  if (a.prevalence <= 1) return '#b8e186'
  if (a.prevalence >= 5) return '#d01c8b'
  return '#4dac26'
}
