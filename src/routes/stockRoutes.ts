import express from 'express'
import stocksCtrl from '../controllers/stocksCtrl'

const routes = express.Router()

routes.post('/buy', stocksCtrl.getStocks)
routes.post('/sell', stocksCtrl.sellStock)

export default routes
