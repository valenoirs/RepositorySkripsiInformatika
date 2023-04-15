import { model, Schema } from 'mongoose'
import { IUser } from '../interface/user'

const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    nim: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isDosen: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
)

export const User = model<IUser>('User', UserSchema)
