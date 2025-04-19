import { DB } from "../services/db";
import { Request, Response } from 'express'

const db = DB.getInstance()

const getStocks = (req: Request, res: Response) => {
  const { userId, stockId, quantity } = req.body

  const validationError = validateTradeBody(req.body)
  if (validationError) {
    res.status(400).json(validationError)
    return
  }

  const user = db.getUsers().find(u => u.id === userId)
  if (!user) {
    res.status(400).json({ error: 'User not found' })
    return
  }
  const stock = db.getStocks().find(s => s.id === stockId)
  if (!stock) {
    res.status(400).json({ error: 'Stock not found' })
    return
  }

  let holdings = db.getHoldings()
  const existingHolding = holdings.find(
    (h) => h.userId === userId && h.stockId === stockId,
  )
  if (existingHolding) {
    const oldQuantity = existingHolding.quantity
    const oldPrice = existingHolding.averagePrice
    
    existingHolding.quantity += quantity
    existingHolding.averagePrice = Number(
      (
        (existingHolding.averagePrice * oldQuantity +
          quantity * stock.price) /
        (oldQuantity + quantity)
      ).toFixed(2),
    )
  } else {
    holdings.push({
      id: holdings.length + 1,
      userId,
      stockId, 
      quantity,
      averagePrice: Number(stock.price.toFixed(2)),
    })
  }
  db.updateHoldings(holdings)
  res.json({ success: true })
}

const sellStock = (req: Request, res: Response) => {
  const { userId, stockId, quantity } = req.body

  const validationError = validateTradeBody(req.body)
  if (validationError) {
    res.status(400).json(validationError)
    return
  }

  try {
    const user = db.getUsers().find((u) => u.id === userId)
    if (!user) {
      res.status(400).json({ error: 'User not found' })
      return
    }

    const stock = db.getStocks().find((s) => s.id === stockId)
    if (!stock) {
      res.status(400).json({ error: 'Stock not found' })
      return
    }

    let holdings = db.getHoldings()
    const existingHolding = holdings.find(
      (h) => h.userId === userId && h.stockId === stockId,
    )

    if (!existingHolding) {
      res.status(400).json({ error: 'Stock not found in holdings' })
      return
    }

    if (existingHolding.quantity < quantity) {
      res.status(400).json({ error: 'Insufficient quantity' })
      return
    }

    existingHolding.quantity -= quantity
    let profit = (existingHolding.averagePrice - stock.price) * quantity
    if (existingHolding.quantity === 0) {
      holdings = holdings.filter((h) => h.id !== existingHolding.id)
      db.updateHoldings(holdings)
    } else {
      existingHolding.averagePrice = Number(
        (
          (existingHolding.averagePrice * existingHolding.quantity -
            quantity * stock.price) /
          (existingHolding.quantity - quantity)
        ).toFixed(2),
      )
    }
    user.realizedProfit += profit
    db.updateHoldings(holdings)

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ message: 'Unexpected error', error })
  }
}

function validateTradeBody(body: any) {
  const { userId, stockId, quantity } = body
  let error
  if (!userId) error = 'Missing userId'
  if (!stockId) error = 'Missing stockId'
  if (!quantity) error = 'Missing quantity'
  if (quantity <= 0) error = 'Quantity must be greater than 0'
  if (error) return { error }
  return false
}

export default { getStocks, sellStock }
