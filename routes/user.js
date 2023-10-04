const express = require('express');
const { registerUser, loginuser , logoutUser, getAllUsers } = require('../contollers/user.controller');
const router = express();


router.post('/register',registerUser);
router.post('/login',loginuser);
router.post('/logout',logoutUser);
router.get('/getallusers/:userid',getAllUsers);

module.exports = router;        