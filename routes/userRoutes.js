const express = require('express');
const router = express.Router();
const { registerUser, authUser, getProfile } = require('../controllers/userController');

router.route("/").post(registerUser);
router.route("/login").post(authUser);
router.route("/profile/:username").get(getProfile);

module.exports = router;