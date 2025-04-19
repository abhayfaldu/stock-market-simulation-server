import { DB } from './db'
import { Stock } from '../types/types'

export class StockService {
  private static instance: StockService
  private db: DB
  private updateInterval: NodeJS.Timeout | null = null

  private constructor() {
    this.db = DB.getInstance()
  }

  public static getInstance(): StockService {
    if (!StockService.instance) {
      StockService.instance = new StockService()
    }
    return StockService.instance
  }

  private getRandomPriceChange(): number {
    return (Math.random() * 10 - 5) / 100
  }

  public updateStockPrices(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
    this.updateInterval = setInterval(() => {
      const stocks = this.db.getStocks()
      const updatedStocks = stocks.map((stock: Stock) => {
        const change = this.getRandomPriceChange()
        const newPrice = Math.max(stock.price * (1 + change), 0.01)
        return {
          ...stock,
          price: +newPrice.toFixed(2)
        }
      })
      this.db.updateStocks(updatedStocks)
    }, 1000)
  }
}
