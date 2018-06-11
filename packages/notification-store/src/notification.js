import { NOTIFICATION_TYPES, NOTIFICATION_DEFAULTS } from "./notification.conf";

export class Notification {
	static get defaultOptions() {
		return { ...NOTIFICATION_DEFAULTS };
	}
	static get availableTypes() {
		return { ...NOTIFICATION_TYPES };
	}
	static parseOptions(options = {}) {
		const result = {};

		for (const prop in NOTIFICATION_DEFAULTS) {
			result[prop] = options[prop] || NOTIFICATION_DEFAULTS[prop];
		}

		return result;
	}

	constructor(options = {}) {
		options = {
			...NOTIFICATION_DEFAULTS,
			...options,
		};

		this.handle = options.handle;
		this.target = options.target;
		this.message = options.message;
		this.type = options.type;
		this.timer = options.timer;
		this.scope = options.scope;
	}
}
