import { Router } from 'express';
import { initUpload, getFile, deleteFile, updateFile } from '../controllers/fileController';
import { authorize } from '../middleware/authorize';

const router = Router();

router.post('/init', authorize, initUpload);
router.get('/:id', authorize, getFile);
router.patch('/:id', authorize, updateFile);
router.delete('/:id', authorize, deleteFile);

export default router;
