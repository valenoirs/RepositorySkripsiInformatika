import { Router } from 'express'
import { Request, Response } from 'express'
import { Skripsi } from '../models/skripsi'
import { User } from '../models/user'

export const router = Router()

router.get('/skripsi/detail/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  const skripsi = await Skripsi.findById(id)

  return res.render('user/detail', {
    layout: 'layout',
    notification: req.flash('notification'),
    skripsi,
    category: 'title',
    query: '',
  })
})

router.get('/skripsi/search', async (req: Request, res: Response) => {
  const { category, query } = req.query

  let skripsi: any

  if (!category) {
    return res.redirect('/')
  } else if (category === 'title') {
    skripsi = await Skripsi.find({
      title: { $regex: query, $options: 'i' },
    }).sort({ title: 1 })
  } else if (category === 'author') {
    skripsi = await Skripsi.find({
      author: { $regex: query, $options: 'i' },
    }).sort({ author: 1 })
  } else if (category === 'year') {
    skripsi = await Skripsi.find({
      year: { $regex: query, $options: 'i' },
    }).sort({ year: 1 })
  }

  return res.render('user/skripsi', {
    layout: 'layout',
    notification: req.flash('notification'),
    skripsi,
    category,
    query,
  })
})

router.get('/user/search', async (req: Request, res: Response) => {
  if (!req.session.user && req.session.user.isAdmin) return res.redirect('/')

  const { category, column, query } = req.query

  let pengguna: any

  if (!category || !column) {
    return res.redirect('/')
  } else if (category === 'mahasiswa') {
    pengguna = await User.find({
      [column.toString()]: { $regex: query, $options: 'i' },
      isAdmin: false,
      isDosen: false,
    }).sort({ [column.toString()]: 1 })
  } else if (category === 'dosen') {
    pengguna = await User.find({
      [column.toString()]: { $regex: query, $options: 'i' },
      isAdmin: false,
      isDosen: true,
    }).sort({ [column.toString()]: 1 })
  }

  return res.render('user/user', {
    layout: 'layout',
    notification: req.flash('notification'),
    pengguna,
    category,
    column,
    query,
  })
})

router.get('/password', async (req: Request, res: Response) => {
  if (!req.session.user) return res.redirect('/')

  return res.render('user/password', {
    layout: 'layout',
    notification: req.flash('notification'),
  })
})

router.get('/', async (req: Request, res: Response) => {
  const skripsi = await Skripsi.find().sort({ _id: -1 }).limit(4)

  const totalSkripsi = await Skripsi.find().count()
  const totalUser = (await User.find().count()) - 1

  if (req.session.user && req.session.user.isAdmin) {
    return res.render('user/admin', {
      layout: 'layout',
      notification: req.flash('notification'),
      skripsi,
      totalSkripsi,
      totalUser,
    })
  }

  return res.render('user/index', {
    layout: 'layout',
    notification: req.flash('notification'),
    skripsi,
  })
})
