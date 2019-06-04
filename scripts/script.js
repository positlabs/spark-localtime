// const Diagnostics = require('Diagnostics')
const Time = require('Time')
const Patches = require('Patches')

// TODO localization
const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'November',
  'December',
]

function refreshDate() {

  const date = new Date()

  Patches.setStringValue('date', date.toString())
  Patches.setScalarValue('year', (1900 + date.getYear()))
  Patches.setStringValue('month', monthNames[(date.getMonth())])
  Patches.setStringValue('day', dayNames[date.getDay()])

  Patches.setScalarValue('hour', date.getHours())
  Patches.setScalarValue('minute', date.getMinutes())
  Patches.setScalarValue('second', date.getSeconds())

  Patches.setStringValue('MM', (date.getMonth() + 1).toString().padStart(2, '0'))
  Patches.setStringValue('DD', date.getDate().toString().padStart(2, '0'))
  Patches.setStringValue('hh', date.getHours().toString().padStart(2, '0'))
  Patches.setStringValue('mm', date.getMinutes().toString().padStart(2, '0'))
  Patches.setStringValue('ss', date.getSeconds().toString().padStart(2, '0'))
}

const second = 1000
const minute = second * 60
const refreshInterval = second
Time.setInterval(refreshDate, refreshInterval)
