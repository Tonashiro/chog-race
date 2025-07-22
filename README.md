# 🏇 Chog Race - Multiplayer Horse Racing Game

A real-time multiplayer horse racing game built with React, TypeScript, and Croquet/React-Together for seamless multiplayer synchronization.


## 🎮 Live Demo

[Play the Game](https://your-deployment-url.com) | [Report Issues](https://github.com/your-username/chog-race/issues)

## ✨ Features

### 🏁 Real-Time Multiplayer Racing
- **Synchronized Game State**: All players see the same race progress in real-time
- **Dynamic Player Management**: Players can join/leave during idle state
- **Cross-Platform**: Works on desktop and mobile browsers
- **Room-Based**: Share URL to invite friends to the same race

### 🎯 Interactive Gameplay
- **Skill-Based Movement**: Click at the right moment to advance your horse
- **Progressive Difficulty**: Target gets smaller and cursor moves faster as you progress
- **Visual Feedback**: Particle effects and animations for successful hits
- **Progress Tracking**: Real-time display of all players' progress

### 🏆 Competitive Features
- **Race Timing**: Track how long each player takes to complete the race
- **Leaderboard**: Display final standings with trophies for winners
- **Trophy System**: 
  - 🥇 1st Place (Gold)
  - 🥈 2nd Place (Silver) 
  - 🥉 3rd Place (Bronze)
- **Completion Rules**: 
  - **< 3 players**: All players must finish (or 5-minute timeout)
  - **≥ 3 players**: Race ends when first 3 players finish

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on all screen sizes
- **Smooth Animations**: CSS transitions for horse movement and UI elements
- **Real-Time Stats**: Live display of player progress and race status
- **Connection Status**: Clear indicators for multiplayer connection state

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/chog-race.git
   cd chog-race
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Multiplayer Setup

1. **Open the game** in your browser
2. **Wait for connection** (you'll see "Connecting to multiplayer...")
3. **Invite friends** by sharing the URL
4. **Start the race** when everyone is ready!

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Multiplayer**: Croquet/React-Together
- **Styling**: Tailwind CSS
- **Build Tool**: Next.js 14
- **State Management**: React Hooks + Croquet synchronization

### Project Structure
```
src/
├── app/                    # Next.js app directory
│   └── page.tsx           # Main game page
├── components/            # React components
│   ├── GameArea.tsx       # Main game area
│   ├── GameControls.tsx   # Race control buttons
│   ├── GameStats.tsx      # Player statistics
│   ├── Leaderboard.tsx    # Race results
│   ├── ConnectionStatus.tsx # Connection handling
│   ├── RaceTrack.tsx      # Race track visualization
│   ├── Horse.tsx          # Individual horse component
│   ├── MoveGameBar.tsx    # Interactive movement game
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
│   ├── useMultiplayerRace.ts # Main game logic
│   ├── useDebouncedClick.ts  # Click handling
│   └── useRaceResults.ts     # Results calculation
├── utils/                 # Utility functions
│   ├── timing.ts          # Time formatting
│   ├── gameLogic.ts       # Game rules
│   └── leaderboard.ts     # Leaderboard logic
├── types/                 # TypeScript definitions
│   ├── index.ts           # Main types
│   └── shared.ts          # Shared interfaces
└── models/                # Game state models
    └── RaceModel.ts       # Race state management
```

### Key Components

#### 🎮 Game Flow
1. **Connection**: Players connect to multiplayer room
2. **Lobby**: Players join and wait for race to start
3. **Racing**: Interactive movement game with synchronized progress
4. **Results**: Leaderboard with timing and trophies
5. **Reset**: Start new race or return to lobby

#### 🔄 State Synchronization
- **Race State**: Centralized game state synchronized across all clients
- **Player Hits**: Individual player progress tracked in real-time
- **Timing Data**: Race start time and completion times synchronized
- **Connection Status**: Real-time connection monitoring

#### 🎯 Movement Game
- **Target Zone**: Green area that player must click
- **Moving Cursor**: Cursor moves back and forth across the bar
- **Progressive Difficulty**: Target gets smaller, cursor moves faster
- **Visual Feedback**: Particles and animations for successful hits

## 🎨 Customization

### Adding New Players
Edit the mock participants in `src/constants/participants.ts`:
```typescript
export const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: "new-player",
    name: "New Player",
    logo: "/path/to/logo.svg",
    color: "#FF6B6B",
  },
  // ... more players
];
```

### Modifying Game Rules
Adjust game settings in `src/models/RaceModel.ts`:
```typescript
static createInitialState(): RaceState {
  return {
    status: 'waiting',
    players: {},
    finishOrder: [],
    maxHits: 10, // Change required hits to finish
  };
}
```

### Styling Customization
The game uses Tailwind CSS. Customize styles in:
- `src/app/globals.css` - Global styles
- Component files - Individual component styling

## 🐛 Troubleshooting

### Common Issues

#### Connection Problems
- **"Connecting to multiplayer..." never ends**
  - Check your internet connection
  - Try refreshing the page
  - Disable VPN/proxy if using one

#### Game Not Starting
- **"Start Race" button doesn't work**
  - Ensure at least one player is connected
  - Check browser console for errors
  - Try the "Force Reset" button

#### Synchronization Issues
- **Players see different states**
  - Refresh all browser windows
  - Check if all players are properly connected
  - Use "Test Sync" button to verify synchronization

### Debug Tools
- **Console Logs**: Check browser console for detailed debugging
- **Test Sync Button**: Verify state synchronization
- **Force Reset**: Reset game state if stuck
- **Connection Status**: Monitor multiplayer connection

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**: Ensure multiplayer functionality works
5. **Submit a pull request**

### Development Guidelines
- **TypeScript**: All code must be properly typed
- **Component Structure**: Follow existing patterns
- **State Management**: Use Croquet synchronization for multiplayer state
- **Testing**: Test with multiple browser windows


## 🙏 Acknowledgments

- **Croquet/React-Together**: For seamless multiplayer synchronization
- **React Team**: For the amazing framework
- **Tailwind CSS**: For the utility-first styling
- **Next.js Team**: For the excellent development experience

---

**Made with ❤️ by Tonashiro**

*Ready to race? Start the game and challenge your friends!* 🏇
