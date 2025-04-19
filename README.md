# Stock Market Simulation - Backend

Real-time stock market simulation backend with Socket.IO and REST APIs.

## Setup

```bash
git clone https://github.com/abhayfaldu/stock-market-simulation-server.git
cd stock-market-simulation-server
npm install
npm run dev
```

## Environment Variables

```env
PORT=8000
FRONTEND_URL=http://localhost:5173
```

## API Endpoints

### Users
- `GET /users` - Get all users

### Trading
- `POST /stocks/buy` - Buy stock
- `POST /stocks/sell` - Sell stock

## WebSocket Events

### Client -> Server
- `connection` - Connect with userId
- `disconnect` - Disconnect client

### Server -> Client
- `leaderboardUpdate` - Real-time leaderboard and data updates

## Tech Stack
- Node.js + TypeScript
- Express.js
- Socket.IO
- In-memory data store
