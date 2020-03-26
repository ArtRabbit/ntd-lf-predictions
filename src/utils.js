// TOOD: use theme

export const textColor = (a, selected) => {
  if (selected) return '#6236FF'
  //   if (a.prevalence <= 1) return theme.palette.text.greens.full
  //   if (a.prevalence >= 20) return '#FF4C73'
  return 'black'
}

export const rankColor = (a, selected) => {
  if (selected) return '#6236FF'
  //   if (a.prevalence <= 1) return '#32C2A2'
  //   if (a.prevalence >= 20) return '#FF4C73'
  return '#616161'
  
}

export const slopeColor = (a, b, selected) => {
  if (selected) return '#6236FF'
  if (b.prevalence <= 1) return '#ADE6DA'
  if (b.prevalence > 5) return '#BA455E'
  if (b.prevalence > a.prevalence) return '#FF4C73'
  return '#32C2A2'
}

export const barColor = (a, selected) => {
  if (selected) return '#6236FF'
  if (a.prevalence <= 1) return '#ADE6DA'
  if (a.prevalence >= 5) return '#FF4C73'
  return '#FFE5EB'
}
