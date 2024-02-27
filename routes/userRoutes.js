const express = require('express');
const router = express.Router();
const { registerUser, authUser, getProfile, followUser, unfollowUser } = require('../controllers/userController');

router.route("/").post(registerUser);
router.route("/login").post(authUser);

router.route("/profile/:username").get(getProfile);

router.route("/:username/follow").put(followUser);
router.route("/:username/unfollow").put(unfollowUser);

module.exports = router;