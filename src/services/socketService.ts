import { Server, Socket } from 'socket.io'
import { Server as HttpServer } from 'http'
import { DB } from './db'
import { LeaderboardPayload } from '../types/types'
import config from '../config/config'

export class SocketServer {
  private static instance: SocketServer
  private io: Server
  private db: DB

  private constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: config.frontendUrl,
        methods: ['GET', 'POST'],
      },
    })
    this.db = DB.getInstance()
    this.setupSocketHandlers()
  }

  public static getInstance(httpServer?: HttpServer): SocketServer {
    if (!SocketServer.instance && httpServer) {
      SocketServer.instance = new SocketServer(httpServer)
    }
    return SocketServer.instance
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket: Socket) => {
      console.log('Client connected:', socket.id)

      socket.on('identify', ({ userId }: { userId: number }) => {
        console.log(`User ${userId} identified on socket ${socket.id}`)
        this.db.setCurrentUser(userId)
        this.updateData(userId)
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })
  }

  public updateData(userId: number): void {
    const users = this.db.getUsers()
    const holdings = this.db.getHoldings()
    const stocks = this.db.getStocks()

    const userProfits = users
      .map((user) => {
        const userHoldings = holdings.filter((h) => h.userId === user.id)
        const unrealizedProfit = userHoldings.reduce((total, holding) => {
          const stock = stocks.find((s) => s.id === holding.stockId)!
          return total + (stock.price - holding.averagePrice) * holding.quantity
        }, 0)

        return {
          userId: user.id,
          name: user.name,
          profit: user.realizedProfit + unrealizedProfit,
        }
      })
      .sort((a, b) => b.profit - a.profit)

    const payload: LeaderboardPayload = {
      holdings: this.db.getHoldings(),
      stocks: this.db.getStocks(),
      leaderboard: {
        top10: userProfits.slice(0, 10),
        myRank: userProfits.findIndex((up) => up.userId === userId) + 1,
        myProfit: userProfits.find((up) => up.userId === userId)?.profit || 0,
      },
    }

    this.io.emit('leaderboardUpdate', payload)
  }
}
