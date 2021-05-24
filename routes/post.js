import express from 'express';
import catchAsync from '../utils/catchAsync.js';
import { isAuthenticated } from '../utils/middleware.js';
import {
	createPost,
	getPost,
	updatePost,
	votePost,
} from '../controllers/post.js';

const router = express.Router();

router.route('/')
	.get(catchAsync(getPost))
	.post(isAuthenticated, catchAsync(createPost))
	.patch(isAuthenticated, catchAsync(updatePost))

router.post('/vote', isAuthenticated, catchAsync(votePost));

export default router;
