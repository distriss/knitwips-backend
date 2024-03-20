const express = require('express');
const router = express.Router();
const { newPattern, getPattern, getPatternList, likePattern } = require('../controllers/patternController');

router.route("/").get(getPatternList);
router.route("/newPattern").post(newPattern);

router.route("/:username/patterns/:patternId").get(getPattern);
router.route("/patterns/:patternId/like").put(likePattern)

module.exports = router;