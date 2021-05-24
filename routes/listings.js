import express from 'express';
import catchAsync from '../utils/catchAsync.js';
import { isAuthenticated } from '../utils/middleware.js';
import { getCommentListing, getListing } from '../controllers/listings.js';

const router = express.Router();

router.get('/comments/:sort', getCommentListing);

router.get('/:sort/user', isAuthenticated, catchAsync(getListing));
router.get('/:sort/:scope', catchAsync(getListing));

export default router;
