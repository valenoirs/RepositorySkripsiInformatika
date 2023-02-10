import { Schema, model } from 'mongoose'
import { ISkripsi } from '../interface/skripsi'

const SkripsiSchema: Schema = new Schema<ISkripsi>(
  {
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    abstract: { type: String, required: true },
    keyword: { type: String, required: true },
    year: { type: String, required: true },
    uri: { type: String, required: true },
    admin: { type: String, required: true },
    // status: { type: String, required: true, default: 'Menunggu Approval' },
    pembimbingI: { type: String, required: true },
    pembimbingII: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

export const Skripsi = model<ISkripsi>('Skripsi', SkripsiSchema)
