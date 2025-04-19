import { SocketServer } from './socket'
import { Holding, Stock, User } from '../types/types'

const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const stocks: Stock[] = [
  { id: 1001, price: 100, name: 'TATA MOTORS' },
  { id: 1002, price: 1200, name: 'RELIANCE INDUSTRIES' },
  { id: 1003, price: 850, name: 'INFOSYS' },
  { id: 1004, price: 720, name: 'HDFC BANK' },
  { id: 1005, price: 500, name: 'ICICI BANK' },
  { id: 1006, price: 2500, name: 'HUL' },
  { id: 1007, price: 1500, name: 'BHARTI AIRTEL' },
  { id: 1008, price: 3000, name: 'ASIAN PAINTS' },
  { id: 1009, price: 410, name: 'ITC' },
  { id: 1010, price: 1700, name: 'BAJAJ FINANCE' },
  { id: 1011, price: 980, name: 'WIPRO' },
  { id: 1012, price: 620, name: 'TCS' },
  { id: 1013, price: 1350, name: 'MARUTI SUZUKI' },
  { id: 1014, price: 470, name: 'NTPC' },
  { id: 1015, price: 950, name: 'SUN PHARMA' },
  { id: 1016, price: 1850, name: 'ULTRATECH CEMENT' },
  { id: 1017, price: 2900, name: 'HCL TECH' },
  { id: 1018, price: 2100, name: 'ADANI ENTERPRISES' },
  { id: 1019, price: 600, name: 'COAL INDIA' },
  { id: 1020, price: 870, name: 'ONGC' },
]

const users: User[] = [
  { id: 1, name: 'Krishna', realizedProfit: 0 },
  { id: 2, name: 'Yudhisthir', realizedProfit: 0 },
  { id: 3, name: 'Bhim', realizedProfit: 0 },
  { id: 4, name: 'Arjun', realizedProfit: 0 },
  { id: 5, name: 'Nakul', realizedProfit: 0 },
  { id: 6, name: 'Sahadev', realizedProfit: 0 },
  { id: 7, name: 'Karna', realizedProfit: 0 },
  { id: 8, name: 'Duryodhana', realizedProfit: 0 },
  { id: 9, name: 'Kunti', realizedProfit: 0 },
  { id: 10, name: 'Dhritarashtra', realizedProfit: 0 },
  { id: 11, name: 'Draupadi', realizedProfit: 0 },
  { id: 12, name: 'Bhishma', realizedProfit: 0 },
  { id: 13, name: 'Dushasana', realizedProfit: 0 },
  { id: 14, name: 'Drona', realizedProfit: 0 },
  { id: 15, name: 'Abhimanyu', realizedProfit: 0 },
  { id: 16, name: 'Jaidrath', realizedProfit: 0 },
]

export class DB {
  private static instance: DB
  private users: User[] = []
  private stocks: Stock[] = []
  private holdings: Holding[] = []
  private socketServer: SocketServer
  private currentUser: User | null = null

  private constructor() {
    this.socketServer = SocketServer.getInstance()
    this.users = users
    this.stocks = stocks
    this.holdings = this.setInitialHoldings()
    this.currentUser = null
  }

  static getInstance(): DB {
    if (!DB.instance) {
      DB.instance = new DB()
    }
    return DB.instance
  }

  getUsers(): User[] {
    return this.users
  }

  getStocks(): Stock[] {
    return this.stocks
  }

  getHoldings(): Holding[] {
    return this.holdings
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  setCurrentUser(userId: number): void {
    this.currentUser = this.users.find(user => user.id === userId)!
    this.sendData()
  }

  updateStocks(updatedStocks: Stock[]): void {
    this.stocks = updatedStocks
    this.sendData()
  }

  updateHoldings(holdings: Holding[]): void {
    this.holdings = holdings
    this.sendData()
  }

  sendData(): void {
    if (this.socketServer && this.currentUser) {
      this.socketServer.updateData(this.currentUser.id)
    } else {
      this.socketServer = SocketServer.getInstance()
    }
  }

  setInitialHoldings(): Holding[] {
    const holdings: Holding[] = []
    for (let i = 0; i < 100; i++) {
      const stock = this.stocks[generateRandomNumber(0, this.stocks.length - 1)]
      const userId = generateRandomNumber(1, 16)
      if (holdings.find(h => h.userId === userId && h.stockId === stock.id)) {
        continue
      }
      holdings.push({
        id: Date.now() + i,
        userId,
        stockId: stock.id,
        quantity: generateRandomNumber(1, 100),
        averagePrice: stock.price,
      })
    }
    return holdings
  }
}
