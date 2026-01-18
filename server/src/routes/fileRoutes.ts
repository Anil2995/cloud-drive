import { Router } from 'express';
import { initUpload, getFile, deleteFile, updateFile, getStorageUsage, getRecentFiles, getStarredFiles, toggleStar } from '../controllers/fileController';
import { authorize } from '../middleware/authorize';

const router = Router();

router.post('/init', authorize, initUpload);
router.get('/storage-usage', authorize, getStorageUsage);
router.get('/recent', authorize, getRecentFiles);
router.get('/starred', authorize, getStarredFiles);
router.get('/:id', authorize, getFile);
router.patch('/:id', authorize, updateFile);
router.patch('/:id/star', authorize, toggleStar);
router.delete('/:id', authorize, deleteFile);

export default router;
