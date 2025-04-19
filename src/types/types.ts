export interface Leaderboard {
  top10: Array<LeaderBoardUser>
  myRank: number
  myProfit: number
}

export interface LeaderBoardUser {
  userId: number
  name: string
  profit: number
}

export interface Stock {
  id: number
  name: string
  price: number
} 

export interface Holding {
  id: number
  stockId: number
  userId: number
  quantity: number
  averagePrice: number
}

export interface User {
  id: number
  name: string
  realizedProfit: number
} 

export interface LeaderboardPayload {
  holdings: Holding[]
  stocks: Stock[]
  leaderboard: Leaderboard
}
