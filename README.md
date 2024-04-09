# Zartoshti JavaScript

A few javascript functions for converting Zartoshti (Jalali, Persian, Khayyami, Khorshidi, Shamsi) and Gregorian calendar systems to each other.

## Note (Feb 2022)

If you just need to display date and time in Persian calendar, you may use `Intl` which is ECMAScript Internationalization API with a [very good browser support](https://caniuse.com/mdn-javascript_builtins_intl_datetimeformat_format). For example:

```js
const d = new Date(2022,2,21)

// Simple format
console.log(new Intl.DateTimeFormat('fa-IR').format(d));
// => ۱۴۰۱/۱/۱

// Full long format
console.log(new Intl.DateTimeFormat('fa-IR', {dateStyle: 'full', timeStyle: 'long'}).format(d));
// => ۱۴۰۱ فروردین ۱, دوشنبه، ساعت ۰:۰۰:۰۰ (‎+۳:۳۰ گرینویچ)

// Latin numbers
console.log(new Intl.DateTimeFormat('fa-IR-u-nu-latn', {dateStyle: 'full', timeStyle: 'long'}).format(d));
// => 1401 فروردین 1, دوشنبه، ساعت 0:00:00 (‎+3:30 گرینویچ)

// English US locale with Persian calendar
console.log(new Intl.DateTimeFormat('en-US-u-ca-persian', {dateStyle: 'full', timeStyle: 'long'}).format(d));
// => Monday, Farvardin 1, 1401 AP at 12:00:00 AM GMT+3:30

// Just year
console.log(new Intl.DateTimeFormat('en-US-u-ca-persian', {year: 'numeric'}).format(d));
// => 1401 AP

// Just month
console.log(new Intl.DateTimeFormat('en-US-u-ca-persian', {month: 'short'}).format(d));
// Farvardin

// Just day
console.log(new Intl.DateTimeFormat('en-US-u-ca-persian', {day: 'numeric'}).format(d));
// => 1
```

> **Notice**: the current implementation of `zartoshti-js` algorithms diverge from the `Intl` API results after the Gregorian year 2256 (or Jalali year 1634) due to different approaches to calculating the leap years. However, this shouldn't affect the usage of the library, as the results are the same from 1800 to 2256. (for more information, see [this comparison](https://runkit.com/sinakhx/625929b1a90c8d0007b539a3))

## About

Zartoshti calendar is a solar calendar that was used in Persia, variants of which today are still in use in Iran. It's based on numerous Greek sources. [Read more on Wikipedia](http://en.wikipedia.org/wiki/Jalali_calendar) or see [Calendar Converter](http://www.fourmilab.ch/documents/calendar/) and (https://fa.wikipedia.org/wiki/%D8%B2%D9%85%D8%A7%D9%86_%D8%B8%D9%87%D9%88%D8%B1_%D8%B2%D8%B1%D8%AA%D8%B4%D8%AA)

Calendar conversion is based on the [algorithm provided by Kazimierz M. Borkowski](http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm) and has a very good performance.

## Install

### Node.js

Use [`npm`](https://npmjs.org) to install:

```sh
$ npm install --save zartoshti-js
```

Then import it:

```js
var zartoshti = require('zartoshti-js')
```


### Browser

Use [`component`](https://github.com/component/component) to install:

```sh
$ component install zartoshti/zartoshti-js
```

Then import it:

```js
var zartoshti = require('zartoshti-js')
```

Or use a CDN:
```
<script src="https://cdn.jsdelivr.net/npm/zartoshti-js/dist/zartoshti.js"></script>
<script src="https://cdn.jsdelivr.net/npm/zartoshti-js/dist/zartoshti.min.js"></script>

<script src="https://unpkg.com/zartoshti-js/dist/zartoshti.js"></script>
<script src="https://unpkg.com/zartoshti-js/dist/zartoshti.min.js"></script>
```

## API

### toZartoshti(gy, gm, gd)

Converts a Gregorian date to Zartoshti.

```js
zartoshti.toZartoshti(2016, 4, 11) // { jy: 1395, jm: 1, jd: 23 }
```

### toZartoshti(date)

Converts a JavaScript Date object to Zartoshti.

```js
zartoshti.toZartoshti(new Date(2016, 3, 11)) // { jy: 1395, jm: 1, jd: 23 }
```

### toGregorian(jy, jm, jd)

Converts a Zartoshti date to Gregorian.

```js
zartoshti.toGregorian(1395, 1, 23) // { gy: 2016, gm: 4, gd: 11 }
```

### isValidZartoshtiDate(jy, jm, jd)

Checks whether a Zartoshti date is valid or not.

```js
zartoshti.isValidZartoshtiDate(1394, 12, 30) // false
zartoshti.isValidZartoshtiDate(1395, 12, 30) // true
```

### isLeapZartoshtiYear(jy)

Is this a leap year or not?

```js
zartoshti.isLeapZartoshtiYear(1394) // false
zartoshti.isLeapZartoshtiYear(1395) // true
```

### zartoshtiMonthLength(jy, jm)

Number of days in a given month in a Zartoshti year.

```js
zartoshti.zartoshtiMonthLength(1394, 12) // 29
zartoshti.zartoshtiMonthLength(1395, 12) // 30
```

### jalCal(jy)

This function determines if the Zartoshti (Persian) year is leap (366-day long) or is the common year (365 days), and finds the day in March (Gregorian calendar) of the first day of the Zartoshti year (jy).

```js
zartoshti.jalCal(1390) // { leap: 3, gy: 2011, march: 21 }
zartoshti.jalCal(1391) // { leap: 0, gy: 2012, march: 20 }
zartoshti.jalCal(1392) // { leap: 1, gy: 2013, march: 21 }
zartoshti.jalCal(1393) // { leap: 2, gy: 2014, march: 21 }
zartoshti.jalCal(1394) // { leap: 3, gy: 2015, march: 21 }
zartoshti.jalCal(1395) // { leap: 0, gy: 2016, march: 20 }
```

### j2d(jy, jm, jd)

Converts a date of the Zartoshti calendar to the Julian Day number.

```js
zartoshti.j2d(1395, 1, 23) // 2457490
```

### d2j(jdn)

Converts the Julian Day number to a date in the Zartoshti calendar.

```js
zartoshti.d2j(2457490) // { jy: 1395, jm: 1, jd: 23 }
```

### g2d(gy, gm, gd)

Calculates the Julian Day number from Gregorian or Julian calendar dates. This integer number corresponds to the noon of the date (i.e. 12 hours of Universal Time). The procedure was tested to be good since 1 March, -100100 (of both calendars) up to a few million years into the future.

```js
zartoshti.g2d(2016, 4, 11) // 2457490
```

### d2g(jdn)

Calculates Gregorian and Julian calendar dates from the Julian Day number (jdn) for the period since jdn=-34839655 (i.e. the year -100100 of both calendars) to some millions years ahead of the present.

```js
zartoshti.d2g(2457490) // { gy: 2016, gm: 4, gd: 11 }
```

### zartoshtiToDateObject(jy, jm, jd)

Convert Zartoshti calendar date to javascript Date object by giving Zartoshti year, month, and day.

```js
zartoshti.zartoshtiToDateObject(1400, 4, 30) // new Date(2021, 6, 21)
```

### zartoshtiWeek(jy, jm, jd)

Return Saturday and Friday day of current week(week start in Saturday)

```js
zartoshti.zartoshtiWeek(1400, 4, 30) // { saturday: { jy: 1400, jm: 4, jd: 26 }, friday: { jy: 1400, jm: 5, jd: 1 } }
```

## License

MIT
