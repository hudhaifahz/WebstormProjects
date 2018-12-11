/**
 * This is the main programmatic entry point for D0.
 */

import Log from "./Util";

interface IMath {
    getJSON(urls: string[]): Promise<Array<any>>;
    add(urls: string[]): Promise<number>;
}

export default class Math implements IMath {
    constructor() {
        Log.trace('Math::init()');
    }

    getJSON(urls: string[]): Promise<Array<any>> {
        return new Promise(function (fulfill, reject) {
            // TODO: implement
            // Uncommenting the line below should make one test pass
            fulfill([]);
        });
    }

    add(urls: string[]): Promise<number> {
        return new Promise(function (fulfill, reject) {
            // TODO: implement
            // fulfill(0);
        });
    }
}
