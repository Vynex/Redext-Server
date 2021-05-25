import express from 'express';
import catchAsync from '../utils/catchAsync.js';
import { isAuthenticated } from '../utils/middleware.js';
import {
	createComment,
	getComment,
	voteComment,
	destroyComment,
} from '../controllers/comment.js';

const router = express.Router();

router.route('/')
	.get(catchAsync(getComment))
	.post(isAuthenticated, catchAsync(createComment))
	.delete(isAuthenticated, catchAsync(destroyComment));

router.post('/vote', isAuthenticated, catchAsync(voteComment));

export default router;
