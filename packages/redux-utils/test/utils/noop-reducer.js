'use strict';

import 'babel-polyfill';
import { default as chai, expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import noopReducer from '../../src/utils/noop-reducer';

chai.use(sinonChai);

describe('noopReducer', () => {
    it('should return a function that returns the provided state', () => {
        const state = {};

        expect(noopReducer(state, { type: 'LOAD', data: [] })).to.equal(state);
    });
});
