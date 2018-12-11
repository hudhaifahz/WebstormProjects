/**
 * Created by rtholmes on 2016-10-31.
 */

import {expect} from 'chai';

import Math from "../src/Math";
import Log from "../src/Util";

describe("MathSpec", function () {

    var math: Math = null;
    beforeEach(function () {
        math = new Math();
    });

    afterEach(function () {
        math = null;
    });

    it("getJSON should fulfill empty array when given empty array", function () {
        return math.getJSON([]).then(function (value: Array<any>) {
            Log.test('Value: ' + value);
            expect(value).to.deep.equal([]);
        }).catch(function (err) {
            Log.test('Error: ' + err);
            expect.fail();
        })
    });
});
