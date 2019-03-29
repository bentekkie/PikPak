"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
exports.root = process.cwd();
exports.src = path.join(exports.root, 'src');
exports.client = path.join(exports.root, '..', '..', 'client');
exports.serverDir = path.join(exports.root, '..');
//# sourceMappingURL=pathUtil.js.map