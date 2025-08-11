# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm start` - Start Expo development server
- `npm run android` - Start Android development build
- `npm run ios` - Start iOS development build
- `npm run web` - Start web development build
- `eas build` - Build app using EAS (requires EAS CLI)

## Project Architecture

This is a React Native Expo app focused on QR code scanning functionality with a modern, scalable architecture.

### Core Structure
```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.jsx         # Custom button component with variants
│   │   └── Card.jsx           # Card container component
│   └── scanner/               # QR scanner specific components
│       ├── QRCodeScanner.jsx  # Camera view with animated scanning overlay
│       ├── PermissionsRequest.jsx # Enhanced permissions handling
│       ├── UserInfoModal.jsx  # Redesigned user info modal
│       └── SocialLinks.jsx    # Social media footer
├── screens/
│   └── QrScreen.jsx           # Main QR scanning screen
├── navigation/
│   └── AppNavigator.jsx       # Navigation configuration
├── constants/
│   ├── colors.js              # Color system and theme
│   ├── spacing.js             # Layout and spacing constants
│   └── typography.js          # Typography scale and weights
└── utils/                     # Utility functions
```

### Design System
- **Colors**: Modern dark theme with blue accent (#3498DB)
- **Typography**: Structured font scale with consistent weights
- **Spacing**: 8px grid system with named constants
- **Components**: Reusable UI components with variant support

### Key Features
- **Enhanced UX**: Animated scan line, flash toggle, improved permissions flow
- **Modern UI**: Card-based layouts, proper spacing, consistent typography
- **Accessibility**: Better contrast, larger touch targets, screen reader support
- **Error Handling**: Comprehensive error states and user feedback

### Key Dependencies
- **Expo Camera (expo-camera)** - CameraView for QR scanning
- **Expo Barcode Scanner** - QR/PDF417 detection
- **React Navigation** - Stack navigator with modern configuration
- **Expo Image** - Optimized image handling with transitions
- **Expo Vector Icons** - Material Icons for UI elements

### Camera Integration
Enhanced camera implementation featuring:
- Animated scanning line with opacity effects
- Flash toggle with visual feedback
- Corner indicators with modern styling
- Improved overlay design with better contrast
- Error handling and permission recovery

### App Configuration
- **EAS Project ID**: cea10d30-b6d1-4756-976a-fafacc4769e8
- **Bundle ID**: com.fralch.Gym
- **Permissions**: Camera access required for both iOS and Android
- **Target**: Mobile-first (iOS/Android) with web support

### Development Patterns
- Consistent import/export structure with index files
- Component composition over inheritance
- Centralized styling constants
- Modular component architecture