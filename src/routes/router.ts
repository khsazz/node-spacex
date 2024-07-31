import { Router } from 'express';
import { getSavedLaunches, saveLaunch, deleteLaunch } from '../controllers/launchController';

const router = Router();

router.get('/', getSavedLaunches);
router.post('/', saveLaunch);
router.delete('/:id', deleteLaunch);

export default router;
