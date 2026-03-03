# IMS Real - Insurance Management System

Full-stack insurance management application with role-based flows for users and admins.

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express + MongoDB (Mongoose)
- Auth: JWT (role-based access)
- File Uploads: Multer (claim documents)

## Project Structure
- `backend/` - Express API, auth, insurance, claims, admin/user routes
- `insurance-frontend/` - React client app

## Main Features
- User registration and login
- Role-based dashboards (User/Admin)
- Browse and purchase insurance policies
- Raise claims with optional document upload
- Admin claim review (approve/reject with remarks)
- Admin policy and user management

## Prerequisites
- Node.js 20.19+ (or newer)
- npm
- MongoDB Atlas (or local MongoDB)

## Environment Variables
Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Use a long random `JWT_SECRET` in production and rotate credentials if they were ever exposed.

Create `insurance-frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For production, set `VITE_API_BASE_URL` to your deployed backend API URL.

## Installation
Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../insurance-frontend
npm install
```

## Run Locally
Start backend:

```bash
cd backend
npm run dev
```

Start frontend (new terminal):

```bash
cd insurance-frontend
npm run dev
```

- Frontend default URL: `http://localhost:5173`
- Backend default URL: `http://localhost:5000`

## API Base Routes
- Auth: `/api/auth`
- User: `/api/user`
- Admin: `/api/admin`

## Notes
- Uploaded claim files are served from `/uploads`.
- Do not commit `.env` files.
- If you previously exposed credentials, rotate them before production use.

## Scripts
Backend (`backend/package.json`):
- `npm run dev` - start with nodemon
- `npm start` - start with node

Frontend (`insurance-frontend/package.json`):
- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview build

## Future Improvements
- Add automated tests (API + UI)
- Add refresh token flow
- Add CI pipeline
- Add Docker setup
