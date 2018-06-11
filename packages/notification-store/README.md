# Notification Store
The `aui-notification-store` provides a singleton store to save and easily access notifications throughout your app. You can load up a message map and trigger notifications by handle.
On top of that, you can set targets to hold your notifications (e.g. popups, statusbar, forms). Notifications are returned as `BehaviorSubjects`, allowing you to subscribe to changes.

## Installation

Install the package as a dependency:
```
npm install aui-notification-store --save
```

and simply import it where needed and create a new instance to start subscribing or launching new notifications:
```
import NotificationStore from 'aui-notification-store';

const store = new NotificationStore({
    404: 'not found'
});

store.triggerNotification('404', 'statusbar');
```

## Usage

### Loading messages

To load a message map simply provide it in the constructor:

```
import NotificationStore from 'aui-notification-store';

const store = new NotificationStore({
    404: 'not found'
});
```

If the `allowOverrides` option is set to true:
```
NotificationStore.allowOverrides = true;
```
you can overwrite the messages with each new instance:
```
const store2 = new NotificationStore({
    404: 'not here'
});
```
or, you can call the `loadMessages` method on the instance:
```
store.loadMessages({
    404: 'not here'
});
```

In either case, you need to set the `allowOverrides` option to true or the existing messages will be preserved.

### Triggering notifications

To trigger a notification, you call the `triggerNotification` method on your store instance. Provide a handle, a (optional) target and some (also optional) extra options:

```
const store = new NotificationStore({
    404: 'not found'
});

store.triggerNotification('404', 'statusbar', { timer: 1000 });
```

### Clearing notifications

You can clear a notification by calling the `clearNotification` method on the store:

```
const notifications = store.getNotifications('statusbar');
const notificationToClear = notifications.find(notification => notification.handle === 'clearme');

store.clearNotification(notificationToClear);
```

### Subscribing to notifications

Each instance has a `notifications` property, which holds all current notifications as a `BehaviorSubject` which you can subscribe to:

```
store.notifications.subscribe(newNotifications => {
    // do something
});
```
or fetch the current value from (which is an object with a Map of the notifications for each target:
```
const notifications = store.notifications.getValue();
```

## Available methods and properties
### Notification Class
**Static properties**
* `defaultOptions` **(object)**: returns a plain object with the default options
* `availableTypes` **(object)**: getter for the available notification types

**Static methods**
* `parseOptions(options)`: check the provided options against the default options

**Instance properties**
* `handle` **(string)**: the unique handle for the notification message
* `target` **(string)**: the target to store the notification with
* `message` **(string)**: the message to be shown when triggering the notification
* `type` **(string)**: the type of notification (N, I, E, W, S)
* `timer` **(number)**: the lifespan of the notification once it is shown (in ms)
* `scope` **(string)**: the app scope the notification should be visible in

### NotificationStore Class

**Static properties**
* `allowOverrides` **(boolean)**: get/set for the allowOverrides option
* `defaultHandle` **(string)**: get/set for the default handle to fall back to when triggering a notification
* `defaultTarget` **(string)**: get/set for the default target to fall back to when triggering a notification
* `defaultMessage` **(string)**: get/set for the default message to fall back to when triggering a notification
* `defaultTimer` **(number)**: get/set for the default timer to fall back to when triggering a notification
* `defaultScope` **(string)**: get/set for the default scope to fall back to when triggering a notification
* `messages` **(object)**: get/set for the available messages
* `options` **(object)**: get/set for the currently selected options
* `subjects` **(Map)**: getter for the current subjects

**Static methods**
* `subscriber(store)`: add a new BehaviorSubject for a store (internal function)
* `getFlatTarget(target)`: get the notifications as a flat array for a target (internal function)
* `getFlatNotifications(target)`: get the notifications (for a target if provided) as a flat object of target arrays (internal function)
* `deleteNotification(notification)`: delete a notification (internal function)
* `updateSubjects()`: trigger an update to all subjects (internal function)
* `resetStore()`: clear all messages and notifications and reset all options

**Instance properties**
* `notifications` **(BehaviorSubject)**: a BehaviorSubject that holds all current notifications

**Instance methods**
* `getMessages`: get the stored messages
* `getMessage(handle)`: get a message by its handle
* `loadMessages(messages)`: load a new set of messages (takes the `allowOverrides` option into account)
* `triggerNotification(handle, target, options)`: trigger a new notification by handle, target and provide some extra optional options
* `loadNotification(notification)`: load a new notification, needs a `Notification` instance
* `getNotifications(target)`: return a flat object holding all notifications or the notifications for the provided target
* `clearNotification(notification)`: clear a notification, needs a `Notification` instance
* `clearTarget(target)`: clear all notifications for a target, target is required