export declare class NotificationModule {}
export declare class Notification {
    handle: string;
    target: string;
    message: string;
    type: string;
    timer: number;
    scope: string;
    static readonly defaultOptions: any;
    static readonly availableTypes: any;
    static parseOptions(options?: any);
    constructor(options?: any);
    clear(): void;

}
export declare class NotificationStore {
    static allowOverrides: boolean;
    static defaultHandle: string;
    static defaultTarget: string;
    static defaultMessage: string;
    static defaultScope: string;
    static defaultTimer: number;
    static messages: any;
    static options: any;
    static readonly subjects: any;
    static subscriber(store: NotificationStore): any;
    static getFlatTarget(targetKey: string): any;
    static getFlatNotifications(target?: string): any;
    static deleteNotification(notification: any): void;
    static updateSubjects(): void;
    static resetStore(): void;
    notifications: any;
    constructor(newMessages?: any);
    getMessages(): any;
    getMessage(handle: string): string;
    loadMessages(newMessages: any): void;
    triggerNotification(handle?: string, target?: string, options?: any): void;
    loadNotification(notification: any): void;
    getNotifications(target?: string): any;
    clearNotification(notification: any): void;
    clearTarget(target: string): void;
}
