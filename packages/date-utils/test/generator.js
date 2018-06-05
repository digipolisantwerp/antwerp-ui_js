"use strict";

import "babel-polyfill";
import chai from "chai";
import sinonChai from "sinon-chai";

import DateGenerator from "../src/generator";

chai.use(sinonChai);

const expect = chai.expect;
const padding = {
	date: null,
	padding: true,
};

describe("DateGenerator", () => {
	it("creates a new DateGenerator with a dateHelper", () => {
		expect(DateGenerator).to.exist;
	});

	describe("generateWeek", () => {
		it("generates a week with the default options if no options are provided", () => {
			const expected = [{ date: 1 }, { date: 2 }, { date: 3 }, { date: 4 }, { date: 5 }, { date: 6 }, { date: 7 }];

			expect(DateGenerator.generateWeek()).to.eql(expected);
		});

		it("generates a week, starting from the provided start date", () => {
			const expected = [{ date: 2 }, { date: 3 }, { date: 4 }, { date: 5 }, { date: 6 }, { date: 7 }, { date: 8 }];

			expect(DateGenerator.generateWeek(2)).to.eql(expected);
		});

		it("generates a week, starting from the provided start date, with the provided dayOffset", () => {
			const expected = [{ date: 5 }, { date: 6 }, { date: 7 }, { date: 8 }, { date: 9 }, { date: 10 }, { date: 11 }];

			expect(DateGenerator.generateWeek(2, { dayOffset: 3 })).to.eql(expected);
			expect(DateGenerator.generateWeek(8, { dayOffset: -3 })).to.eql(expected);
		});

		it("does not generate days that are outside of the months range if padding is disabled", () => {
			const expected = [{ date: 1 }, { date: 2 }, { date: 3 }, { date: 4 }];

			expect(DateGenerator.generateWeek(0, { offset: 3, dayOffset: 1 })).to.eql(expected);
		});

		it("generates a week, generating padding from the start, based on the provided offset", () => {
			const expected = [padding, padding, padding, padding, { date: 20 }, { date: 21 }, { date: 22 }];

			expect(DateGenerator.generateWeek(20, { offset: 4, padding: true, fromStart: true })).to.eql(expected);
		});

		it("generates a week, generating padding on the end, based on the provided offset", () => {
			const expected = [{ date: 20 }, { date: 21 }, { date: 22 }, padding, padding, padding, padding];

			expect(DateGenerator.generateWeek(20, { offset: 4, padding: true })).to.eql(expected);
		});

		it("generates a week, generating padding from the start, from the provided padding array", () => {
			const expected = [{ date: 26, padding: true }, { date: 27, padding: true }, { date: 28, padding: true }, { date: 1 }, { date: 2 }, { date: 3 }, { date: 4 }];

			expect(DateGenerator.generateWeek(0, { offset: 3, dayOffset: 1, padding: true, fromStart: true }, [26, 27, 28])).to.eql(expected);
		});

		it("generates a week, generating padding on the end, from the provided padding array", () => {
			const expected = [{ date: 26 }, { date: 27 }, { date: 28 }, { date: 1, padding: true }, { date: 2, padding: true }, { date: 3, padding: true }, { date: 4, padding: true }];

			expect(DateGenerator.generateWeek(26, { offset: 4, padding: true }, [1, 2, 3, 4])).to.eql(expected);
		});
	});

	describe("generatePadding", () => {
		it("returns an empty array if an invalid date was provided", () => {
			expect(DateGenerator.generatePadding()).to.eql([]);
			expect(DateGenerator.generatePadding("test")).to.eql([]);
			expect(DateGenerator.generatePadding(null)).to.eql([]);
			expect(DateGenerator.generatePadding([])).to.eql([]);
			expect(DateGenerator.generatePadding({})).to.eql([]);
		});

		it("returns an empty array if no options were provided", () => {
			expect(DateGenerator.generatePadding(new Date())).to.eql([]);
		});

		it("generates padding after the current month for the provided count", () => {
			expect(DateGenerator.generatePadding(new Date(), 4)).to.eql([1, 2, 3, 4]);
		});

		it("generates padding before the current month for the provided count", () => {
			expect(DateGenerator.generatePadding(new Date("2017-03-10"), 4, true)).to.eql([25, 26, 27, 28]);
		});

		it("does not exceed the months length when generating padding", () => {
			expect(DateGenerator.generatePadding(new Date("2017-03-10"), 40)).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]);
		});
	});

	describe("generateRange", () => {
		const generateDate = (date, day) => {
			const newDate = new Date(date);
			newDate.setDate(day);

			return newDate;
		};

		it("returns an empty array if the date or the provided ranges are invalid", () => {
			expect(DateGenerator.generateRange()).to.eql([]);
			expect(DateGenerator.generateRange("test")).to.eql([]);
			expect(DateGenerator.generateRange(new Date())).to.eql([]);
			expect(DateGenerator.generateRange(new Date(), [])).to.eql([]);
		});

		it("generates a range for all dates matching the month and year of the provided date", () => {
			const date = new Date("2017-10-03");

			expect(DateGenerator.generateRange(date, [
				generateDate(date, 1),
				generateDate(date, 2),
				new Date("2018-10-04"),
				new Date("2017-11-05"),
			])).to.eql([1, 2]);
		});

		it("generates a range for the provided weekdays", () => {
			const date = new Date("2017-10-03");
			expect(DateGenerator.generateRange(date, [5, 6])).to.eql([6, 7, 13, 14, 20, 21, 27, 28]);
		});

		it("generates a range for the provided weekdays, taking the startOfWeek into account", () => {
			const date = new Date("2017-10-03");
			expect(DateGenerator.generateRange(date, [5, 6], { startOfWeek: 1 })).to.eql([1, 7, 8, 14, 15, 21, 22, 28, 29]);
		});

		it("ignores invalid and duplicate values", () => {
			const date = new Date("2017-10-03");
			expect(DateGenerator.generateRange(date, [
				generateDate(date, 1),
				generateDate(date, 6),
				5,
				"test",
			])).to.eql([
				1, 6, 13, 20, 27,
			]);
		});
	});

	describe("generateMonth", () => {
		it("returns an empty array if an invalid date was provided", () => {
			expect(DateGenerator.generateMonth()).to.eql([]);
			expect(DateGenerator.generateMonth("test")).to.eql([]);
			expect(DateGenerator.generateMonth([])).to.eql([]);
			expect(DateGenerator.generateMonth({})).to.eql([]);
			expect(DateGenerator.generateMonth(null)).to.eql([]);
		});

		it("generates a month with the default options", () => {
			const month = DateGenerator.generateMonth(new Date("2017-10-03"));

			expect(month.length).to.equal(5); // 3 whole weeks + 2 partials
			expect(month[0].length).to.equal(7); // starts on sunday = first day of the week
			expect(month[4].length).to.equal(3); // starts the 29th
			expect(month[2][5]).to.eql({ date: 20 }); // random spot check
		});

		it("generates a month with empty padding if padding is set to true", () => {
			const month = DateGenerator.generateMonth(new Date("2017-10-03"), { padding: true });

			expect(month[4].length).to.equal(7);
			expect(month[4][4]).to.eql({ date: null, padding: true });
		});

		it("generates a month with padding if generatePadding is set to true", () => {
			const month = DateGenerator.generateMonth(new Date("2017-10-03"), { padding: true, generatePadding: true });

			expect(month[4].length).to.equal(7);
			expect(month[4][4]).to.eql({ date: 2, padding: true });
		});

		it("generates a month with the provided startOfWeek", () => {
			const month = DateGenerator.generateMonth(new Date("2017-10-03"), { startOfWeek: 1 });

			expect(month.length).to.equal(6);
			expect(month[0].length).to.equal(1);
		});
	});
});
