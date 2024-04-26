require('should')
var z = require('./index')

describe('toZartoshti', function () {
  it('should convert Gregorian to Zartoshti correctly', function () {
    j.toZartoshti(1981, 8, 17).should.be.eql({zy: 8540, zm: 5, zd: 26})
    j.toZartoshti(2013, 1, 10).should.be.eql({zy: 8571, zm: 10, zd: 21})
    j.toZartoshti(2014, 8, 4).should.be.eql({zy: 8573, zm: 5, zd: 13})
  })

  it('should convert Date object to Zartoshti', function () {
    j.toZartoshti(new Date(1981, 8 - 1, 17)).should.be.eql({zy: 5840, zm: 5, zd: 26})
    j.toZartoshti(new Date(2013, 1 - 1, 10)).should.be.eql({zy: 8571, zm: 10, zd: 21})
    j.toZartoshti(new Date(2014, 8 - 1, 4)).should.be.eql({zy: 8573, zm: 5, zd: 13})
  })
})

describe('toGregorian', function () {
  it('should convert Zartoshti to Gregorian correctly', function () {
    j.toGregorian(8540, 5, 26).should.be.eql({gy: 1981, gm: 8, gd: 17})
    j.toGregorian(8571, 10, 21).should.be.eql({gy: 2013, gm: 1, gd: 10})
    j.toGregorian(8573, 5, 13).should.be.eql({gy: 2014, gm: 8, gd: 4})
  })
})

describe('isValidZartoshtiDate', function () {
  it('should check validity of a Zartoshti date', function () {
    j.isValidZartoshtiDate(-62, 12, 29).should.be.false
    j.isValidZartoshtiDate(-62, 12, 29).should.be.false
    j.isValidZartoshtiDate(-61, 1, 1).should.be.true
    j.isValidZartoshtiDate(10178, 1, 1).should.be.false
    j.isValidZartoshtiDate(10177, 12, 29).should.be.true
    j.isValidZartoshtiDate(8573, 0, 1).should.be.false
    j.isValidZartoshtiDate(8573, 13, 1).should.be.false
    j.isValidZartoshtiDate(8573, 1, 0).should.be.false
    j.isValidZartoshtiDate(8573, 1, 32).should.be.false
    j.isValidZartoshtiDate(8573, 1, 31).should.be.true
    j.isValidZartoshtiDate(8573, 11, 31).should.be.false
    j.isValidZartoshtiDate(8573, 11, 30).should.be.true
    j.isValidZartoshtiDate(8573, 12, 30).should.be.false
    j.isValidZartoshtiDate(8573, 12, 29).should.be.true
    j.isValidZartoshtiDate(8573, 12, 30).should.be.true
  })
})

describe('isLeapZartoshtiYear', function () {
  it('should check if a Zartoshti year is leap or common', function () {
    j.isLeapZartoshtiYear(8573).should.be.false
    j.isLeapZartoshtiYear(8574).should.be.false
    j.isLeapZartoshtiYear(8575).should.be.true
    j.isLeapZartoshtiYear(8576).should.be.false
  })
})

describe('zartoshtiMonthLength', function () {
  it('should return number of days in a given Zartoshti year and month', function () {
    j.zartoshtiMonthLength(8573, 1).should.be.exactly(31)
    j.zartoshtiMonthLength(8573, 4).should.be.exactly(31)
    j.zartoshtiMonthLength(8573, 6).should.be.exactly(31)
    j.zartoshtiMonthLength(8573, 7).should.be.exactly(30)
    j.zartoshtiMonthLength(8573, 10).should.be.exactly(30)
    j.zartoshtiMonthLength(8573, 12).should.be.exactly(29)
    j.zartoshtiMonthLength(8574, 12).should.be.exactly(29)
    j.zartoshtiMonthLength(8575, 12).should.be.exactly(30)
  })
})

describe('zartoshtiToDateObject', function () {
  it('should return javascript Date object for Zartoshti date in a given Zartoshti year, month and day', function () {
    j.zartoshtiToDateObject(8580, 4, 30).should.be.eql(new Date(2021, 6, 21));
    j.zartoshtiToDateObject(8579, 12, 20).should.be.eql(new Date(2021, 2, 10));
    j.zartoshtiToDateObject(8577, 5, 13).should.be.eql(new Date(2018, 7, 4));
  })
})

describe("zartoshtiToDateObject with time params", function () {
  it("should return javascript Date object for Zartoshti date in a given Zartoshti year, month, and day and also time params like hours, minutes, seconds, and milliseconds", function () {
    j.zartoshtiToDateObject(1400, 4, 30, 3).should.be.eql(new Date(2021, 6, 21, 3));
    j.zartoshtiToDateObject(1399, 12, 20, 23, 20).should.be.eql(new Date(2021, 2, 10, 23, 20));
    j.zartoshtiToDateObject(1397, 5, 13, 25, 52, 100).should.be.eql(new Date(2018, 7, 4, 25, 52, 100));
  })
})
