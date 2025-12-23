# Repository Guidelines

## Project Structure & Module Organization
- Entry point: `App.js` (Expo/React Native).
- Source: `src/` — key folders:
  - `components/` (reusable UI, e.g., `ui/Button.jsx`, `scanner/`)
  - `screens/` (route screens, e.g., `QrScreen.jsx`, `StatsScreen.jsx`)
  - `navigation/` (stacks, navigators)
  - `contexts/`, `hooks/` (state, theming)
  - `constants/` (colors, spacing, typography)
  - `data/` and `Images/` (mock data, local assets)
- Config: `app.json`, `babel.config.js`, `eas.json`.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm start`: start Expo dev server (choose platform).
- `npm run android` | `npm run ios` | `npm run web`: launch platform targets.
- Tip: use the Expo QR or emulator to test changes quickly.

## Coding Style & Naming Conventions
- Indentation: 2 spaces; semicolons; single quotes in JS/JSX.
- React: functional components with hooks; avoid class components.
- Naming: components `PascalCase.jsx` (e.g., `ThemeToggle.jsx`), hooks `useX.ts/tsx|js/jsx` (e.g., `useTheme`), screens end with `Screen` (e.g., `UserInfoScreen.jsx`).
- Imports: use relative paths within `src/`; group external first, then internal.
- Formatting: prefer Prettier defaults; if adding ESLint, extend `react-native` + `plugin:react-hooks/recommended`.

## Testing Guidelines
- No test runner is configured yet. If adding tests:
  - Use `jest-expo` with React Native Testing Library.
  - Place tests under `src/__tests__/` or alongside files as `*.test.jsx`.
  - Aim for essential unit tests on hooks and pure components; snapshot sparingly.

## Commit & Pull Request Guidelines
- Commits: follow Conventional Commits seen in history (e.g., `feat(scanner): add QR screen`, `fix(screens): adjust StatusBar`). Keep messages imperative and scoped.
- PRs: include summary, motivation, screenshots/GIFs for UI changes, and tested platforms (Android/iOS/Web). Link related issues. Keep diffs focused.

## Security & Configuration Tips
- Do not hardcode secrets or API keys. Use Expo config (`app.config.js`) or EAS secrets; never commit credentials.
- Asset paths: store local images in `src/Images/`; prefer `expo-image` for performance.
- Theming: use `ThemeContext` and `useTheme` to ensure consistent colors/typography across components.

