// TOOD: use theme

export const textColor = (a, selected) => {
  if (selected) return '#6236FF'
  //   if (a.prevalence <= 1) return '#11cf88'
  //   if (a.prevalence >= 20) return '#ff5e0d'
  return 'black'
}

export const rankColor = (a, selected) => {
  if (selected) return '#6236FF'
  //   if (a.prevalence <= 1) return '#11cf88'
  //   if (a.prevalence >= 20) return '#ff5e0d'
  return '#616161'
  
}

export const slopeColor = (a, b, selected) => {
  if (selected) return '#6236FF'
  if (b.prevalence <= 1) return '#B3F1DA'
  if (b.prevalence > a.prevalence) return '#FF4C73'
  return '#6ABD8E'
}

export const barColor = (a, selected) => {
  if (selected) return '#6236FF'
  if (a.prevalence <= 1) return '#B3F1DA'
  if (a.prevalence >= 5) return '#FF4C73'
  return '#FFE5EB'
}
