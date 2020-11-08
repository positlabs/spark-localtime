/*
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString

  weekday
    The representation of the weekday. Possible values are:
      "long" (e.g., Thursday)
      "short" (e.g., Thu)
      "narrow" (e.g., T). Two weekdays may have the same narrow style for some locales (e.g. Tuesday's narrow style is also T).

  year
    The representation of the year. Possible values are:
      "numeric" (e.g., 2012)
      "2-digit" (e.g., 12)

  month
    The representation of the month. Possible values are:
      "numeric" (e.g., 2)
      "2-digit" (e.g., 02)
      "long" (e.g., March)
      "short" (e.g., Mar)
      "narrow" (e.g., M). Two months may have the same narrow style for some locales (e.g. May's narrow style is also M).

  day
    The representation of the day. Possible values are:
      "numeric" (e.g., 1)
      "2-digit" (e.g., 01)

  hour
    The representation of the hour. Possible values are:
      "numeric"
      "2-digit"

  minute
    The representation of the minute. Possible values are:
      "numeric"
      "2-digit"

  second
    The representation of the second. Possible values are:
      "numeric"
      "2-digit".

  timeZoneName
    The representation of the time zone name. Possible values are:
      "long" (e.g., British Summer Time)
      "short" (e.g., GMT+1)

  hour12
    Whether to use 12-hour time (as opposed to 24-hour time). Possible values are true and false; the default is locale dependent. This option overrides the hc language tag and/or the hourCycle option in case both are present.

*/

const D = require('Diagnostics')
const Time = require('Time')
const Patches = require('Patches')
const Locale = require('Locale')

let languageAndTerritory = 'en-US'
Locale.locale.monitor({fireOnInitialValue: true}).subscribe(val => {
  const locale = val.newValue
  languageAndTerritory = locale.replace('_', '-')
  if (languageAndTerritory === 'foo-bar') languageAndTerritory = 'en-US'
})

// options for some of the toScript nodes
try {
  Patches.inputs.setString('longType', 'long')
  Patches.inputs.setString('shortType', 'short')
  Patches.inputs.setString('narrowType', 'narrow')
  Patches.inputs.setString('numericType', 'numeric')
  Patches.inputs.setString('twoDigitType', '2-digit')
  Patches.inputs.setString('mediumType', 'medium')
} catch (e) {
  D.log(e)
}

const defaults = {
  weekday: 'long',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZoneName: 'long',
  hour12: undefined,
}

const options = Object.assign({}, defaults)

async function monitorOption(name, type = 'string') {
  // D.log('monitorOption: ' + name)
  let newVal
  try {
    let promise
    if(type === 'string') promise = Patches.outputs.getString(name)
    if(type === 'boolean') promise = Patches.outputs.getBoolean(name)
    const str = await promise
    str.monitor({fireOnInitialValue: true}).subscribe(val => {
      newVal = val.newValue
      if (newVal.length === 0) newVal = undefined
      else if (newVal === '0') newVal = defaults[name]
      else options[name] = val.newValue
    })
    // return options[name] = newVal
  } catch (e) {
    throw e
  }
}

monitorOption('weekday')
monitorOption('year')
monitorOption('month')
monitorOption('day')
monitorOption('hour')
monitorOption('minute')
monitorOption('second')
// monitorOption('dateStyle')
// monitorOption('timeStyle')
// monitorOption('formatMatcher')
monitorOption('hour12', 'boolean')
monitorOption('timeZoneName')

// TODO add option for setting specific date
// https://github.com/facebook/hermes/blob/83d5c17d475596c735d65726724c1871e5e0448f/test/hermes/date-constructor.js

function refreshDate() {
  // D.log('refreshDate')
  // D.log(options)

  const dateString = new Date().toLocaleDateString(languageAndTerritory, options)
  D.log(dateString)
  D.log(options)

  try {
    // don't bork if the script node isn't in the patch editor yet
    Patches.inputs.setString('date', dateString)
  } catch (e) {
    D.log(e)
  }
}

var interval
function setRefreshInterval(refreshInterval) {
  if (interval === undefined) refreshDate()
  else Time.clearInterval(interval)
  if (!refreshInterval || refreshInterval === 0) refreshInterval = 1000
  // D.log('setRefreshInterval: ' + refreshInterval)
  interval = Time.setInterval(refreshDate, refreshInterval)
}

Patches.outputs.getScalar('refreshInterval').then(refreshInterval => {
  refreshInterval.monitor({fireOnInitialValue: true}).subscribe(({newValue}) => {
  setRefreshInterval(newValue)
  })
}).catch(e => {
  // use default if none is set
  setRefreshInterval()
})
