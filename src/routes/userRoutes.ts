import express from 'express'
import usersCtrl from '../controllers/usersCtrl'

const routes = express.Router()

routes.get('/', usersCtrl.getUsers)

export default routes
