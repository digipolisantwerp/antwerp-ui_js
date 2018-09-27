"use strict";

import "babel-polyfill";
import chai from "chai";
import sinonChai from "sinon-chai";

import CardReaderMonitor from "../src/CardReaderMonitor";

chai.use(sinonChai);

const expect = chai.expect;

describe("CardReaderMonitor", () => {
	it("creates CardReaderMonitor", () => {
		expect(CardReaderMonitor).to.exist;
	});
});
