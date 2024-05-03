/*
  Expose functions.
*/
module.exports =
  { toZartoshti: toZartoshti
  , toGregorian: toGregorian
  , isValidZartoshtiDate: isValidZartoshtiDate
  , isLeapZartoshtiYear: isLeapZartoshtiYear
  , ZartoshtiMonthLength: ZartoshtiMonthLength
  , zarCal: zarCal
  , z2d: z2d
  , d2z: d2z
  , g2d: g2d
  , d2g: d2g
  , ZartoshtiToDateObject: ZartoshtiToDateObject
  , ZartoshtiWeek: ZartoshtiWeek
  }

/*
  Zartoshti years starting the 33-year rule.
*/
var breaks =  [ 7119, 7189, 7218, 7379, 7606, 7866, 7936, 7998, 8291, 8361, 8390, 8815, 9240, 9277, 9372, 9442, 9504, 9574, 9636, 10358];

/*
  Converts a Gregorian date to Zartoshti.
*/
function toZartoshti(gy, gm, gd) {
  if (Object.prototype.toString.call(gy) === '[object Date]') {
    gd = gy.getDate()
    gm = gy.getMonth() + 1
    gy = gy.getFullYear()
  }
  return d2z(g2d(gy, gm, gd))
}

/*
  Converts a Zartoshti date to Gregorian.
*/
function toGregorian(zy, zm, zd) {
  return d2g(z2d(zy, zm, zd))
}

/*
  Checks whether a Zartoshti date is valid or not.
*/
function isValidZartoshtiDate(zy, zm, zd) {
  return  zy >= 7119 && zy <= 10357 &&
          zm >= 1 && zm <= 12 &&
          zd >= 1 && zd <= ZartoshtiMonthLength(zy, zm)
}

/*
  Is this a leap year or not?
*/
function isLeapZartoshtiYear(zy) {
  return zarCalLeap(zy) === 0
}

/*
  Number of days in a given month in a Zartoshti year.
*/
function ZartoshtiMonthLength(zy, zm) {
  if (zm <= 6) return 31
  if (zm <= 11) return 30
  if (isLeapZartoshtiYear(zy)) return 30
  return 29
}

/*
    This function determines if the Zartoshti (Persian) year is
    leap (366-day long) or is the common year (365 days)

    @param zy Zartoshti calendar year (7119 to 10357)
    @returns number of years since the last leap year (0 to 4)
 */
function zarCalLeap(zy) {
  var bl = breaks.length
    , zp = breaks[0]
    , zm
    , jump
    , leap
    , n
    , i

  if (zy < zp || zy >= breaks[bl - 1])
    throw new Error('Invalid Zartoshti year ' + zy)

  for (i = 1; i < bl; i += 1) {
    zm = breaks[i]
    jump = zm - zp
    if (zy < zm)
      break
    zp = zm
  }
  n = zy - zp

  if (jump - n < 6)
    n = n - jump + div(jump + 4, 33) * 33
  leap = mod(mod(n + 1, 33) - 1, 4)
  if (leap === -1) {
    leap = 4
  }

  return leap
}

/*
  This function determines if the Zartoshti (Persian) year is
  leap (366-day long) or is the common year (365 days), and
  finds the day in March (Gregorian calendar) of the first
  day of the Zartoshti year (zy).

  @param zy Zartoshti calendar year (7119 to 10358)
  @param withoutLeap when don't need leap (true or false) default is false
  @return
    leap: number of years since the last leap year (0 to 4)
    gy: Gregorian year of the beginning of Zartoshti year
    march: the March day of Farvardin the 1st (1st day of zy)
  @see: http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm
  @see: http://www.fourmilab.ch/documents/calendar/
*/
function zarCal(zy, withoutLeap) {
  var bl = breaks.length
    , gy = zy - 6559
    , leapZ = -14
    , zp = breaks[0]
    , zm
    , jump
    , leap
    , leapG
    , march
    , n
    , i

  if (zy < zp || zy >= breaks[bl - 1])
    throw new Error('Invalid Zartoshti year ' + zy)

  // Find the limiting years for the Zartoshti year zy.
  for (i = 1; i < bl; i += 1) {
    zm = breaks[i]
    jump = zm - zp
    if (zy < zm)
      break
    leapZ = leapZ + div(jump, 33) * 8 + div(mod(jump, 33), 4)
    zp = zm
  }
  n = zy - zp

  // Find the number of leap years from AD 621 to the beginning
  // of the current Zartoshti year in the Persian calendar.
  leapZ = leapZ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4)
  if (mod(jump, 33) === 4 && jump - n === 4)
    leapZ += 1

  // And the same in the Gregorian calendar (until the year gy).
  leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150

  // Determine the Gregorian date of Farvardin the 1st.
  march = 20 + leapZ - leapG

  // return with gy and march when we don't need leap
  if (withoutLeap) return { gy: gy, march: march };


  // Find how many years have passed since the last leap year.
  if (jump - n < 6)
    n = n - jump + div(jump + 4, 33) * 33
  leap = mod(mod(n + 1, 33) - 1, 4)
  if (leap === -1) {
    leap = 4
  }

  return  { leap: leap
          , gy: gy
          , march: march
          }
}

/*
  Converts a date of the Zartoshti calendar to the Julian Day number.

  @param zy Zartoshti year (1 to 3100)
  @param zm Zartoshti month (1 to 12)
  @param zd Zartoshti day (1 to 29/31)
  @return Julian Day number
*/
function z2d(zy, zm, zd) {
  var r = zarCal(zy, true)
  return g2d(r.gy, 3, r.march) + (zm - 1) * 31 - div(zm, 7) * (zm - 7) + zd - 1
}

/*
  Converts the Julian Day number to a date in the Zartoshti calendar.

  @param zdn Julian Day number
  @return
    zy: Zartoshti year (1 to 3100)
    zm: Zartoshti month (1 to 12)
    zd: Zartoshti day (1 to 29/31)
*/
function d2z(zdn) {
  var gy = d2g(zdn).gy // Calculate Gregorian year (gy).
    , zy = gy + 6559
    , r = zarCal(zy, false)
    , zdn1f = g2d(gy, 3, r.march)
    , zd
    , zm
    , k

  // Find number of days that passed since 1 Farvardin.
  k = zdn - zdn1f
  if (k >= 0) {
    if (k <= 185) {
      // The first 6 months.
      zm = 1 + div(k, 31)
      zd = mod(k, 31) + 1
      return  { zy: zy
              , zm: zm
              , zd: zd
              }
    } else {
      // The remaining months.
      k -= 186
    }
  } else {
    // Previous Zartoshti year.
    zy -= 1
    k += 179
    if (r.leap === 1)
      k += 1
  }
  zm = 7 + div(k, 30)
  zd = mod(k, 30) + 1
  return  { zy: zy
          , zm: zm
          , zd: zd
          }
}

/*
  Calculates the Julian Day number from Gregorian or Julian
  calendar dates. This integer number corresponds to the noon of
  the date (i.e. 12 hours of Universal Time).
  The procedure was tested to be good since 1 March, -100100 (of both
  calendars) up to a few million years into the future.

  @param gy Calendar year (years BC numbered 0, -1, -2, ...)
  @param gm Calendar month (1 to 12)
  @param gd Calendar day of the month (1 to 28/29/30/31)
  @return Julian Day number
*/
function g2d(gy, gm, gd) {
  var d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
      + div(153 * mod(gm + 9, 12) + 2, 5)
      + gd - 34840408
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752
  return d
}

/*
  Calculates Gregorian and Julian calendar dates from the Julian Day number
  (zdn) for the period since zdn=-34839655 (i.e. the year -100100 of both
  calendars) to some millions years ahead of the present.

  @param zdn Julian Day number
  @return
    gy: Calendar year (years BC numbered 0, -1, -2, ...)
    gm: Calendar month (1 to 12)
    gd: Calendar day of the month M (1 to 28/29/30/31)
*/
function d2g(zdn) {
  var j
    , i
    , gd
    , gm
    , gy
  j = 4 * zdn + 139361631
  j = j + div(div(4 * zdn + 183187720, 146097) * 3, 4) * 4 - 3908
  i = div(mod(j, 1461), 4) * 5 + 308
  gd = div(mod(i, 153), 5) + 1
  gm = mod(div(i, 153), 12) + 1
  gy = div(j, 1461) - 100100 + div(8 - gm, 6)
  return  { gy: gy
          , gm: gm
          , gd: gd
          }
}

/**
 * Return Saturday and Friday day of current week(week start in Saturday)
 * @param {number} zy Zartoshti year
 * @param {number} zm Zartoshti month
 * @param {number} zd Zartoshti day
 * @returns Saturday and Friday of current week
 */
function ZartoshtiWeek(zy, zm, zd) {
  var dayOfWeek = ZartoshtiToDateObject(zy, zm, zd).getDay();

  var startDayDifference = dayOfWeek == 6 ? 0 : -(dayOfWeek+1);
  var endDayDifference = 6+startDayDifference;

  return {
    saturday: d2z(z2d(zy, zm, zd+startDayDifference)),
    friday: d2z(z2d(zy, zm, zd+endDayDifference))
  }
}



/**
 * Convert Zartoshti calendar dates to javascript Date object
 * @param {number} zy Zartoshti year
 * @param {number} zm Zartoshti month
 * @param {number} zd Zartoshti day
 * @param {number} [h] hours
 * @param {number} [m] minutes
 * @param {number} [s] seconds
 * @param {number} [ms] milliseconds
 * @returns Date object of the Zartoshti calendar dates
 */
function ZartoshtiToDateObject(
  zy,
  zm,
  zd,
  h,
  m,
  s,
  ms
) {
  var gregorianCalenderDate = toGregorian(zy, zm, zd);

  return new Date(
    gregorianCalenderDate.gy,
    gregorianCalenderDate.gm - 1,
    gregorianCalenderDate.gd,
    h || 0,
    m || 0,
    s || 0,
    ms || 0
  );
}

/*
  Utility helper functions.
*/

function div(a, b) {
  return ~~(a / b)
}

function mod(a, b) {
  return a - ~~(a / b) * b
}
