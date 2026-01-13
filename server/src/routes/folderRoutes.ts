import { Router } from 'express';
import { createFolder, getFolder, updateFolder, deleteFolder } from '../controllers/folderController';
import { authorize } from '../middleware/authorize';

const router = Router();

router.post('/', authorize, createFolder);
router.get('/:id', authorize, getFolder);
router.patch('/:id', authorize, updateFolder);
router.delete('/:id', authorize, deleteFolder);

export default router;
