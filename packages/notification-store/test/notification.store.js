'use strict';

import 'babel-polyfill';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { NotificationStore, __RewireAPI__ as NotificationStoreAPI } from '../src/notification.store';

chai.use(sinonChai);

const expect = chai.expect;

class NotificationStub {
    static parseOptions(options = {}) {
        return {...options};
    }
    constructor(options = {}) {
        Object.getOwnPropertyNames(options).forEach(prop => {
            this[prop] = options[prop];
        });
    }
}

const propTester = (prop, newValue, defaultValue, propValidation) => {
    return describe(prop, () => {
        it(`returns the ${prop} setting`, () => {
            expect(NotificationStore[prop]).to.equal(defaultValue);
        });

        it(`updates the ${prop} setting`, () => {
            NotificationStore[prop] = newValue;
            expect(NotificationStore[prop]).to.equal(newValue);
        });

        it(`updates the ${prop} setting with the default if an invalid value was provided`, () => {
            NotificationStore[prop] = newValue;
            NotificationStore[prop] = 'some value'
            if (propValidation) {
                expect(NotificationStore[prop]).to.equal(defaultValue);
            } else {
                expect(NotificationStore[prop]).to.equal('some value');
            }
        });
    });
};

describe('Notification store', () => {
    beforeEach(() => {
        NotificationStoreAPI.__Rewire__('Notification', NotificationStub);
    });

    describe('Static methods', () => {
        describe('getters & setters', () => {
            propTester('allowOverrides', true, false, true);
            propTester('defaultHandle', 'test', 'system');
            propTester('defaultTarget', 'test', 'system');
            propTester('defaultMessage', 'test', 'Something went wrong.');
            propTester('defaultScope', 'test', 'root');
            propTester('defaultTimer', 100, 0, true);

            describe('messages', () => {
                it('should return the stored messages', () => {
                    expect(NotificationStore.messages).to.eql({});
                });

                it('stores messages in the API', () => {
                    NotificationStore.messages = {
                        404: 'not found'
                    };

                    expect(Object.getOwnPropertyNames(NotificationStore.messages).length).to.equal(1);
                });

                it('does not overwrite messages if allowOverrides is false', () => {
                    NotificationStore.allowOverrides = false;

                    NotificationStore.messages = {
                        404: 'not found'
                    };

                    NotificationStore.messages = {
                        404: 'its gone!'
                    };

                    expect(NotificationStore.messages['404']).to.equal('not found');
                });

                it('overwrites messages if allowOverrides if true', () => {
                    NotificationStore.allowOverrides = true;

                    NotificationStore.messages = {
                        404: 'not found'
                    };

                    NotificationStore.messages = {
                        404: 'its gone!'
                    };

                    expect(NotificationStore.messages['404']).to.equal('its gone!');
                });
            });

            describe('options', () => {
                it('should return the store options', () => {
                    expect(NotificationStore.options).to.eql({
                        allowOverrides: false,
                        defaultHandle: 'system',
                        defaultTarget: 'system',
                        defaultMessage: 'Something went wrong.',
                        defaultScope: 'root',
                        defaultTimer: 0
                    });
                });

                it('should update the store options and fall back to defaults for missing options', () => {
                    NotificationStore.options = { allowOverrides: true };

                    expect(NotificationStore.options.allowOverrides).to.equal(true);
                    expect(NotificationStore.options.defaultTarget).to.equal('system');
                });
            });

            describe('subjects', () => {
                it('should return the stored subjects', () => {
                    const subjects = NotificationStore.subjects;

                    expect(subjects instanceof Map).to.be.true;
                    expect(subjects.size).to.equal(0);
                });
            });

            afterEach(() => {
                NotificationStore.resetStore();
            });
        });

        describe('subscriber(store)', () => {
            it('should throw an error if no store was provided', () => {
                expect(() => {
                    NotificationStore.subscriber();
                }).to.throw(Error);
            });

            it('should add a new subject for the provided store and update it with the current notifications', () => {
                sinon.spy(NotificationStore.subjects, 'set');

                const store = new NotificationStore({
                    404: 'not found'
                });
                store.triggerNotification('404');

                expect(NotificationStore.subjects.set).to.have.been.calledOnce;
                expect(NotificationStore.subjects.size).to.equal(1);

                const storeValue = NotificationStore.subjects.get(store).getValue();
                expect(Object.getOwnPropertyNames(storeValue)).to.contain('system');
                expect(storeValue.system.length).to.equal(1);
                expect(storeValue.system[0].handle).to.equal('404');
            });

            afterEach(() => {
                NotificationStore.resetStore();
            });
        });

        describe('getFlatTarget(targetKey)', () => {
            it('should return an empty array if the target was not found', () => {
                expect(NotificationStore.getFlatTarget()).to.eql([]);
                expect(NotificationStore.getFlatTarget('statusbar')).to.eql([]);
            });

            it('should return the notifications for the provided target as a flat array', () => {
                const store = new NotificationStore({
                    404: 'not found'
                });

                store.triggerNotification('404', 'statusbar');

                const notifications = NotificationStore.getFlatTarget('statusbar');

                expect(notifications.length).to.equal(1);
                expect(notifications[0].handle).to.equal('404');
            });

            afterEach(() => {
                NotificationStore.resetStore();
            });
        });

        describe('getFlatNotifications(target)', () => {
            it('should return the notifications for the provided target', () => {
                sinon.stub(NotificationStore, 'getFlatTarget');

                NotificationStore.getFlatNotifications('test');

                expect(NotificationStore.getFlatTarget).to.be.calledWith('test');

                NotificationStore.getFlatTarget.restore();
            });

            it('should return all notifications as a flat object if no target was provided', () => {
                const store = new NotificationStore({
                    404: 'not found'
                });

                store.triggerNotification('404', 'statusbar');

                const notifications = NotificationStore.getFlatNotifications();

                expect(Array.isArray(notifications)).to.be.false;
                expect(notifications.hasOwnProperty('statusbar')).to.be.true;
            });

            afterEach(() => {
                NotificationStore.resetStore();
            });
        });

        describe('deleteNotification(notification)', () => {
            let store;

            beforeEach(() => {
                store = new NotificationStore({
                    404: 'not found'
                });

                store.triggerNotification('404', 'statusbar');
                sinon.stub(NotificationStore, 'updateSubjects');
            });

            it('should throw an error if an invalid notification was provided', () => {
                expect(() => {
                    NotificationStore.deleteNotification();
                }).to.throw(Error);
                expect(() => {
                    NotificationStore.deleteNotification({
                        handle: 'system'
                    });
                }).to.throw(Error);
            });

            it('should stop execution if no target was found for the notification', () => {
                const notification = new NotificationStub({
                    handle: '404',
                    target: 'form'
                });

                NotificationStore.deleteNotification(notification);

                expect(NotificationStore.updateSubjects).to.not.have.been.called;
            });

            it('should clear the notification and update the subjects', () => {
                const notification = new NotificationStub({
                    handle: '404',
                    target: 'statusbar'
                });

                NotificationStore.deleteNotification(notification);

                expect(NotificationStore.updateSubjects).to.have.been.called;
            });

            afterEach(() => {
                NotificationStore.resetStore();
                NotificationStore.updateSubjects.restore();
            });
        });

        describe('updateSubjects()', () => {
            it('should get the current notifications and update all stored subjects', () => {
                const store = new NotificationStore({
                    404: 'not found'
                });

                store.triggerNotification('404');

                const notifications = NotificationStore.getFlatNotifications();

                const storeSubject = NotificationStore.subscriber(store);


                sinon.stub(storeSubject, 'next');

                NotificationStore.updateSubjects();

                expect(storeSubject.next).to.have.been.calledWith(notifications);
            });

            afterEach(() => {
                NotificationStore.resetStore();
            });
        });

        describe('resetStore()', () => {
            it('should reset the store', () => {
                NotificationStore.allowOverrides = true;
                NotificationStore.defaultHandle = '404';
                NotificationStore.defaultTarget = 'statusbar';
                NotificationStore.defaultMessage = 'Woops!';

                const store = new NotificationStore({
                    404: 'not found'
                });

                store.triggerNotification('404');

                NotificationStore.resetStore();

                expect(NotificationStore.allowOverrides).to.be.false;
                expect(NotificationStore.defaultHandle).to.equal('system');
                expect(NotificationStore.defaultTarget).to.equal('system');
                expect(NotificationStore.defaultMessage).to.equal('Something went wrong.');
                expect(NotificationStore.messages).to.eql({});
                expect(NotificationStore.subjects.size).to.equal(0);
                expect(NotificationStore.getFlatNotifications()).to.eql({});
            });
        });
    });

    describe('NotificationStore instance', () => {
        it('should call the loadMessages method when instantiated', () => {
            const stub = sinon.stub(NotificationStore.prototype, 'loadMessages');

            const store = new NotificationStore();

            expect(stub.calledOnce).to.be.true;

            NotificationStore.prototype.loadMessages.restore();
        });

        describe('instance methods', () => {
            describe('getMessages()', () => {
                it('returns a copy of the stored messages', () => {
                    const messages = {
                        404: 'not found'
                    };

                    const store = new NotificationStore(messages);
                    const storedMessages = store.getMessages();

                    expect(storedMessages).to.eql({404: 'not found'});
                    expect(storedMessages !== messages).to.be.true;
                });
            });

            describe('loadMessages(messages)', () => {
                it('updates the messages in the API', () => {
                    const store = new NotificationStore();

                    store.loadMessages({
                        404: 'not found'
                    })

                    expect(NotificationStore.messages['404']).to.not.be.undefined;
                });

                afterEach(() => {
                    NotificationStore.resetStore();
                });
            });

            describe('triggerNotification(handle, target, options)', () => {
                let store;

                beforeEach(() => {
                    store = new NotificationStore({
                        404: 'not found'
                    });

                    sinon.stub(store, 'loadNotification');
                    sinon.stub(store, 'getMessage').returns('not found');
                });

                it('should use the default handle and target if none were provided', () => {
                    store.triggerNotification();

                    expect(store.loadNotification).to.be.calledWith({
                        handle: NotificationStore.defaultHandle,
                        target: NotificationStore.defaultTarget,
                        message: 'not found'
                    });
                });

                it('should set the provided target, handle and options', () => {
                    store.triggerNotification('404', 'bar', {
                        test: 'things'
                    });

                    expect(store.loadNotification).to.be.calledWith({
                        handle: '404',
                        target: 'bar',
                        message: 'not found',
                        test: 'things'
                    });
                });

                it('should overwrite the message if one was provided', () => {
                    store.triggerNotification('404', 'bar', {
                        message: 'content not found'
                    });

                    expect(store.loadNotification).to.be.calledWith({
                        handle: '404',
                        target: 'bar',
                        message: 'content not found'
                    });
                });
            });

            describe('getMessage(handle)', () => {
                let store;

                beforeEach(() => {
                    store = new NotificationStore({
                        404: 'not found',
                        replace: '<% replace %> <% parts %> <% in %> <% a %> <% message %>'
                    });
                });

                it('returns the defaultMessage if the handle was not found', () => {
                    expect(store.getMessage()).to.equal(NotificationStore.defaultMessage);
                    expect(store.getMessage('401')).to.equal(NotificationStore.defaultMessage);
                });

                it('returns the message for the provided handle', () => {
                    expect(store.getMessage('404')).to.equal('not found');
                });

                it('doesn\'t replace strings if the props are not provided in the replace options', () => {
                    expect(store.getMessage('replace')).to.equal('<% replace %> <% parts %> <% in %> <% a %> <% message %>');
                    expect(store.getMessage('replace', {
                        stuff: 'do',
                        things: 'test'
                    })).to.equal('<% replace %> <% parts %> <% in %> <% a %> <% message %>');
                });

                it('replaces parts of the string if they are found in the replace options', () => {
                    expect(store.getMessage('replace', {
                        replace: 'Thank',
                        parts: 'god',
                        in: 'it\'s',
                        a: 'all',
                        message: 'working!'
                    })).to.equal('Thank god it\'s all working!');
                });
            });

            describe('loadNotification(notification)', () => {
                beforeEach(() => {
                    sinon.stub(NotificationStore, 'updateSubjects');
                });

                it('throws an error if an invalid notification was provided', () => {
                    const store = new NotificationStore();

                    expect(() => {
                        store.loadNotification();
                    }).to.throw(Error);
                    expect(() => {
                        store.loadNotification({});
                    }).to.throw(Error);
                });

                it('adds the target if it is not yet present in the API', () => {
                    const store = new NotificationStore({
                        404: 'not found'
                    });
                    const notification = new NotificationStub({
                        handle: '404',
                        target: 'statusbar'
                    });

                    store.loadNotification(notification);

                    expect(NotificationStore.getFlatNotifications('statusbar')).to.not.be.empty;
                });

                it('updates the existing target', () => {
                    const store = new NotificationStore({
                        404: 'not found'
                    });
                    const notification = new NotificationStub({
                        handle: '404',
                        target: 'statusbar'
                    });
                    const nextNotification = new NotificationStub({
                        handle: '404',
                        target: 'statusbar'
                    });

                    store.loadNotification(notification);
                    store.loadNotification(nextNotification);

                    expect(NotificationStore.getFlatNotifications('statusbar').length).to.equal(2);
                });

                it('calls the static updateSubjects() method', () => {
                    const store = new NotificationStore({
                        404: 'not found'
                    });
                    const notification = new NotificationStub({
                        handle: '404',
                        target: 'statusbar'
                    });
                    store.loadNotification(notification);

                    expect(NotificationStore.updateSubjects.calledOnce).to.be.true;
                });

                afterEach(() => {
                    NotificationStore.resetStore();
                    NotificationStore.updateSubjects.restore();
                });
            });

            describe('getNotifications(target)', () => {
                it('should call the static getFlatNotifications method', () => {
                    const store = new NotificationStore();

                    sinon.stub(NotificationStore, 'getFlatNotifications');

                    store.getNotifications();

                    expect(NotificationStore.getFlatNotifications.calledOnce).to.be.true;

                    NotificationStore.getFlatNotifications.restore();
                });
            });

            describe('clearNotification(notification)', () => {
                it('should call the static deleteNotification method', () => {
                    sinon.stub(NotificationStore, 'deleteNotification');

                    const store = new NotificationStore();

                    store.clearNotification();

                    expect(NotificationStore.deleteNotification).to.have.been.calledOnce;

                    NotificationStore.deleteNotification.restore();
                });
            });

            describe('clearTarget(target)', () => {
                beforeEach(() => {
                    sinon.stub(NotificationStore, 'updateSubjects');
                });

                it('should throw an error if no target was provided', () => {
                    expect(() => {
                        const store = new NotificationStore();

                        store.clearTarget();
                    }).to.throw(Error);
                });

                it('should not update the subjects if the target does not exist', () => {
                    const store = new NotificationStore();

                    store.clearTarget('test');

                    expect(NotificationStore.updateSubjects.called).to.be.false;
                });

                it('should update the subjects if the target exists', () => {
                    const store = new NotificationStore({
                        404: 'not found'
                    });

                    store.triggerNotification('404', 'form');

                    store.clearTarget('form');

                    expect(NotificationStore.updateSubjects.calledTwice).to.be.true;
                });

                afterEach(() => {
                    NotificationStore.updateSubjects.restore();
                });
            });

            afterEach(() => {
                NotificationStore.resetStore();
            });
        });
    });
});