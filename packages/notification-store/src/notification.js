import { NotificationStore } from './notification.store';

const NOTIFICATION_TYPES = {
    INFO: 'I',
    ERROR: 'E',
    WARNING: 'W',
    SUCCESS: 'S',
    NOTIFICATION: 'N'
};
const defaultOptions = {
    handle: NotificationStore.defaultHandle,
    target: NotificationStore.defaultTarget,
    type: NOTIFICATION_TYPES.NOTIFICATION,
    timer: NotificationStore.defaultTimer,
    scope: NotificationStore.defaultScope
};

export class Notification {
    static get defaultOptions() {
        return {...defaultOptions};
    }
    static get availableTypes() {
        return {...NOTIFICATION_TYPES};
    }
    static parseOptions(options = {}) {
        const result = {};

        for (let prop in defaultOptions) {
            result[prop] = options[prop] || defaultOptions[prop];
        }

        return result;
    }

    constructor(options = {}) {
        options = {
            ...defaultOptions,
            ...options
        };

        this.handle = options.handle;
        this.target = options.target;
        this.message = options.message;
        this.type = options.type;
        this.timer = options.timer;
        this.scope = options.scope;
    }

    clear() {
        NotificationStore.deleteNotification(this);
    }
}
