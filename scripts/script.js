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

  Patches.inputs.setString('date', date.toString())
  Patches.inputs.setScalar('year', (1900 + date.getYear()))
  Patches.inputs.setString('month', monthNames[(date.getMonth())])
  Patches.inputs.setString('day', dayNames[date.getDay()])
  Patches.inputs.setScalar('hour', date.getHours())
  Patches.inputs.setScalar('minute', date.getMinutes())
  Patches.inputs.setScalar('second', date.getSeconds())
  Patches.inputs.setString('MM', (date.getMonth() + 1).toString().padStart(2, '0'))
  Patches.inputs.setString('DD', date.getDate().toString().padStart(2, '0'))
  Patches.inputs.setString('hh', date.getHours().toString().padStart(2, '0'))
  Patches.inputs.setString('mm', date.getMinutes().toString().padStart(2, '0'))
  Patches.inputs.setString('ss', date.getSeconds().toString().padStart(2, '0'))
}

const second = 1000
const minute = second * 60
const refreshInterval = second
Time.setInterval(refreshDate, refreshInterval)
