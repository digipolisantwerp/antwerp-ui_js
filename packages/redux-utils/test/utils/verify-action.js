'use strict';

import 'babel-polyfill';
import { default as chai, expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import verifyAction from '../../src/utils/verify-action';

chai.use(sinonChai);

describe('verifyAction', () => {
    it('should return false if type is not defined', () => {
        expect(verifyAction()).to.be.false;
    });

    it('should return false if action is not defined', () => {
        expect(verifyAction("test")).to.be.false;
    });

    it('should return false if action.type is not defined', () => {
        expect(verifyAction("test", {})).to.be.false;
    });

    it('should return false if the action type has the wrong namespace', () => {
        expect(verifyAction("test", { type: "news/load" })).to.be.false;
        expect(verifyAction("test/", { type: "news/load" })).to.be.false;
    });

    it('should return true if the action type has the right namespace', () => {
        expect(verifyAction("test", { type: "test/load" })).to.be.true;
    });
});
