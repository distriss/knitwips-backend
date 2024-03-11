const express = require('express');
const router = express.Router();
const { newPattern, getPattern } = require('../controllers/patternController');

router.route("/newPattern").post(newPattern);

router.route("/:username/patterns/:patternId").get(getPattern);

module.exports = router;