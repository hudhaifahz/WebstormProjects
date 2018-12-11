"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Math_1 = require("../src/Math");
const Util_1 = require("../src/Util");
describe("MathSpec", function () {
    var math = null;
    beforeEach(function () {
        math = new Math_1.default();
    });
    afterEach(function () {
        math = null;
    });
    it("getJSON should fulfill empty array when given empty array", function () {
        return math.getJSON([]).then(function (value) {
            Util_1.default.test('Value: ' + value);
            chai_1.expect(value).to.deep.equal([]);
        }).catch(function (err) {
            Util_1.default.test('Error: ' + err);
            chai_1.expect.fail();
        });
    });
});
//# sourceMappingURL=MathSpec.js.map