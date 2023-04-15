import { Router } from 'express'
import * as user from '../controllers/user'

export const router = Router()

router.post('/search', user.search)

router.post('/', user.signIn)

router.get('/signout', user.signOut)

router.put('/', user.updatePassword)

router.delete('/', user.remove)

router.patch('/', user.edit)

router.post('/new', user.add)
