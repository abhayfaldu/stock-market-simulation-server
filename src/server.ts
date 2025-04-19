import express from 'express'
import { createServer } from 'http'
import { SocketServer } from './config/socket';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes';
import { StockService } from './services/StockService';

const app = express();

const httpServer = createServer(app)
const stockService = StockService.getInstance()
SocketServer.getInstance(httpServer)

app.use(bodyParser.json());
app.use(cors());

app.use('/', routes)

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  stockService.startPriceUpdates()
})
