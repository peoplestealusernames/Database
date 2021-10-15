"use strict";
//TODO: add filename locations here
//TODO: impliment
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./DMClass"), exports);
__exportStar(require("./ConnectionClass"), exports);
__exportStar(require("./ClientAPI"), exports);
__exportStar(require("./ServerClass"), exports);
//TODO: check function that will return needed vars for server or client
//TODO: isSetup():bool thats automatic to be ref by other API (runs in test from index)
//TODO: Set*varname*(value) for all needed to be phrased
