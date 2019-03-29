"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function throwError(resp) {
    console.error(resp);
    throw JSON.stringify(resp);
}
exports.throwError = throwError;
//# sourceMappingURL=IErrorResponse.js.map