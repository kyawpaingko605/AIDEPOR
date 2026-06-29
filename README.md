# AIDEPOR — AI Assistant Mobile App

A production-ready mobile AI chat application built with Expo + React Native and Material Design 3.

## Features

- 💬 **Multi-model Chat** — Chat with GPT-4o, Claude, Gemini, Llama, Mistral & 200+ models via OpenRouter
- 🔑 **BYOK (Bring Your Own Key)** — Add your own API keys for OpenAI, Anthropic, Google, and OpenRouter
- 📱 **Material Design 3** — Full M3 theme with dynamic colors, light/dark mode
- 🌊 **Streaming Responses** — Real-time token-by-token streaming
- 📝 **Markdown Support** — Renders code blocks, headers, bold, italic, etc.
- 💾 **Local History** — All chats stored locally on device with AsyncStorage
- 🔍 **Search** — Search through chat history
- ⚡ **Haptic Feedback** — Native haptic responses on actions

## Quick Start

### 1. Install Dependencies

```bash
npm install -g eas-cli
npx expo install
```

### 2. Configure API Keys

Get your free OpenRouter key at https://openrouter.ai and add it in the **Models** tab of the app.

### 3. Run Locally

```bash
# Start Expo dev server
npx expo start

# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android
```

### 4. Build for TestFlight (iOS)

```bash
# Login to EAS
eas login

# Configure EAS project
eas build:configure

# Build for TestFlight
eas build --platform ios --profile preview

# Submit to TestFlight
eas submit --platform ios
```

### 5. Build for Google Play (Android)

```bash
eas build --platform android --profile preview
eas submit --platform android
```

## Project Structure

```
AIDEPOR/
├── App.tsx                    # Root component
├── app.json                   # Expo config
├── eas.json                   # EAS build config
├── src/
│   ├── types/index.ts         # TypeScript types
│   ├── constants/models.ts    # AI model list
│   ├── theme/index.ts         # MD3 theme
│   ├── context/AppContext.tsx # Global state
│   ├── services/
│   │   ├── ai.ts              # OpenRouter API + streaming
│   │   └── storage.ts         # AsyncStorage helpers
│   ├── navigation/index.tsx   # React Navigation setup
│   ├── screens/
│   │   ├── ChatListScreen.tsx # Chat list + search
│   │   ├── ChatScreen.tsx     # Chat interface
│   │   ├── ModelsScreen.tsx   # API key management
│   │   └── SettingsScreen.tsx # App settings
│   └── components/
│       ├── ChatMessage.tsx    # Message bubble + markdown
│       ├── ChatInput.tsx      # Input bar
│       └── ModelSelector.tsx  # Model picker modal
└── assets/                    # Icons and splash screen
```

## App Store Preparation

### iOS
1. Create an App Store Connect app at https://appstoreconnect.apple.com
2. Update `eas.json` with your `appleId`, `ascAppId`, `appleTeamId`
3. Add app icons to `assets/` (1024x1024 PNG)
4. Run `eas build --platform ios --profile production`
5. Run `eas submit --platform ios`

### Android
1. Create a Google Play Console app
2. Download the service account JSON key
3. Update `eas.json` with the path
4. Run `eas build --platform android --profile production`
5. Run `eas submit --platform android`

## Adding Assets (Icons & Splash)

Replace these files with your own:
- `assets/icon.png` — 1024×1024 app icon
- `assets/adaptive-icon.png` — 1024×1024 Android adaptive icon (foreground)
- `assets/splash.png` — 1242×2436 splash screen
- `assets/favicon.png` — 48×48 web favicon

## Supported AI Models

| Model | Provider | Free |
|-------|----------|------|
| GPT-4o | OpenAI via OpenRouter | ❌ |
| GPT-4o Mini | OpenAI via OpenRouter | ❌ |
| Claude 3.5 Sonnet | Anthropic via OpenRouter | ❌ |
| Claude 3 Haiku | Anthropic via OpenRouter | ❌ |
| Gemini Pro 1.5 | Google via OpenRouter | ❌ |
| Llama 3.1 70B | Meta via OpenRouter | ❌ |
| Mistral 7B | Mistral via OpenRouter | ✅ |
| Phi-3 Mini | Microsoft via OpenRouter | ✅ |
| Gemma 2 9B | Google via OpenRouter | ✅ |

## Tech Stack

- **Expo** ~51.0 + React Native 0.74
- **React Navigation** 6 (Bottom Tabs + Native Stack)
- **React Native Paper** 5 (Material Design 3)
- **AsyncStorage** — local chat + settings persistence
- **react-native-markdown-display** — markdown rendering
- **Expo Haptics** — haptic feedback
- **EAS Build/Submit** — App Store deployment

## License

MIT
