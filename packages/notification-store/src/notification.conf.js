export const NOTIFICATION_STORE_DEFAULTS = {
	allowOverrides: false,
	defaultHandle: "system",
	defaultTarget: "system",
	defaultMessage: "Something went wrong.",
	defaultScope: "root",
	defaultTimer: 0,
};

export const NOTIFICATION_TYPES = {
	INFO: "I",
	ERROR: "E",
	WARNING: "W",
	SUCCESS: "S",
	NOTIFICATION: "N",
};

export const NOTIFICATION_DEFAULTS = {
	handle: NOTIFICATION_STORE_DEFAULTS.defaultHandle,
	target: NOTIFICATION_STORE_DEFAULTS.defaultTarget,
	type: NOTIFICATION_TYPES.NOTIFICATION,
	timer: NOTIFICATION_STORE_DEFAULTS.defaultTimer,
	scope: NOTIFICATION_STORE_DEFAULTS.defaultScope,
};
