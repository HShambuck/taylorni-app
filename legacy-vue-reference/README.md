# Taylorni App

Taylorni is a mobile-first fashion platform that connects clients and designers in one workflow: onboarding, account access, marketplace discovery, order flow, messaging, rewards, and payment operations.

This repository is a monorepo with:
- `react-app/`: Expo + React Native app
- `backend/`: Node.js + Express + MongoDB API

## Architecture

### Mobile app (`react-app`)
- Expo / React Native runtime
- React Navigation (drawer + native stack)
- Redux Toolkit + React Redux state management
- AsyncStorage persistence
- Glassmorphic UI theme for public and route-driven screens

### Backend (`backend`)
- Express API
- MongoDB driver (no ORM)
- JWT auth (access + refresh)
- Reward points + referrals
- Wallet + transactions + payment methods
- Escrow lifecycle endpoints

## Repository structure

```text
.
+- backend/
¦  +- src/
¦  ¦  +- server.js
¦  +- .env.example
¦  +- package.json
+- react-app/
¦  +- src/
¦  ¦  +- assets/
¦  ¦  +- navigation/
¦  ¦  +- screens/
¦  ¦  +- services/
¦  ¦  +- store/
¦  +- app.json
¦  +- babel.config.js
¦  +- package.json
+- package.json
+- README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB running locally (default URI below)
- Expo Go app (for device testing) or Android/iOS emulator

## Quick start

### 1) Install dependencies

From repository root:

```bash
npm install
npm --prefix react-app install
npm --prefix backend install
```

### 2) Configure backend environment

Create `backend/.env` from example:

```bash
cp backend/.env.example backend/.env
```

Default values in `backend/.env.example`:

```env
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_NAME=taylorni_db
JWT_SECRET=change-me-in-production
ACCESS_TOKEN_EXPIRES_IN=2h
REFRESH_TOKEN_EXPIRES_IN=7d
```

### 3) Start backend

```bash
npm run backend:dev
```

### 4) Start mobile app

```bash
npm run mobile:start
```

Then open on:
- Expo Go (QR code)
- Android emulator
- iOS simulator (macOS)

## Root scripts

```bash
npm run mobile:start
npm run mobile:start:offline
npm run mobile:android
npm run mobile:android:offline
npm run mobile:ios
npm run mobile:ios:offline
npm run backend:dev
npm run backend:start
```

## Mobile app notes

- Entry: `react-app/index.js`
- Navigation root: `react-app/src/navigation/AppNavigator.js`
- Public flows/screens: `react-app/src/screens/publicScreens.js`
- Route-driven authenticated screens: `react-app/src/screens/routeScreens.js`
- Marketplace UI is implemented in the route screen templates and styled for mobile e-commerce presentation.

## Backend API overview

Base URL (local): `http://localhost:8000`

Health and auth:
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

AI/session:
- `POST /api/ai/chat`
- `GET /api/ai/quick-actions`
- `POST /api/ai/sessions/:session_id/end`

Rewards:
- `GET /api/rewards/points/:user_id`
- `GET /api/rewards/available/:user_id`
- `POST /api/rewards/redeem`
- `GET /api/rewards/transactions/:user_id`
- `POST /api/rewards/award`
- `GET /api/rewards/referrals/:user_id`
- `POST /api/rewards/referrals/generate`
- `POST /api/rewards/referrals/apply`

Payments and wallet:
- `POST /api/payments/intents`
- `POST /api/payments/card/process`
- `POST /api/payments/mobile-money/process`
- `GET /api/payments/mobile-money/verify/:reference`
- `GET /api/wallet/:user_id/balance`
- `POST /api/payments/wallet/process`
- `POST /api/wallet/:user_id/add-funds`
- `POST /api/wallet/:user_id/withdraw`
- `POST /api/payments/escrow/create`
- `POST /api/payments/escrow/:escrow_id/release`
- `GET /api/payments/transactions/:user_id`
- `GET /api/payments/methods/:user_id`
- `POST /api/payments/methods/:user_id`
- `DELETE /api/payments/methods/:user_id/:method_id`
- `PUT /api/payments/methods/:user_id/:method_id/default`

## Development workflow

1. Build features in `react-app/src/screens` and related `store` slices.
2. Integrate API calls via `react-app/src/services`.
3. Add/update backend handlers in `backend/src/server.js`.
4. Keep UI consistent with the established dark glassmorphic theme.

## Troubleshooting

- If backend fails to start:
  - Verify MongoDB is running
  - Verify `backend/.env` values
- If Expo has cache issues:
  - `npm --prefix react-app run start -- --clear`
- If API requests fail on device:
  - Ensure backend is reachable from device network (not just localhost).

## License

No license file is currently defined in this repository.