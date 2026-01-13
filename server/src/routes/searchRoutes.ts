import { Router } from 'express';
import { search } from '../controllers/searchController';
import { authorize } from '../middleware/authorize';

const router = Router();

router.get('/', authorize, search);

export default router;
