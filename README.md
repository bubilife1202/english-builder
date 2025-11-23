# Vocab Voxel: English Builder

An educational 3D voxel game for learning English vocabulary and sentence structure, inspired by Minecraft.

## 🎮 Game Features

- **3D Voxel World**: Explore a Minecraft-style world built with React-Three-Fiber
- **Word Collection**: Break blocks to collect English words (nouns, verbs, adjectives)
- **Sentence Building**: Combine words in Subject-Verb-Object order
- **Text-to-Speech**: Hear your sentences pronounced using Web Speech API
- **Health System**: Earn health by creating correct sentences
- **Persistent World**: Your world saves automatically to browser LocalStorage

## 🎯 Target Audience

Elementary school students (grades 3-6) learning English vocabulary and basic sentence structure.

## 🛠️ Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **Three.js** - 3D graphics
- **React-Three-Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **@react-three/cannon** - Physics engine
- **Zustand** - State management
- **TypeScript** - Type safety
- **LocalStorage** - Client-side data persistence

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

## 🎮 How to Play

1. **Click to lock cursor** - Move your mouse to look around
2. **WASD** - Move forward, backward, left, right
3. **Space** - Jump
4. **Left Click** - Break blocks (collect words)
5. **Right Click** - Place blocks
6. **Inventory** - View collected words on the right side
7. **Sentence Slots** - Click S/V/O buttons on inventory items to place words
8. **Speak Sentence** - Click the button to validate and speak your sentence

## 🌐 Deployment

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://www.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Netlify will auto-detect settings from `netlify.toml`
6. Click "Deploy"

Or use Netlify Drop:

```bash
npm run build
```

Then drag the `dist` folder to [Netlify Drop](https://app.netlify.com/drop).

## 📚 Educational Design

### Learning Mechanics

- **Color-coded blocks**:
  - 🟫 Wood = Nouns (Apple, Cat, Dog)
  - 🟫 Dirt = Verbs (Eat, Run, Jump)
  - 🟩 Grass = Adjectives (Big, Red, Fast)

- **Sentence Structure**:
  - Slot 1 (Red): Subject (noun)
  - Slot 2 (Blue): Verb
  - Slot 3 (Yellow): Object (noun/adjective)

- **Rewards**:
  - Correct sentences restore health
  - Web Speech API provides pronunciation

## 📁 Project Structure

```
src/
├── components/        # React components
│   ├── Player.tsx    # First-person controller
│   ├── Ground.tsx    # Voxel terrain
│   ├── BlockInteraction.tsx
│   ├── GameUI.tsx    # Inventory, health, sentence slots
│   └── ...
├── store/            # Zustand state management
│   └── useGameStore.ts
├── hooks/            # Custom React hooks
│   ├── useKeyboard.ts
│   └── useRaycast.ts
├── types/            # TypeScript definitions
│   └── index.ts
└── App.tsx           # Main app component
```

## 🎓 Educational Benefits

- **Vocabulary Building**: Learn new words through gameplay
- **Grammar Practice**: Understand sentence structure (S-V-O)
- **Pronunciation**: Hear correct pronunciation via TTS
- **Visual Learning**: Color-coded parts of speech
- **Gamification**: Fun, engaging learning experience

## 📄 License

MIT License - feel free to use this for educational purposes!

## 🙏 Credits

Inspired by Minecraft and educational language learning games.

Built with ❤️ for young English learners.
