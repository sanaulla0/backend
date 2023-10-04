
const express = require("express");

const router = express();

const {followUser, getFollowingList, getFollowerList, unfollowUser} = require('../contollers/follow.controller');
const {isAuth} = require('../middleware/AuthMiddleware');

router.post('/followUser/:userid',isAuth,followUser);
router.get('/getfollowingList/:userid',isAuth,getFollowingList);
router.get('/getfollowerList/:userid',isAuth,getFollowerList);
router.post('/unfollow/:userid',isAuth,unfollowUser);
module.exports = router;
