# Full-Stack-Blog-App

## Environment setup

Create `.env` files from the provided examples.

- Backend: copy `backend/env.example` to `backend/.env` and update values
  - `PORT=3000`
  - `MONGODB_URI=mongodb://127.0.0.1:27017/blogApp`
  - `JWT_SECRET=change_me`

- Frontend: copy `frontend/env.example` to `frontend/.env` and update values
  - `VITE_API_BASE_URL=http://localhost:3000`
  - `VITE_PORT=5173` (optional)