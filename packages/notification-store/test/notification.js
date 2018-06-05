"use strict";

import "babel-polyfill";
import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { Notification, __RewireAPI__ as NotificationAPI } from "../src/notification";

chai.use(sinonChai);

const expect = chai.expect;

class NotificationStore {
	static deleteNotification(notification) {
		return notification;
	}
}

describe("Notification class", () => {
	beforeEach(() => {
		NotificationAPI.__Rewire__("NotificationStore", NotificationStore);
	});

	describe("Static methods", () => {
		it("returns the notification types", () => {
			expect(Notification.availableTypes).to.eql({
				INFO: "I",
				ERROR: "E",
				WARNING: "W",
				SUCCESS: "S",
				NOTIFICATION: "N",
			});
		});

		it("returns the defaultOptions", () => {
			expect(Notification.defaultOptions).to.eql({
				handle: "system",
				target: "system",
				type: "N",
				timer: 0,
				scope: "root",
			});
		});

		describe("parseOptions(options)", () => {
			it("returns the defaultOptions if no options were provided", () => {
				expect(Notification.parseOptions()).to.eql(Notification.defaultOptions);
			});

			it("returns the default option for missing or empty options", () => {
				expect(Notification.parseOptions({
					handle: "test",
					target: "",
				})).to.eql({
					...Notification.defaultOptions,
					handle: "test",
				});
			});
		});
	});

	describe("Notification instance", () => {
		it("should use the default options if none are provided", () => {
			const notification = new Notification();
			const defaultOptions = Notification.defaultOptions;

			expect(notification.handle).to.equal(defaultOptions.handle);
			expect(notification.target).to.equal(defaultOptions.target);
			expect(notification.message).to.equal(defaultOptions.message);
			expect(notification.type).to.equal(defaultOptions.type);
			expect(notification.timer).to.equal(defaultOptions.timer);
			expect(notification.scope).to.equal(defaultOptions.scope);
		});

		it("should fall back to default options for those options not provided", () => {
			const notification = new Notification({
				handle: "stuff",
				scope: "things",
			});
			const defaultOptions = Notification.defaultOptions;

			expect(notification.handle).to.equal("stuff");
			expect(notification.target).to.equal(defaultOptions.target);
			expect(notification.message).to.equal(defaultOptions.message);
			expect(notification.type).to.equal(defaultOptions.type);
			expect(notification.timer).to.equal(defaultOptions.timer);
			expect(notification.scope).to.equal("things");
		});

		it("should have a clear function that calls the notification store", () => {
			const clear = sinon.spy(NotificationStore, "deleteNotification");
			const notification = new Notification();

			expect(typeof notification.clear).to.equal("function");
			notification.clear();
			expect(clear).to.be.calledWith(notification);
		});
	});
});
