import { Router } from 'express'
import * as user from '../controllers/user'

export const router = Router()

router.post('/', user.signIn)

router.get('/signout', user.signOut)

router.put('/', user.updatePassword)
