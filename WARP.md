# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Development Setup
```bash
# Install dependencies for both client and server
cd server && npm install
cd ../client && npm install
```

### Running the Application
```bash
# Start server (from server directory)
cd server && npm run dev

# Start client (from client directory) 
cd client && npm run dev
```

### Building and Testing
```bash
# Build client for production
cd client && npm run build

# Preview production build
cd client && npm run preview

# Lint client code
cd client && npm run lint

# Start server in production
cd server && npm start
```

## Architecture Overview

### Full-Stack Architecture
PairUp is a MERN stack travel planning platform with the following architecture:

- **Frontend**: React 19 + Redux Toolkit + Tailwind CSS (Vite-based)
- **Backend**: Express.js + MongoDB + JWT authentication
- **Real-time**: Socket.io for messaging (configured but implementation in progress)
- **Storage**: Cloudinary for image uploads, MongoDB for data persistence

### Key Architectural Patterns

#### Frontend State Management
- **Redux Toolkit** with multiple feature slices:
  - `authSlice`: User authentication and session management
  - `tripSlice`: Trip creation and management
  - `userSlice`: User profile and preferences
  - `locationSlice`: Geolocation services
  - `reviewSlice`: User reviews and ratings

#### Backend Structure
- **MVC Pattern**: Controllers handle business logic, models define data schemas
- **Middleware Architecture**: Authentication, file upload (multer), CORS, error handling
- **API Versioning**: All routes prefixed with `/api/v1`
- **Database**: MongoDB with Mongoose ODM, geospatial indexing for location-based queries

#### Authentication Flow
- **JWT-based**: Access tokens (short-lived) + Refresh tokens (long-lived)
- **Protected Routes**: Frontend `ProtectedRoute` component + backend `auth.middleware.js`
- **Session Management**: Redux state + HTTP-only cookies for refresh tokens

### Core Data Models

#### User Model
- Complex password validation (uppercase, lowercase, numbers, special chars)
- Travel preferences and language arrays
- Cloudinary avatar URLs
- JWT token generation methods

#### Trip Model
- Organizer/participants relationship
- GeoJSON location data with 2dsphere indexing
- Itinerary as embedded documents
- Date range validation and budget tracking

### Frontend Component Structure
```
src/
├── components/          # Reusable UI components
│   ├── container/       # Layout containers
│   ├── loader/          # Loading states
│   └── Navbar/          # Navigation components
├── features/            # Redux slices by domain
│   ├── auth/            # Authentication logic
│   ├── trip/            # Trip management
│   └── user/            # User profile
├── pages/               # Route-level components
│   ├── auth/            # Login/register pages
│   └── Post/            # Trip creation forms
└── store/               # Redux store configuration
```

### Backend API Structure
```
src/
├── controllers/         # Request handlers by domain
├── models/              # Mongoose schemas
├── routes/              # Express route definitions
├── middlewares/         # Custom middleware
├── utils/               # Helper functions and error handling
└── db/                  # Database connection
```

## Environment Variables

### Client (.env)
```env
VITE_BASE_URL=http://localhost:8000/api/v1
```

### Server (.env)
```env
PORT=8000
URI=mongodb://localhost:27017  # or MongoDB Atlas connection string
ACCESS_TOKEN_SECRET=your-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Development Notes

### API Endpoints Structure
- **Authentication**: `/api/v1/users/register`, `/api/v1/users/login`, `/api/v1/users/logout`
- **User Management**: `/api/v1/users/current-user`, `/api/v1/users/update-avatar`
- **Trip Management**: `/api/v1/users/trips/*` (nested under users)
- **Reviews**: `/api/v1/users/*` (review endpoints integrated with user routes)

### Key Technical Considerations
- **Location Services**: GeoJSON Point format for MongoDB geospatial queries
- **Image Upload**: Multer middleware + Cloudinary integration in `utils/cloudinary.js`
- **Error Handling**: Centralized error middleware using custom `ApiError` and `ApiResponse` classes
- **Async Operations**: Wrapped in `asyncHandler` utility for consistent error handling
- **CORS Configuration**: Configured for credentials and specific HTTP methods

### Database Patterns
- **Aggregation**: Uses `mongoose-aggregate-paginate-v2` for complex queries
- **Indexing**: Geospatial indexing on trip locations, text indexes on searchable fields
- **Relationships**: ObjectId references between Users, Trips, and Reviews
- **Validation**: Comprehensive schema validation with custom validators

### Frontend Routing
- **React Router v7**: Nested routes under main App component
- **Protected Routes**: HOC pattern for authentication-required pages
- **Location Context**: Custom LocationProvider for geolocation services throughout app
- **No Redux Persist**: Currently disabled but structure remains for future implementation
