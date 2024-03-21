const express = require('express');
const router = express.Router();
const { registerUser, authUser, getProfile, followUser } = require('../controllers/userController');

router.route("/").post(registerUser);
router.route("/login").post(authUser);

router.route("/profile/:username").get(getProfile);

router.route("/:username/follow").put(followUser);

module.exports = router;