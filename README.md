# Portfolio - Three Interface Experience

A single-domain portfolio application with three completely separate interface experiences.

## Quick Start

### Frontend
```bash
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev  # or npm start for production
```

## Structure

```
/src
  /components/three     - R3F 3D components
  /pages                - Route pages
  /stores               - Zustand state management
  /themes               - Theme definitions (I1/I2/I3)
  /hooks                - Custom React hooks
  /utils                - Axios API instance

/backend
  /config               - DB connection
  /controllers          - Route handlers
  /middleware           - Auth middleware
  /models               - Mongoose models
  /routes               - Express routes
  /utils                - Encryption utilities
```

## Routes

- `/`         - Public Portfolio (cinematic, no auth)
- `/pro`      - Professional interface (email sign-in)
- `/pro/dashboard` - Professional dashboard
- `/ops`      - Ops passphrase entry
- `/ops/board` - Classified ops board (after auth)

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:
- MONGODB_URI
- JWT_SECRET
- JWT_REFRESH_SECRET
- ENCRYPTION_KEY (32-byte hex)
- OPS_PASSPHRASE_HASH (bcrypt hash of your passphrase)
