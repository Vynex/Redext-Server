import express from 'express';
import catchAsync from '../utils/catchAsync.js';
import { isAuthenticated } from '../utils/middleware.js';
import {
	login,
	register,
	getUserPosts,
	getUserComments,
	getUserUpvotedPosts,
	getUserDownvotedPosts,
	getUserUpvotedComments,
	getUserDownvotedComments,
	getUserInfo,
} from '../controllers/user.js';

const router = express.Router();

router.post('/login', catchAsync(login));
router.post('/register', catchAsync(register));

router.get('/me/info', isAuthenticated, catchAsync(getUserInfo));

router.get('/me/posts', isAuthenticated, catchAsync(getUserPosts));
router.get('/me/comments', isAuthenticated, catchAsync(getUserComments));

router.get(
	'/me/posts/upvoted',
	isAuthenticated,
	catchAsync(getUserUpvotedPosts)
);
router.get(
	'/me/posts/downvoted',
	isAuthenticated,
	catchAsync(getUserDownvotedPosts)
);

router.get(
	'/me/comments/upvoted',
	isAuthenticated,
	catchAsync(getUserUpvotedComments)
);
router.get(
	'/me/comments/downvoted',
	isAuthenticated,
	catchAsync(getUserDownvotedComments)
);

export default router;
