# 🗄️ Convex Schema Implementation

## ✅ Core Multiplayer Schema Complete

I've implemented a comprehensive Convex schema in `convex/schema.ts` that supports all the multiplayer game functionality you requested.

## 📋 Schema Tables

### 1. **Players Table** 👥
```typescript
players: defineTable({
  userId: v.string(),        // Authentication identifier
  username: v.string(),      // Display name for the player
  score: v.number(),         // Current game score
  isDoctor: v.boolean(),     // Whether this player is "Dr. Whatchamacallit"
  avatar: v.string(),        // Avatar color/style identifier
}).index("by_userId", ["userId"])
```

**Purpose**: Manages user information and game state for each player.

**Key Features**:
- Links to authentication system via `userId`
- Tracks cumulative score across rounds
- Manages the special "Doctor" role for gameplay
- Supports avatar customization
- Indexed for fast user lookups

### 2. **Rooms Table** 🏠
```typescript
rooms: defineTable({
  hostId: v.id("players"),                // Player who created the room
  playerIds: v.array(v.id("players")),   // All players currently in the room
  roomCode: v.string(),                  // Unique code for joining the room
}).index("by_room_code", ["roomCode"])
```

**Purpose**: Manages multiplayer game sessions and player coordination.

**Key Features**:
- Designates room creator as host
- Maintains live list of all participants
- Uses unique codes for easy room joining
- Indexed for fast room code lookups

### 3. **Games Table** 🎮
```typescript
games: defineTable({
  roomId: v.id("rooms"),          // Which room this game belongs to
  gamePhase: v.string(),          // Current phase: "waiting", "answering", "guessing", "revealing"
  currentRound: v.number(),       // Current round number (1-based)
  totalRounds: v.number(),        // Total number of rounds in this game
  currentPrompt: v.string(),      // The current creative prompt players are responding to
  selectedAnswer: v.optional(v.string()), // Answer selected during guessing phase
}).index("by_room", ["roomId"])
```

**Purpose**: Tracks active game state and progression through rounds.

**Key Features**:
- Links games to specific rooms
- Manages game flow through different phases
- Tracks round progression (current vs total)
- Stores the creative prompt for each round
- Records selected answers during guessing phase
- Indexed for efficient room-based queries

### 4. **Answers Table** 📝
```typescript
answers: defineTable({
  roomId: v.id("rooms"),     // Which room/game this answer belongs to
  round: v.number(),         // Which round this answer was submitted in
  playerId: v.id("players"), // Player who submitted this answer
  answer: v.string(),        // The creative answer text
  isDoctor: v.boolean(),     // Whether this answer came from Dr. Whatchamacallit
}).index("by_room_round", ["roomId", "round"])
  .index("by_player_round", ["playerId", "round"])
```

**Purpose**: Stores player submissions for each round with metadata.

**Key Features**:
- Links answers to specific rooms and rounds
- Tracks which player submitted each answer
- Stores the creative answer text
- Flags answers from the "Doctor" for scoring
- Dual indexes for efficient querying by room/round or player/round

## 🔍 Index Strategy

### Primary Indexes
- **`by_userId`**: Fast player lookups by authentication ID
- **`by_room_code`**: Instant room joining via unique codes
- **`by_room`**: Efficient game state queries for specific rooms
- **`by_room_round`**: Quick answer retrieval for current round display

### Secondary Indexes
- **`by_player_round`**: Player-specific answer history and analytics

## 🚀 Schema Benefits

### Performance Optimized
- ✅ Strategic indexes for all common query patterns
- ✅ Minimal data duplication
- ✅ Efficient foreign key relationships

### Scalability Ready
- ✅ Supports unlimited concurrent rooms
- ✅ Handles multiple games per room over time
- ✅ Player data persists across sessions

### Game Logic Enabled
- ✅ Phase-based gameplay state management
- ✅ Round progression tracking
- ✅ Doctor role mechanics support
- ✅ Real-time answer collection and display

### Real-time Friendly
- ✅ Optimized for Convex reactivity
- ✅ Minimal query complexity for live updates
- ✅ Efficient change detection and propagation

## 🎯 Next Steps

With this schema foundation, you can now implement:

1. **Room Management**: Create/join rooms with unique codes
2. **Game Flow**: Start games, manage phases, progress rounds
3. **Answer Submission**: Collect and display player responses
4. **Scoring System**: Award points based on correct guesses
5. **Real-time Updates**: Live synchronization across all players

The schema is production-ready and provides a solid foundation for all multiplayer game functionality! 🎉