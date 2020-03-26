var mysql = require('mysql')
var fs = require('fs')
var util = require('util')

const REGIME_WHO = 'Current WHO guidelines'
const REGIME_COVERAGE = 'Enhanced coverage'
const REGIME_FREQUENCY = 'Enhanced frequency'
const REGIME_NO_MDA = 'No MDA'

var getRegimeName = par => {
  switch (par) {
    case 'Current WHO guidelines':
      return 'REGIME_WHO'
      break
    case 'Enhanced coverage':
      return 'REGIME_COVERAGE'
      break
    case 'Enhanced frequency':
      return 'REGIME_FREQUENCY'
      break
    case 'No MDA':
      return 'REGIME_NO_MDA'
      break
  }
}

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '28y=RNh0ZVm=',
  database: 'ntd',
})

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

con.connect(function(err) {
  if (err) throw err
  //   console.log('Connected!')

  /***** gather country array ******/
  let countryArray = []
  let countryArrayofObjects = {}
  con.query('SELECT * FROM Relations', function(err, result, fields) {
    if (err) throw err

    result.forEach(element => {
      const exists = countryArray.find(params => {
        return params == element.Country
      })
      if (!exists) {
        countryArray.push(element.Country)
        // countryArrayofObjects.push({})
        countryArrayofObjects[element.Country] = []
      }
    })

    /***** gather StateCodes for each country *****/
    let countryCodes = Object.keys(countryArrayofObjects)

    countryCodes.forEach(countryCode => {
      //   console.log(countryCode)
      con.query(
        "SELECT * FROM Relations WHERE Country ='" + countryCode + "'",
        function(err, result, fields) {
          if (err) throw err
          let thisCountryStates = []
          thisCountryStates[0] = [
            'IUID',
            'Endemicity',
            'Population',
            'Regime',
            'Probability_of_elimination_by_2000',
            'Probability_of_elimination_by_2001',
            'Probability_of_elimination_by_2002',
            'Probability_of_elimination_by_2003',
            'Probability_of_elimination_by_2004',
            'Probability_of_elimination_by_2005',
            'Probability_of_elimination_by_2006',
            'Probability_of_elimination_by_2007',
            'Probability_of_elimination_by_2008',
            'Probability_of_elimination_by_2009',
            'Probability_of_elimination_by_2010',
            'Probability_of_elimination_by_2011',
            'Probability_of_elimination_by_2012',
            'Probability_of_elimination_by_2013',
            'Probability_of_elimination_by_2014',
            'Probability_of_elimination_by_2015',
            'Probability_of_elimination_by_2016',
            'Probability_of_elimination_by_2017',
            'Probability_of_elimination_by_2018',
            'Probability_of_elimination_by_2019',
            'Probability_of_elimination_by_2020',
            'Probability_of_elimination_by_2021',
            'Probability_of_elimination_by_2022',
            'Probability_of_elimination_by_2023',
            'Probability_of_elimination_by_2024',
            'Probability_of_elimination_by_2025',
            'Probability_of_elimination_by_2026',
            'Probability_of_elimination_by_2027',
            'Probability_of_elimination_by_2028',
            'Probability_of_elimination_by_2029',
            'Probability_of_elimination_by_2030',
            'Prev_Year2000',
            'Prev_Year2001',
            'Prev_Year2002',
            'Prev_Year2003',
            'Prev_Year2004',
            'Prev_Year2005',
            'Prev_Year2006',
            'Prev_Year2007',
            'Prev_Year2008',
            'Prev_Year2009',
            'Prev_Year2010',
            'Prev_Year2011',
            'Prev_Year2012',
            'Prev_Year2013',
            'Prev_Year2014',
            'Prev_Year2015',
            'Prev_Year2016',
            'Prev_Year2017',
            'Prev_Year2018',
            'Prev_Year2019',
            'Prev_Year2020',
            'Prev_Year2021',
            'Prev_Year2022',
            'Prev_Year2023',
            'Prev_Year2024',
            'Prev_Year2025',
            'Prev_Year2026',
            'Prev_Year2027',
            'Prev_Year2028',
            'Prev_Year2029',
            'Prev_Year2030',
            'Lower_Bound_Year2000',
            'Lower_Bound_Year2001',
            'Lower_Bound_Year2002',
            'Lower_Bound_Year2003',
            'Lower_Bound_Year2004',
            'Lower_Bound_Year2005',
            'Lower_Bound_Year2006',
            'Lower_Bound_Year2007',
            'Lower_Bound_Year2008',
            'Lower_Bound_Year2009',
            'Lower_Bound_Year2010',
            'Lower_Bound_Year2011',
            'Lower_Bound_Year2012',
            'Lower_Bound_Year2013',
            'Lower_Bound_Year2014',
            'Lower_Bound_Year2015',
            'Lower_Bound_Year2016',
            'Lower_Bound_Year2017',
            'Lower_Bound_Year2018',
            'Lower_Bound_Year2019',
            'Lower_Bound_Year2020',
            'Lower_Bound_Year2021',
            'Lower_Bound_Year2022',
            'Lower_Bound_Year2023',
            'Lower_Bound_Year2024',
            'Lower_Bound_Year2025',
            'Lower_Bound_Year2026',
            'Lower_Bound_Year2027',
            'Lower_Bound_Year2028',
            'Lower_Bound_Year2029',
            'Lower_Bound_Year2030',
            'Upper_Bound_Year2000',
            'Upper_Bound_Year2001',
            'Upper_Bound_Year2002',
            'Upper_Bound_Year2003',
            'Upper_Bound_Year2004',
            'Upper_Bound_Year2005',
            'Upper_Bound_Year2006',
            'Upper_Bound_Year2007',
            'Upper_Bound_Year2008',
            'Upper_Bound_Year2009',
            'Upper_Bound_Year2010',
            'Upper_Bound_Year2011',
            'Upper_Bound_Year2012',
            'Upper_Bound_Year2013',
            'Upper_Bound_Year2014',
            'Upper_Bound_Year2015',
            'Upper_Bound_Year2016',
            'Upper_Bound_Year2017',
            'Upper_Bound_Year2018',
            'Upper_Bound_Year2019',
            'Upper_Bound_Year2020',
            'Upper_Bound_Year2021',
            'Upper_Bound_Year2022',
            'Upper_Bound_Year2023',
            'Upper_Bound_Year2024',
            'Upper_Bound_Year2025',
            'Upper_Bound_Year2026',
            'Upper_Bound_Year2027',
            'Upper_Bound_Year2028',
            'Upper_Bound_Year2029',
            'Upper_Bound_Year2030',
          ]
          // if (countryCode == 'AGO') {
          console.log(countryCode, result.length)

          const myAsync = async () => {
            await asyncForEach(result, element => {
              // console.log(element)

              const exists2 = countryArrayofObjects[countryCode].find(
                params => {
                  return params == element.IUID
                }
              )
              if (!exists2) {
                countryArrayofObjects[countryCode].push(element.IUID)
                console.log(element.IUID)
                //                  const myPromise = await con.query("SELECT * FROM StateLevel WHERE IUID ='" + element.state_code + "'") // not working
                con.query(
                  "SELECT * FROM IULevel WHERE IUID ='" + element.IUID + "'",
                  function(err, result2, fields) {
                    if (err) throw err
                    // console.log(result2)
                    // console.log(element.state_code, result2.length)

                    const myAsync2 = async () => {
                      var regimeName = ''
                      await asyncForEach(result2, (element2, stateIndex) => {
                        if (element2.Regime === 'Current WHO guidelines') {
                          // if (element2.Regime === 'Enhanced coverage') {
                          // if (element2.Regime === 'Enhanced frequency') {
                          // if (element2.Regime === 'No MDA') {
                          regimeName = getRegimeName(element2.Regime)
                          thisCountryStates[stateIndex + 1] = []

                          let valuesOnly = Object.values(element2)
                          //console.log(valuesOnly)
                          valuesOnly.forEach((element3, valueIndex) => {
                            if (valueIndex !== 0) {
                              // console.log(element3)
                              thisCountryStates[stateIndex + 1].push(element3)
                              //                        console.log(element3)
                            }
                          })
                        }
                      })
                      console.log(thisCountryStates)
                      let outputString = thisCountryStates
                        .map(e => e.join(','))
                        .join('\r\n')
                      fs.appendFileSync(
                        './ui-level-by-regime/' +
                          countryCode +
                          '-REGIME_WHO.csv',
                        outputString
                      )
                      // fs.appendFileSync('./ui-level-by-regime/' + countryCode + '-REGIME_COVERAGE.csv', outputString)
                      // fs.appendFileSync('./ui-level-by-regime/' + countryCode + '-REGIME_FREQUENCY.csv', outputString)
                      // fs.appendFileSync('./ui-level-by-regime/' + countryCode + '-REGIME_NO_MDA.csv', outputString)
                    }
                    myAsync2()

                    // countryArrayofObjects[countryCode].push(element.state_code)
                  }
                )
              }
            })
            console.log('Done with AGO')
            // console.log(thisCountryStates.length)
            let outputString = thisCountryStates
              .map(e => e.join(','))
              .join('\r\n')
            fs.writeFileSync(
              './ui-level-by-regime/' + countryCode + '-REGIME_WHO.csv',
              outputString,
              'utf-8'
            )
            // fs.writeFileSync('./ui-level-by-regime/' + countryCode + '-REGIME_COVERAGE.csv', outputString, 'utf-8')
            // fs.writeFileSync('./ui-level-by-regime/' + countryCode + '-REGIME_FREQUENCY.csv', outputString, 'utf-8')
            // fs.writeFileSync('./ui-level-by-regime/' + countryCode + '-REGIME_NO_MDA.csv', outputString, 'utf-8')
          }
          myAsync()

          //   console.log(countryArrayofObjects)
          //fs.writeFileSync('./countries-and-its-stateids.json', JSON.stringify(countryArrayofObjects), 'utf-8')
          // }
        }
      )
    })
  })
})
