import { Router } from 'express';
import { shareWithUser, createPublicLink, getShares, removeShare } from '../controllers/shareController';
import { authorize } from '../middleware/authorize';

const router = Router();

router.post('/', authorize, shareWithUser);
router.post('/link', authorize, createPublicLink);
router.get('/', authorize, getShares);
router.delete('/:id', authorize, removeShare);

export default router;
