# 🚀 Quick Start Guide - Dr. Whatchamacallit Multiplayer Game

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
bun install
```

### 2. Set Up Convex
```bash
# Initialize Convex (if not already done)
bunx convex dev

# This will:
# - Create your Convex project
# - Generate your CONVEX_URL
# - Start the development server
```

### 3. Configure Environment Variables
Create `.env.local`:
```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud

# Clerk Authentication (optional - can use Convex auth instead)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
```

### 4. Start Development Server
```bash
bun dev
```

## 🎮 Game Features Ready to Play

### Core Multiplayer Mechanics
- ✅ **Room Creation & Joining**: Unique room codes for multiplayer sessions
- ✅ **Real-time Synchronization**: All players see live updates instantly
- ✅ **Phase-based Gameplay**: Answering → Guessing → Revealing → Next Round
- ✅ **Scoring System**: Points awarded for correct guesses and clever answers
- ✅ **Doctor Role**: Special player whose answers others try to identify

### Game Flow
1. **Menu** → **Setup** → **Lobby** → **Game Play** → **Results**
2. **Real-time Player Management**: See players join/leave instantly
3. **Answer Submission**: Creative responses to funny prompts
4. **Guessing Phase**: Identify which answer belongs to "Dr. Whatchamacallit"
5. **Score Tracking**: Live leaderboard with round-by-round scoring

## 🎯 How to Play

### For Host:
1. Navigate to `/game`
2. Click "Create Room" 
3. Share the room code with other players
4. Wait for players to join in the lobby
5. Click "Start Game" when ready (minimum 2 players)

### For Players:
1. Navigate to `/game`
2. Click "Join Room"
3. Enter the room code
4. Wait in lobby until host starts the game

### Gameplay:
1. **Answer Phase**: All players submit creative answers to the prompt
2. **Guess Phase**: Players vote on which answer belongs to Dr. Whatchamacallit
3. **Reveal Phase**: See the correct answer and score updates
4. **Next Round**: Continues for 5 rounds (configurable)
5. **Results**: Final leaderboard and play again option