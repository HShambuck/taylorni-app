# Taylorni Backend (Node.js + MongoDB)

## Requirements
- Node.js 20+
- MongoDB running locally (or any reachable MongoDB URI)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file:
   ```bash
   copy .env.example .env
   ```
3. Update `.env` if needed:
   - `PORT` (default: `8000`)
   - `MONGODB_URI` (default: `mongodb://127.0.0.1:27017`)
   - `MONGODB_NAME` (default: `taylorni_db`)
   - `JWT_SECRET`
4. Start server:
   ```bash
   npm run dev
   ```

## API Base
All endpoints are under `/api`.

Health check:
- `GET /api/health`

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

AI:
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

Payments & Wallet:
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
