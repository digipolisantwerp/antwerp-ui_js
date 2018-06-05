"use strict";

import "babel-polyfill";
import { default as chai, expect } from "chai";
import sinonChai from "sinon-chai";

import basicTypeReducer from "../../src/reducers/basic-type";

chai.use(sinonChai);

const progressReducerMock = (type, reducer) => typeof reducer === "function" ? {
	progress: true,
	type,
	reducer,
} : {
	...reducer,
	progress: true,
};
const targetReducerMock = (target, reducer) => typeof reducer === "function" ? {
	target: target,
	reducer,
} : {
	...reducer,
	target: true,
};

describe("basicTypeReducer", () => {
	beforeEach(() => {
		basicTypeReducer.__Rewire__("progressReducer", progressReducerMock);
		basicTypeReducer.__Rewire__("targetReducer", targetReducerMock);
	});

	it("should return a function", () => {
		expect(basicTypeReducer()).to.be.a("function");
	});

	it("should wrap the reducer in the progressReducer if progress is true", () => {
		const reducer = basicTypeReducer({ type: "TEST", progress: true });

		expect(reducer.type).to.equal("TEST");
		expect(reducer.progress).to.be.true;
		expect(reducer.reducer).to.be.a("function");
	});

	describe("single data type", () => {
		it("should load an item when the LOAD action is called", () => {
			const reducer = basicTypeReducer({ type: "test" }, { existing: "1" });

			expect(reducer({}, {
				type: "TEST/LOAD",
				data: {
					new: "2",
				},
			})).to.eql({
				new: "2",
			});
		});

		it("should load an item when the LOAD_MORE action is called", () => {
			const reducer = basicTypeReducer({ type: "test" }, { existing: "1" });

			expect(reducer({}, {
				type: "TEST/LOAD_MORE",
				data: {
					new: "2",
				},
			})).to.eql({
				new: "2",
			});
		});

		it("should clear an item when the CLEAR action is called", () => {
			const reducer = basicTypeReducer({ type: "test" }, { existing: "1" });

			expect(reducer({}, {
				type: "TEST/CLEAR",
				data: {
					new: "2",
				},
			})).to.eql(null);
		});

		it("should fall back to defaults", () => {
			const reducer = basicTypeReducer();

			expect(reducer(undefined, {
				type: "BASIC_DEFAULT/LOAD",
				data: {
					new: "2",
				},
			})).to.eql({
				new: "2",
			});
		});
	});

	describe("list data type", () => {
		it("should load items when the LOAD action is called", () => {
			const reducer = basicTypeReducer({ type: "test", dataType: "list" }, [{ existing: "1" }]);

			expect(reducer({}, {
				type: "TEST/LOAD",
				data: [{
					new: "2",
				}],
			})).to.eql([{
				new: "2",
			}]);
		});

		it("should load more items when the LOAD_MORE action is called", () => {
			const reducer = basicTypeReducer({ type: "test", dataType: "list" }, [{ existing: "1" }]);

			expect(reducer(undefined, {
				type: "TEST/LOAD_MORE",
				data: [{
					new: "2",
				}],
			})).to.eql([{
				existing: "1",
			}, {
				new: "2",
			}]);
		});

		it("should clear all items when the CLEAR action is called", () => {
			const reducer = basicTypeReducer({ type: "test", dataType: "list" }, [{ existing: "1" }]);

			expect(reducer(undefined, {
				type: "TEST/CLEAR",
				data: [{
					new: "2",
				}],
			})).to.eql([]);
		});

		it("should fall back to defaults", () => {
			const reducer = basicTypeReducer({ dataType: "list" });

			expect(reducer(undefined, {
				type: "BASIC_DEFAULT/LOAD",
				data: [{
					new: "2",
				}],
			})).to.eql([{
				new: "2",
			}]);
		});
	});

	it("should return the state if no relevant action was called", () => {
		const reducer = basicTypeReducer({ type: "test" }, { initial: "1" });

		expect(reducer(undefined, {
			type: "TEST/CUSTOM_ACTION",
			data: {
				new: "2",
			},
		})).to.eql({
			initial: "1",
		});
	});
});
