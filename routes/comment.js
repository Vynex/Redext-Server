import express from 'express';
import catchAsync from '../utils/catchAsync.js';
import { isAuthenticated } from '../utils/middleware.js';
import {
	createComment,
	getComment,
	voteComment,
} from '../controllers/comment.js';

const router = express.Router();

router.route('/')
	.get(catchAsync(getComment))
	.post(isAuthenticated, catchAsync(createComment))

router.post('/vote', isAuthenticated, catchAsync(voteComment));

export default router;
