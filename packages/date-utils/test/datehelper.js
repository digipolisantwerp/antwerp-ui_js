"use strict";

import "babel-polyfill";
import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import DateHelper from "../src/datehelper";

chai.use(sinonChai);

const expect = chai.expect;

const compareDates = (...args) => {
	const values = args.map(date => date.valueOf());

	return (values
		.reduce((acc, curr) => acc + curr, 0)
	) / args.length === values[0];
};

const sanityCheck = (method, expected) => {
	// An empty array or object is considered to be a virtual '0' time
	const testValues = [undefined, "test", null];

	testValues.forEach(value => {
		expect(DateHelper[method](value)).to.equal(expected);
	});
};

describe("DateHelper", () => {
	describe("parseDate", () => {
		it("should return null if an invalid date was provided", () => {
			sanityCheck("parseDate", null);
		});

		it("should accept a format for a date", () => {
			const date = DateHelper.parseDate("05-02-2019", "dd-MM-yyyy");
			expect(date).not.to.be.null;
		});

		it("should try to parse a correct date when no format has been given", () => {
			const date = DateHelper.parseDate("2019-02-05");
			expect(date).not.to.be.null;
			expect(date instanceof Date).to.be.true;
		});

		it("should return an error when parsing a false date", () => {
			const dateFalse = DateHelper.parseDate(false);
			expect(dateFalse).to.be.null;

			const dateNill = DateHelper.parseDate(0);
			expect(dateNill).to.be.null;
		});

		it("should return an error when parsing a date without month or year", () => {
			const date = DateHelper.parseDate("05-", "dd-MM-yyyy");
			expect(date).to.be.null;
		});

		it("should return an error when parsing a date without year", () => {
			const date = DateHelper.parseDate("05-02", "dd-MM-yyyy");
			expect(date).to.be.null;
		});

		it("should return a date object for the provided input", () => {
			const result = DateHelper.parseDate("2017-10-3", "yyyy-MM-dd");

			expect(result instanceof Date).to.be.true;
		});
	});

	describe("getWeekday", () => {
		it("should return -1 if an invalid date was provided", () => {
			sanityCheck("getWeekday", -1);
		});

		it("should return the weekday, 0 based if no startOfWeek was provided", () => {
			const date = new Date("2017-10-3"); // tuesday, so weekday is 2

			expect(DateHelper.getWeekday(date)).to.equal(2);
		});

		it("should return the weekday, based on the provided startOfWeek", () => {
			const date = new Date("2017-10-3"); // tuesday, so weekday is 2

			expect(DateHelper.getWeekday(date, 1)).to.equal(1); // week starts on monday, so tuesday is the 2nd day (index 1)
			expect(DateHelper.getWeekday(date, 4)).to.equal(5); // week starts on thursday, so tuesday is the 6th day (index 5)
		});
	});

	describe("getMonthLength", () => {
		it("should return -1 if an invalid date was provided", () => {
			sanityCheck("getMonthLength", -1);
		});

		it("should return the month length", () => {
			const date = new Date("2017-10-3"); // month length is 31

			expect(DateHelper.getMonthLength(date)).to.equal(31);
		});
	});

	describe("getFirstWeekdayOfMonth", () => {
		it("should return -1 if an invalid date was provided", () => {
			sanityCheck("getFirstWeekdayOfMonth", -1);
		});

		it("should return the weekday of the first day of the month, 0 based if no startOfWeek was provided", () => {
			const date = new Date("2017-10-3"); // the 1st is a sunday, so weekday is 0

			expect(DateHelper.getFirstWeekdayOfMonth(date)).to.equal(0);
		});

		it("should return the weekday of the first day of the month, based on the provided startOfWeek", () => {
			const date = new Date("2017-10-3"); // the 1st is a sunday, so weekday is 0

			expect(DateHelper.getFirstWeekdayOfMonth(date, 1)).to.equal(6); // start of week is monday, so index = 6
			expect(DateHelper.getFirstWeekdayOfMonth(date, 4)).to.equal(3); // start of week is thursday, so index = 3
		});
	});

	describe("getLastWeekdayOfMonth", () => {
		it("should return -1 if an invalid date was provided", () => {
			sanityCheck("getLastWeekdayOfMonth", -1);
		});

		it("should return the weekday of the last day of the month, 0 based if no startOfWeek was provided", () => {
			const date = new Date("2017-10-3"); // the 31st is a tuesday, so weekday is 2

			expect(DateHelper.getLastWeekdayOfMonth(date)).to.equal(2);
		});

		it("should return the weekday of the last day of the month, based on the provided startOfWeek", () => {
			const date = new Date("2017-10-3"); // the 31st is a tuesday, so weekday is 2

			expect(DateHelper.getLastWeekdayOfMonth(date, 1)).to.equal(1); // start of week is monday, so index = 1
			expect(DateHelper.getLastWeekdayOfMonth(date, 4)).to.equal(5); // start of week is thursday, so index = 5
		});
	});

	describe("datesAreEqual", () => {
		beforeEach(() => {
			sinon.stub(DateHelper, "dateValuesAreEqual").returns(true);
		});

		afterEach(() => {
			DateHelper.dateValuesAreEqual.restore();
		});

		it("should return false if no dates are provided", () => {
			expect(DateHelper.datesAreEqual()).to.equal(false);
		});

		it("should fall back to the 'valueOf' specifier if no specifier was provided", () => {
			const now = new Date();

			expect(DateHelper.datesAreEqual([now, now])).to.be.true;
			expect(DateHelper.datesAreEqual([new Date(), new Date()])).to.be.true;
		});

		it("should fall back to the 'valueOf' specifier if an invalid specifier was provided", () => {
			const dates = [new Date(), new Date()];

			expect(DateHelper.datesAreEqual(dates, "test")).to.be.true;
		});

		it("should use the provided specifier if it is a valid specifier", () => {
			const dates = [new Date("2018-02-01"), new Date("2017-02-01")];

			expect(DateHelper.datesAreEqual(dates, "M")).to.be.true;
		});

		it("should verify all specifiers (if the provided specifier is an array), falling back to the 'valueOf' specifier for invalid specifiers", () => {
			const dates = [new Date(), new Date()];

			expect(DateHelper.datesAreEqual(dates, ["M", "D", "test"])).to.be.true;
		});

		it("should return false if the dateValuesAreEqual method returns false for one of the specifiers", () => {
			expect(DateHelper.datesAreEqual([new Date("2018-10-01"), new Date("2018-11-01")], ["D", "M", "Y"])).to.be.false;
		});
	});

	describe("dateValuesAreEqual", () => {
		it("should return false if the provided comparator is not a known method of the Date object", () => {
			expect(DateHelper.dateValuesAreEqual([], "test")).to.equal(false);
		});

		it("should compare the dates based on the provided comparator, falling back to a value of -1 if the date is invalid", () => {
			expect(DateHelper.dateValuesAreEqual([new Date(), new Date()], "getMonth")).to.equal(true);

			expect(DateHelper.dateValuesAreEqual([new Date(), "test"]), "getMonth").to.equal(false);
		});
	});

	describe("updateDate", () => {
		it("returns the original date if an invalid date or day was provided", () => {
			expect(DateHelper.updateDate("test")).to.equal("test");

			const date = new Date();

			expect(DateHelper.updateDate(date, "test")).to.equal(date);
		});

		it("returns the date with the updated day", () => {
			const date = new Date("2017-10-03");
			const expected = new Date(date);
			expected.setDate(20);

			expect(compareDates(DateHelper.updateDate(date, 20), expected)).to.equal(true);
		});

		it("sets the date to the last day of the month if the target day exceeds the targetdate months length", () => {
			const date = new Date("2017-09-03");
			const expected = new Date(date);
			expected.setDate(30);

			expect(compareDates(DateHelper.updateDate(date, 31), expected)).to.equal(true);
		});
	});

	describe("updateMonth", () => {
		it("returns the original date if an invalid date or month was provided", () => {
			expect(DateHelper.updateMonth("test")).to.equal("test");

			const date = new Date();

			expect(DateHelper.updateMonth(date, "test")).to.equal(date);
		});

		it("returns the date with the updated month", () => {
			const date = new Date("2017-10-03");
			const expected = new Date(date);
			expected.setMonth(1);

			expect(compareDates(DateHelper.updateMonth(date, 1), expected)).to.equal(true);
		});

		it("decreases the year if the desired month is < 0", () => {
			const date = new Date("2017-01-31");
			const expected = new Date(date);
			expected.setMonth(11);
			expected.setFullYear(2016);
			const actual = DateHelper.updateMonth(date, -1);

			expect(compareDates(actual, expected)).to.equal(true);
		});

		it("increases the year if the desired month is > 11", () => {
			const date = new Date("2017-12-04");
			const expected = new Date(date);
			expected.setMonth(0);
			expected.setFullYear(2018);

			expect(compareDates(DateHelper.updateMonth(date, 12), expected)).to.equal(true);
		});
	});

	describe("formatDate", () => {
		it("returns null if an invalid date was provided", () => {
			sanityCheck("formatDate", null);
		});

		it("returns an empty string if no format was provided", () => {
			expect(DateHelper.formatDate(new Date())).to.equal("");
		});

		it("formats the day according to the provided format, falling back on default options", () => {
			expect(DateHelper.formatDate(new Date("2017-10-03"), "DDDD DD/MM/YYYY")).to.equal("Wednesday 03/10/2017"); // startOfWeek = 0, so we move up a day
		});

		it("formats the day according to the provided format", () => {
			expect(DateHelper.formatDate(new Date("2017-10-03 12:10:02:840"), "hh:mm:ss.ms DDDD DD MMMM YYYY (DD/MM/YY)", { startOfWeek: 1 })).to.equal("12:10:02.840 Tuesday 03 October 2017 (03/10/17)");
		});
	});

	describe("addLeadingZero", () => {
		it("returns the value as a string if its length is 2 or higher", () => {
			expect(DateHelper.addLeadingZero("test")).to.equal("test");
			expect(DateHelper.addLeadingZero(20)).to.equal("20");
		});

		it("adds a leading zero if the values string length is 1", () => {
			expect(DateHelper.addLeadingZero(1)).to.equal("01");
		});

		it("returns '00' if the values string length is 0", () => {
			expect(DateHelper.addLeadingZero()).to.equal("00");
			expect(DateHelper.addLeadingZero("")).to.equal("00");
		});
	});

	describe("dateOutOfRange", () => {
		it("should return false if an invalid date was provided", () => {
			sanityCheck("dateOutOfRange", false);
		});

		it("should return true if no range or an invalid range was provided", () => {
			const date = new Date("2017-10-03");

			expect(DateHelper.dateOutOfRange(date)).to.equal(true);
			expect(DateHelper.dateOutOfRange(date, "test")).to.equal(true);
			expect(DateHelper.dateOutOfRange(date, {})).to.equal(true);
			expect(DateHelper.dateOutOfRange(date, 4)).to.equal(true);
		});

		it("should return true if the date is outside of the provided range", () => {
			const date = new Date("2017-10-03");

			expect(DateHelper.dateOutOfRange(date, [])).to.equal(true);
		});

		it("should return false if the date is in the provided range", () => {
			const date = new Date("2017-10-03");

			expect(DateHelper.dateOutOfRange(date, [3])).to.equal(false);
		});
	});

	describe("closestDateForRange", () => {
		it("should return null if an invalid date was provided", () => {
			sanityCheck("closestDateForRange", null);
		});

		it("should return the original date if no range or an invalid range was provided", () => {
			const date = new Date("2017-10-03");

			expect(DateHelper.closestDateForRange(date)).to.eql(date);
			expect(DateHelper.closestDateForRange(date, "test")).to.eql(date);
			expect(DateHelper.closestDateForRange(date, {})).to.eql(date);
			expect(DateHelper.closestDateForRange(date, 4)).to.eql(date);
		});

		it("should return the original date if the range is empty", () => {
			const date = new Date("2017-10-03");

			expect(DateHelper.closestDateForRange(date, [])).to.eql(date);
		});

		it("should return the closest date outside of the range", () => {
			const date = new Date("2017-10-13");

			const expectedLeft = new Date("2017-10-08");
			const expectedRight = new Date("2017-10-18");

			expect(DateHelper.closestDateForRange(date, [9, 10, 11, 12, 13, 14, 15, 16, 17, 18])).to.eql(expectedLeft);
			expect(DateHelper.closestDateForRange(date, [8, 9, 10, 11, 12, 13, 14, 15, 16, 17])).to.eql(expectedRight);
		});
	});
});
