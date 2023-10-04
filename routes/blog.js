const express = require('express');
const router = express();


const {isAuth} = require('../middleware/AuthMiddleware');

const {createBlog ,getuserBlog,deleteblog, editblog, getHomepageBlogs} = require('../contollers/blog.controller');


router.post('/createBlog/:userId', isAuth, createBlog);
router.get('/getBlogData/:userId', isAuth,  getuserBlog);
router.delete('/deleteblog/:blogId', isAuth,  deleteblog); 
router.put('/editblog/:userid', isAuth,  editblog);
router.get('/homeblogs/:userid',getHomepageBlogs);


module.exports = router;


