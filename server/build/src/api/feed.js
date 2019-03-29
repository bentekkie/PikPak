"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
router.get('/', (req, res) => {
    console.log("hi");
    res.send({ message: "hi" });
});
exports.FeedRouter = router;
//# sourceMappingURL=feed.js.map