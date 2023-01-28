import { Router } from 'express'
import { upload } from '../utils/multer'
import * as skripsi from '../controllers/skripsi'

export const router = Router()

router.post('/search', skripsi.search)

router.post('/', upload.single('file'), skripsi.upload)

router.delete('/', skripsi.remove)

router.put('/', skripsi.edit)
