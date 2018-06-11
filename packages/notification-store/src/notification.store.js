import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Notification } from "./notification";
import escapeStringRegExp from "escape-string-regexp";
import { NOTIFICATION_STORE_DEFAULTS } from "./notification.conf";

const API = {
	options: { ...NOTIFICATION_STORE_DEFAULTS },
	messages: {},
	notifications: new Map(),
	subjects: new Map(),
};

export class NotificationStore {
	static get allowOverrides() {
		return API.options.allowOverrides;
	}
	static set allowOverrides(newValue = true) {
		API.options.allowOverrides = typeof newValue === "boolean" ? newValue : NOTIFICATION_STORE_DEFAULTS.allowOverrides;

		return API.options.allowOverrides;
	}
	static get defaultHandle() {
		return API.options.defaultHandle;
	}
	static set defaultHandle(newValue = NOTIFICATION_STORE_DEFAULTS.defaultHandle) {
		API.options.defaultHandle = newValue.toString();

		return API.options.defaultHandle;
	}
	static get defaultTarget() {
		return API.options.defaultTarget;
	}
	static set defaultTarget(newValue = NOTIFICATION_STORE_DEFAULTS.defaultTarget) {
		API.options.defaultTarget = newValue.toString();

		return API.options.defaultTarget;
	}
	static get defaultMessage() {
		return API.options.defaultMessage;
	}
	static set defaultMessage(newValue = NOTIFICATION_STORE_DEFAULTS.defaultMessage) {
		API.options.defaultMessage = newValue.toString();

		return API.options.defaultMessage;
	}
	static get defaultScope() {
		return API.options.defaultScope;
	}
	static set defaultScope(newValue = NOTIFICATION_STORE_DEFAULTS.defaultScope) {
		API.options.defaultScope = newValue.toString();

		return API.options.defaultScope;
	}
	static get defaultTimer() {
		return API.options.defaultTimer;
	}
	static set defaultTimer(newValue = NOTIFICATION_STORE_DEFAULTS.defaultTimer) {
		API.options.defaultTimer = typeof newValue === "number" ? newValue : NOTIFICATION_STORE_DEFAULTS.defaultTimer;

		return API.options.defaultTimer;
	}
	static get messages() {
		return { ...API.messages };
	}
	static set messages(newMessages = {}) {
		const messageLoader = [API.messages, newMessages];
		API.messages = NotificationStore.allowOverrides ? Object.assign({}, ...messageLoader) : Object.assign({}, ...messageLoader.reverse());

		return API.messages;
	}
	static get options() {
		return { ...API.options };
	}
	static set options(newOptions = NOTIFICATION_STORE_DEFAULTS) {
		API.options = { ...NOTIFICATION_STORE_DEFAULTS, ...newOptions };

		return API.options;
	}
	static get subjects() {
		return API.subjects;
	}
	static subscriber(store) {
		if (!store) {
			throw Error("No store provided to subscribe to!");
		}

		API.subjects.set(store, new BehaviorSubject(NotificationStore.getFlatNotifications()));

		return API.subjects.get(store);
	}
	static getFlatTarget(targetKey) {
		const notifications = [];
		const target = API.notifications.get(targetKey);

		if (target) {
			target.forEach(notification => {
				notifications.push(notification);
			});
		}

		return notifications;
	}
	static getFlatNotifications(target) {
		if (target) {
			return NotificationStore.getFlatTarget(target);
		}

		const notifications = {};

		API.notifications.forEach((value, t) => {
			notifications[t] = NotificationStore.getFlatTarget(t);
		});

		return notifications;
	}
	static deleteNotification(notification) {
		if (!notification || !(notification instanceof Notification)) {
			throw Error("Invalid notification provided.");
		}

		const target = API.notifications.get(notification.target);

		if (!target) {
			return;
		}

		target.delete(notification);

		NotificationStore.updateSubjects();
	}
	static updateSubjects() {
		const currNotifications = NotificationStore.getFlatNotifications();

		API.subjects.forEach(subject => {
			subject.next(currNotifications);
		});
	}
	static resetStore() {
		API.options = { ...NOTIFICATION_STORE_DEFAULTS };
		API.messages = {};
		API.notifications = new Map();
		API.subjects = new Map();
	}

	constructor(newMessages = {}) {
		this.loadMessages(newMessages);

		this.notifications = NotificationStore.subscriber(this);
	}

	getMessages() {
		return { ...API.messages };
	}

	getMessage(handle, replace = {}) {
		const msg = API.messages.hasOwnProperty(handle) ? API.messages[handle] : API.options.defaultMessage;
		const patterns = Object.getOwnPropertyNames(replace).map(prop => escapeStringRegExp(prop)).join("|");
		const pattern = new RegExp(`<% (${patterns}) %>`, "g");

		return msg.replace(pattern, (match, prop) => {
			return replace[prop];
		});
	}

	loadMessages(newMessages) {
		NotificationStore.messages = newMessages;
	}

	triggerNotification(handle = NotificationStore.defaultHandle, target = NotificationStore.defaultTarget, options = {}, replace = {}) {
		const notification = new Notification({
			message: options.message || this.getMessage(handle, replace),
			...Notification.parseOptions(options),
			handle: handle,
			target: target,
		});

		this.loadNotification(notification);
	}

	loadNotification(notification) {
		if (!notification || !notification.target) {
			throw Error("Invalid notification provided.");
		}

		if (!API.notifications.has(notification.target)) {
			API.notifications.set(notification.target, new Map());
		}

		const target = API.notifications.get(notification.target);

		target.set(notification, notification);

		NotificationStore.updateSubjects();
	}

	getNotifications(target) {
		return NotificationStore.getFlatNotifications(target);
	}

	clearNotification(notification) {
		NotificationStore.deleteNotification(notification);
	}

	clearTarget(target) {
		if (!target) {
			throw Error("No target provided.");
		}

		if (!API.notifications.has(target)) {
			return;
		}

		API.notifications.delete(target);

		NotificationStore.updateSubjects();
	}
}
