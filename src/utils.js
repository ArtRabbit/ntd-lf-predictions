// TOOD: use theme

export const textColor = (a, selected) => {
  if (selected) return 'blue'
  if (a.prevalence <= 1) return '#11cf88'
  if (a.prevalence >= 20) return '#ff5e0d'
  return 'black'
}

export const slopeColor = (a, b, selected) => {
  if (selected) return 'blue'
  if (b.prevalence <= 1) return '#11cf88'
  if (b.prevalence > a.prevalence) return '#ff5e0d'
  return '#b4b4b4'
}

export const barColor = (a, selected) => {
  if (selected && a.prevalence <= 1) return 'blue'
  if (a.prevalence <= 1) return '#11cf88'
  if (a.prevalence >= 20) return '#ff5e0d'
  return '#e8e8e8'
}
