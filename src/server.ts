import express from 'express'
import { createServer } from 'http'
import bodyParser from 'body-parser';
import cors from 'cors';
import { SocketServer } from './services/socketService';
import { StockService } from './services/StockService';
import stockRoutes from './routes/stockRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

const httpServer = createServer(app)
const stockService = StockService.getInstance()
SocketServer.getInstance(httpServer)

app.use(bodyParser.json());
app.use(cors());

app.use('/stocks', stockRoutes)
app.use('/users', userRoutes)

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  stockService.updateStockPrices()
})
