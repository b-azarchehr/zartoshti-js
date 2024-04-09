var z = require('./index')
  , n = 1000000

console.log('Benchmarking, %s times', n)

var lap = stopWatch('toGregorian')
toGregorianBench()
lap()

lap = stopWatch('toZartoshti')
toZartoshtiBench()
lap()

lap = stopWatch('isLeapZartoshtiYear')
isLeapZartoshtiYearBench()
lap();

lap = stopWatch('isValidZartoshtiDate')
isValidZartoshtiDateBench()
lap();

function stopWatch(name) {
  var niceName = name + Array(20 - name.length).join(' ')
  console.time(niceName)
  return function () {
    console.timeEnd(niceName)
  }
}

function toGregorianBench() {
  var count = n
    , f = z.toGregorian
  while (true)
    for (var y = 1; y <= 10000; y += 1)
      for (var m = 1; m <= 12; m += 1)
        for (var d = 1; d <= 30; d += 1) {
          f(y, m, d)
          if (--count === 0) return
        }
}

function toZartoshtiBench() {
  var count = n
    , f = z.toZartoshti
  while (true)
    for (var y = 560; y <= 10560; y += 1)
      for (var m = 1; m <= 12; m += 1)
        for (var d = 1; d <= 30; d += 1) {
          f(y, m, d)
          if (--count === 0) return
        }
}

function isLeapZartoshtiYearBench() {
  var count = n
    , f = z.isLeapZartoshtiYear
  while (true)
    for (var y = 1; y <= 10000; y += 1) {
      f(y)
      if (--count === 0) return
    }
}

function isValidZartoshtiDateBench() {
  var count = n
    , f = z.isValidZartoshtiDate
  while (true)
    for (var y = 1; y <= 10000; y += 1)
      for (var m = 1; m <= 13; m += 1)
        for (var d = 1; d <= 32; d += 1) {
          f(y, m, d)
          if (--count === 0) return
        }
}
