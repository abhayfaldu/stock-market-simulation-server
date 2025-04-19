import { DB } from '../services/db'
import { Request, Response } from 'express'

const db = DB.getInstance()

const getUsers = (req: Request, res: Response) => {
  res.json(db.getUsers())
}

export default { getUsers }
