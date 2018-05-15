'use strict';

import 'babel-polyfill';
import { default as chai, expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import targetReducer from '../../src/reducers/target';

chai.use(sinonChai);

const progressReducerMock = (type, reducer) => (state, action) => ({
    progress: reducer(state, action)
});

const verifyActionMock = (type, action) => true;

describe('targetReducer', () => {
    let verifySpy;

    beforeEach(() => {
        verifySpy = sinon.stub().returns(true);

        targetReducer.__Rewire__('progressReducer', progressReducerMock);
        targetReducer.__Rewire__('verifyAction', verifySpy);
    });

    it('should return a function', () => {
        expect(targetReducer()).to.be.a('function');
    });

    it('should return the state if verifyAction returns false', () => {
        verifySpy.returns(false);

        const reducer = targetReducer();
        const state = {};

        expect(reducer(state)).to.equal(state);
    });

    it('should return the state if action.target is not defined', () => {
        const reducer = targetReducer();
        const state = {};

        expect(reducer(state)).to.equal(state);
    });

    it('should return the reducer result on the target in the state', () => {
        const reducer = targetReducer({
            type: "test"
        }, (state, action) => action.data);
        const state = {};

        expect(reducer(state, {
            target: "test",
            data: ["test"]
        })).to.eql({
            test: ["test"]
        });
    });

    it('should return a progressReducer result if the progress option was true', () => {
        const reducer = targetReducer({
            type: "test",
            progress: true
        }, (state, action) => action.data);
        const state = {};

        expect(reducer(state, {
            target: "test",
            data: ["test"]
        })).to.eql({
            test: {
                progress: ["test"]
            }
        });
    });
});
