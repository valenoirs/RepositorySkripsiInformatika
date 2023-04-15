import { Request, Response } from 'express'
import { User } from '../models/user'
import { IUser } from '../interface/user'
import config from '../config/config'

/**
 * User Sign in controller
 * @param req Node HTTP Request
 * @param res Node HTTP Response
 * @returns HTTP Response
 */
export const signIn = async (req: Request, res: Response) => {
  try {
    const { nim, password } = req.body

    const user = await User.findOne({ nim })

    // Check if email registered
    if (!user) {
      req.flash('notification', 'Akun tidak ditemukan.')
      console.log('[SERVER]: Akun not found')
      return res.redirect('back')
    }

    // Check if password match
    if (password !== user.password) {
      req.flash('notification', 'Password salah.')
      console.log('[SERVER]: Incorrect password')
      return res.redirect('back')
    }

    const { id, name, isAdmin } = user

    // Create session
    const userSession: Pick<IUser, 'id' | 'name' | 'nim' | 'isAdmin'> = {
      id,
      name,
      nim,
      isAdmin,
    }

    req.session.user = userSession

    // Sign in success
    req.flash('notification', `Selamat Datang ${name.split(' ')[0]}.`)
    console.log('[SERVER]: User logged in.')
    return res.redirect('back')
  } catch (error) {
    // Sign in error
    req.flash(
      'notification',
      'Terjadi kesalahan saat mencoba masuk, coba lagi.'
    )
    console.error('[SERVER]: Sign in error.', error)
    return res.redirect('back')
  }
}

/**
 * User Sign out controller
 * @param req Node HTTP Request
 * @param res Node HTTP Response
 * @returns HTTP Response
 */
export const signOut = async (req: Request, res: Response) => {
  try {
    // Check if session id provided
    if (!req.session.user) {
      req.flash(
        'notification',
        'Terjadi kesalahan saat mencoba keluar, coba lagi.'
      )
      console.log('[SERVER]: No session id provided.')
      return res.redirect('/')
    }

    const { name } = req.session.user

    req.session.destroy((error: Error) => {
      if (error) throw error

      res.clearCookie(config.SESSION_COLLECTION_NAME)

      // Sign out success
      console.log(`[SERVER]: ${name} signed out.`)
      return res.redirect('/')
    })
  } catch (error) {
    // Sign out error
    req.flash(
      'notification',
      'Terjadi kesalahan saat mencoba keluar, coba lagi.'
    )
    console.error('[SERVER]: Sign out error.', error)
    return res.redirect('/')
  }
}

/**
 * User Sign out controller
 * @param req Node HTTP Request
 * @param res Node HTTP Response
 * @returns HTTP Response
 */
export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { password, passwordConfirmation, oldPassword } = req.body
    const { id } = req.session.user

    const user = await User.findById(id)

    if (!user) {
      req.flash('notification', `User tidak ditemukan.`)
      console.log(`[SERVER]: User not found, update password error.`)
      return res.redirect('/password')
    }

    if (user.password !== oldPassword) {
      req.flash('notification', `Gagal melakukan autentikasi, password salah.`)
      console.log(`[SERVER]: Update password failed, old password incorrect.`)
      return res.redirect('/password')
    }

    if (password !== passwordConfirmation) {
      req.flash('notification', `Konfirmasi password baru gagal.`)
      console.log(`[SERVER]: New Password confirmation failed.`)
      return res.redirect('/password')
    }

    await User.findByIdAndUpdate(id, { $set: { password } })

    req.flash('notification', `Password berhasil diperbarui.`)
    console.log(`[SERVER]: Update password success.`)
    return res.redirect('/')
  } catch (error) {
    req.flash(
      'notification',
      `Terjadi kesalahan saat mencoba memperbarui password, coba lagi.`
    )
    console.log(`[SERVER]: Update password error.`)
    return res.redirect('/password')
  }
}

export const search = async (req: Request, res: Response) => {
  try {
    const { category, column, query } = req.body

    if (category === 'mahasiswa') {
      return res.redirect(
        `/user/search?category=${category}&column=${column}&query=${query}`
      )
    }
    if (category === 'dosen') {
      return res.redirect(
        `/user/search?category=${category}&column=${column}&query=${query}`
      )
    }
  } catch (error) {
    req.flash(
      'notification',
      'Terjadi kesalahan saat melakukan pencarian, coba lagi.'
    )
    console.error('[SERVER]: User search error.', error)
    return res.redirect('/')
  }
}

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.body

    const user = await User.findById(id)

    if (!user) {
      req.flash('notification', 'User tidak ditemukan.')
      console.log('[SERVER]: User not found.')
      return res.redirect('back')
    }

    await User.findByIdAndDelete(id)

    req.flash('notification', 'User berhasil dihapus.')
    console.log('[SERVER]: User deleted.')
    return res.redirect('back')
  } catch (error) {
    req.flash(
      'notification',
      'Terjadi kesalahan saat menghapus user, coba lagi.'
    )
    console.error('[SERVER]: User delete error.', error)
    return res.redirect('/')
  }
}

export const edit = async (req: Request, res: Response) => {
  try {
    const { id } = req.body

    const user = await User.findById(id)

    if (!user) {
      req.flash('notification', 'User tidak ditemukan.')
      console.log('[SERVER]: User not found.')
      return res.redirect('back')
    }

    await User.findByIdAndUpdate(id, { $set: req.body })

    req.flash('notification', 'User berhasil diperbarui.')
    console.log('[SERVER]: User edited.')
    return res.redirect('back')
  } catch (error) {
    req.flash(
      'notification',
      'Terjadi kesalahan saat memperbarui user, coba lagi.'
    )
    console.error('[SERVER]: User edit error.', error)
    return res.redirect('/')
  }
}

export const add = async (req: Request, res: Response) => {
  console.log(req.body)
  try {
    const { nim, isDosen } = req.body

    delete req.body.isDosen

    const user = await User.findOne({ nim })

    if (user) {
      req.flash('notification', 'User dengan id yang sama telah terdaftar.')
      console.log('[SERVER]: User with same id found.')
      return res.redirect('/')
    }

    if (isDosen === 'Dosen') {
      req.body.isDosen = true
    }

    console.log(req.body)

    await new User(req.body).save()

    req.flash('notification', 'User berhasil disimpan.')
    console.log('[SERVER]: New user added.')
    return res.redirect('back')
  } catch (error) {
    req.flash(
      'notification',
      'Terjadi kesalahan saat proses tambah user, coba lagi.'
    )
    console.error('[SERVER]: User add error.', error)
    return res.redirect('/')
  }
}
