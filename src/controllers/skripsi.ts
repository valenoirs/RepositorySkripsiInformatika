import { Request, Response } from 'express'
import { Skripsi } from '../models/skripsi'

export const upload = async (req: Request, res: Response) => {
  try {
    const { title, year } = req.body

    if (!req.file) {
      req.flash('notification', 'Format file yang di upload tidak sesuai.')
      console.log('[SERVER]: Incorrect file format.')
      return res.redirect('/')
    }

    const skripsi = await Skripsi.findOne({ title })

    if (skripsi) {
      req.flash(
        'notification',
        'Skripsi dengan judul yang sama telah terdaftar.'
      )
      console.log('[SERVER]: Skripsi with same title found.')
      return res.redirect('/')
    }

    if (year > 2023) {
      req.flash('notification', 'Tahun lebih besar dari tahun ini.')
      console.log('[SERVER]: Incorrect year.')
      return res.redirect('/')
    }

    req.body.uri = `/upload/skripsi/${req.file?.filename}`
    req.body.admin = req.session.user.name

    await new Skripsi(req.body).save()

    req.flash('notification', 'Skripsi berhasil diupload.')
    console.log('[SERVER]: New skripsi uploaded.')
    return res.redirect('/')
  } catch (error) {
    req.flash(
      'notification',
      'Terjadi kesalahan saat proses upload skripsi, coba lagi.'
    )
    console.error('[SERVER]: Skripsi upload error.', error)
    return res.redirect('/')
  }
}

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.body

    const skripsi = await Skripsi.findById(id)

    if (!skripsi) {
      req.flash('notification', 'Skripsi tidak ditemukan.')
      console.log('[SERVER]: Skripsi not found.')
      return res.redirect('/')
    }

    await Skripsi.findByIdAndDelete(id)

    req.flash('notification', 'Skripsi berhasil dihapus.')
    console.log('[SERVER]: Skripsi deleted.')
    return res.redirect('/')
  } catch (error) {
    req.flash(
      'notification',
      'Terjadi kesalahan saat menghapus skripsi, coba lagi.'
    )
    console.error('[SERVER]: Skripsi delete error.', error)
    return res.redirect('/')
  }
}

export const edit = async (req: Request, res: Response) => {
  try {
    const { id } = req.body

    const skripsi = await Skripsi.findById(id)

    if (!skripsi) {
      req.flash('notification', 'Skripsi tidak ditemukan.')
      console.log('[SERVER]: Skripsi not found.')
      return res.redirect('back')
    }

    await Skripsi.findByIdAndUpdate(id, { $set: req.body })

    req.flash('notification', 'Skripsi berhasil diubah.')
    console.log('[SERVER]: Skripsi edited.')
    return res.redirect('back')
  } catch (error) {
    req.flash(
      'notification',
      'Terjadi kesalahan saat mengubah skripsi, coba lagi.'
    )
    console.error('[SERVER]: Skripsi edit error.', error)
    return res.redirect('/')
  }
}

export const search = async (req: Request, res: Response) => {
  console.log(req.body)
  try {
    const { category, query } = req.body

    if (category === 'title') {
      return res.redirect(`/skripsi/search?category=${category}&query=${query}`)
    }
    if (category === 'author') {
      return res.redirect(`/skripsi/search?category=${category}&query=${query}`)
    }
    if (category === 'year') {
      return res.redirect(`/skripsi/search?category=${category}&query=${query}`)
    }
  } catch (error) {
    req.flash(
      'notification',
      'Terjadi kesalahan saat melakukan pencarian, coba lagi.'
    )
    console.error('[SERVER]: Skripsi search error.', error)
    return res.redirect('/')
  }
}
