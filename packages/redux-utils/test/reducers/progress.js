'use strict';

import 'babel-polyfill';
import { default as chai, expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import shallowDeepEqual from 'chai-shallow-deep-equal';

import progressReducer from '../../src/reducers/progress';

chai.use(sinonChai);
chai.use(shallowDeepEqual);

describe('progressReducer', () => {
    it('should return a function', () => {
        expect(progressReducer()).to.be.a('function');
    });

    it('should return the state if no type was provided', () => {
        const reducer = progressReducer(undefined, (state, action) => ({
            ...state,
            ...action.data,
        }));

        expect(reducer({}, {
            data: {
                new: '2',
            },
        })).to.eql({});
    });

    it('should return a function that returns a progress wrapped state', () => {
        const reducer = progressReducer("TEST", (state, action) => ({
            ...state,
            ...action.data,
        }));

        expect(reducer({}, {
            type: "TEST/LOAD",
            data: {
                new: '2'
            },
        })).to.shallowDeepEqual({
            loading: false,
            error: null,
            result: {
                new: '2',
            },
        });
    });

    it('should use the defaults if no arguments are provided', () => {
        const reducer = progressReducer("TEST");

        expect(reducer({ result: { existing: '1' } }, { type: "TEST/LOAD", data: { new: '2' } })).to.shallowDeepEqual({
            loading: false,
            error: null,
            result: {
                existing: '1',
            },
        });
    });

    it('should not throw an error if the state is empty', () => {
        const reducer = progressReducer("TEST", (state = { new: '1' }) => state);

        expect(reducer(undefined, { type: "TEST/LOAD" })).to.shallowDeepEqual({
            loading: false,
            error: null,
            result: null,
        });
    });

    it('should return the loading state if action.loading is true', () => {
        const reducer = progressReducer("TEST", (state, action) => ({
            ...state,
            ...action.data,
        }));

        expect(reducer({}, { type: "TEST/LOAD", data: { new: '2' }, loading: true })).to.shallowDeepEqual({
            loading: true,
            error: null,
            result: null,
        });
    });

    it('should return the error state if action.error is defined', () => {
        const reducer = progressReducer("TEST", (state, action) => ({
            ...state,
            ...action.data,
        }));

        expect(reducer({}, { type: "TEST/LOAD", data: { new: '2' }, err: 'Something went wrong.' })).to.shallowDeepEqual({
            loading: false,
            error: 'Something went wrong.',
            result: null,
        });
    });

    it('should set the created & lastUpdated date on first update', () => {
        const reducer = progressReducer("TEST", (state, action) => ({
            ...state,
            ...action.data,
        }));

        const newState = reducer({}, { type: "TEST/LOAD", data: { new: '2' } });

        expect(newState).to.have.property('created');
        expect(newState.created).to.be.a('date');
        expect(newState).to.have.property('lastUpdated');
        expect(newState.lastUpdated).to.be.a('date');
    });

    it('should update the lastUpdated date on each update', (done) => {
        const now = new Date();
        const reducer = progressReducer("TEST", (state, action) => ({
            ...state,
            ...action.data,
        }));

        setTimeout(() => {
            const newState = reducer({
                lastUpdated: now,
            }, { type: "TEST/LOAD", data: { new: '2' } });

            expect(newState).to.have.property('lastUpdated');
            expect(newState.lastUpdated).to.be.a('date');
            expect(newState.lastUpdated.valueOf()).not.to.equal(now.valueOf());

            done();
        }, 100);
    });

    it('should not update the lastUpdated date if the state is unchanged', () => {
        const reducer = progressReducer("TEST", (state, action) => state);
        const now = new Date();

        const newState = reducer({
            lastUpdated: now,
        }, { type: "TEST/LOAD", data: { new: '2' } });

        expect(newState).to.have.property('lastUpdated');
        expect(newState.lastUpdated).to.be.a('date');
        expect(newState.lastUpdated).to.equal(now);
    });

    it('should not update the result if an irrelevant action type is dispatched', () => {
        const reducer = progressReducer("TEST", (state, action) => ({
            changed: true,
        }));

        const newState = reducer({
            result: {
                changed: false,
            },
        }, {
            type: "STUFF_LOAD",
            data: {
                changed: true,
            },
        });

        expect(newState.result).to.eql({
            changed: false,
        });
    });
});
