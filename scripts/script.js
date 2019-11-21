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
var languageAndTerritory = Locale.fromDevice.replace('_', '-')
if (languageAndTerritory === 'foo-bar') languageAndTerritory = 'en-US'

// options for some of the toScript nodes
Patches.setStringValue('longType', 'long')
Patches.setStringValue('shortType', 'short')
Patches.setStringValue('narrowType', 'narrow')
Patches.setStringValue('numericType', 'numeric')
Patches.setStringValue('twoDigitType', '2-digit')
Patches.setStringValue('mediumType', 'medium')

const defaults = {
  weekday: 'long',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZoneName: 'long',
  hour12: true,
}

function getStringVal(name) {
  try {
    let val = Patches.getStringValue(name).pinLastValue()
    if (val.length === 0) return undefined
    if (val === '0') return defaults[name]
    return val
  } catch (e) {
    return undefined
  }
}

function refreshDate() {
  // D.log('refreshDate')

  const options = {
    weekday: getStringVal('weekday'),
    year: getStringVal('year'),
    month: getStringVal('month'),
    day: getStringVal('day'),
    hour: getStringVal('hour'),
    minute: getStringVal('minute'),
    second: getStringVal('second'),
    dateStyle: getStringVal('dateStyle'),
    timeStyle: getStringVal('timeStyle'),
    formatMatcher: getStringVal('formatMatcher'),
    hour12: getStringVal('hour12'),
    timeZoneName: getStringVal('timeZoneName'),
  }
  // D.log(options)

  const dateString = new Date().toLocaleDateString(languageAndTerritory, options)
  Patches.setStringValue('date', dateString)

}

var interval
function setRefreshInterval(refreshInterval) {
  if (interval === undefined) refreshDate()
  else Time.clearInterval(interval)
  if (!refreshInterval || refreshInterval === 0) refreshInterval = 1000
  // D.log('setRefreshInterval: ' + refreshInterval)
  interval = Time.setInterval(refreshDate, refreshInterval)
}
Patches.getScalarValue('refreshInterval').monitor({fireOnInitialValue: true}).subscribe(({newValue}) => {
  setRefreshInterval(newValue)
})
