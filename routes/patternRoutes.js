const express = require('express');
const router = express.Router();
const { newPattern, getPattern, getPatternList, likePattern, savePattern, getFeaturedList } = require('../controllers/patternController');

router.route("/").get(getPatternList);
router.route("/newPattern").post(newPattern);

router.route("/featured").get(getFeaturedList);

router.route("/:username/patterns/:patternId").get(getPattern);
router.route("/patterns/:patternId/like").put(likePattern);
router.route("/patterns/:patternId/save").put(savePattern);

module.exports = router;