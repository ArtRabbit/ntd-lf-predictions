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

export const abbrNum = (number, decPlaces) => {
  // 2 decimal places => 100, 3 => 1000, etc
  decPlaces = Math.pow(10,decPlaces)

  // Enumerate number abbreviations
  var abbrev = [ "k", "m", "b", "t" ]

  // Go through the array backwards, so we do the largest first
  for (var i=abbrev.length-1; i>=0; i--) {

      // Convert array index to "1000", "1000000", etc
      var size = Math.pow(10,(i+1)*3)

      // If the number is bigger or equal do the abbreviation
      if(size <= number) {
           // Here, we multiply by decPlaces, round, and then divide by decPlaces.
           // This gives us nice rounding to a particular decimal place.
           number = Math.round(number*decPlaces/size)/decPlaces

           // Add the letter for the abbreviation
           number += abbrev[i]

           // We are done... stop
           break
      }
  }

  return number
}