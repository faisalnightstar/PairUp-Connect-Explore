# PairUp

PairUp is a community-driven travel planning platform that connects travelers, helps them share costs, and build lasting friendships while exploring the world. The platform offers features like trip planning, user reviews, and social interactions to enhance the travel experience.

---

## 📑 Table of Contents

-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Project Structure](#project-structure)
-   [Getting Started](#getting-started)
-   [API Documentation](#api-documentation)
-   [File Documentation](#file-documentation)
-   [Contributing](#contributing)
-   [License](#license)

---

## ✨ Features

### User Authentication

-   Secure signup/login
-   Social authentication
-   JWT-based authorization

### Profile Management

-   Manage personal information
-   Set travel preferences and language settings
-   View review history

### Trip Planning

-   Create and join trips
-   Location-based search
-   Cost-sharing calculator
-   Build trip itineraries

### Social Features

-   User ratings and reviews
-   Direct messaging
-   Share trip photos
-   Match with travel buddies

---

## 🛠 Tech Stack

### Frontend

-   **React.js**: Component-based UI library
-   **Redux Toolkit**: State management
-   **Tailwind CSS**: Utility-first CSS framework
-   **Socket.io-client**: Real-time communication

### Backend

-   **Node.js**: JavaScript runtime
-   **Express.js**: Web framework
-   **MongoDB**: NoSQL database
-   **Socket.io**: Real-time communication

### Cloud Services

-   **AWS S3**: Image storage
-   **MongoDB Atlas**: Cloud database
-   **Cloudinary**: Image optimization and management

---

## 📁 Project Structure

```
PairUp/
├── client/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── features/         # Redux slices and logic
│   │   ├── api/              # API integration
│   │   └── utils/            # Utility functions
│   └── public/               # Static assets
└── server/
    ├── src/
    │   ├── controllers/      # Request handlers
    │   ├── models/           # Database models
    │   ├── routes/           # API routes
    │   ├── middlewares/      # Custom middlewares
    │   └── utils/            # Utility functions
    └── public/               # Public assets
```

---

## 🚀 Getting Started

### Prerequisites

-   Node.js (v16 or higher)
-   MongoDB
-   npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/PairUp-Connect-Explore.git
cd PairUp-Connect-Explore
```

2. **Install dependencies**

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Environment Setup**

Create `.env` files in both client and server directories:

Server `.env`:

```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/pairup
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Client `.env`:

```env
VITE_BASE_URL=http://localhost:8000/api/v1
```

4. **Start the application**

```bash
# Start server (from server directory)
npm run dev

# Start client (from client directory)
npm run dev
```

---

## 📝 API Documentation

### Authentication Endpoints

```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh-token
```

### User Endpoints

```
GET /api/v1/users/profile
PUT /api/v1/users/profile
PATCH /api/v1/users/avatar
GET /api/v1/users/travel-history
```

### Trip Endpoints

```
POST /api/v1/trips
GET /api/v1/trips
GET /api/v1/trips/:id
PUT /api/v1/trips/:id
DELETE /api/v1/trips/:id
```

### Review Endpoints

```
POST /api/v1/reviews
GET /api/v1/reviews/user/:userId
PUT /api/v1/reviews/:id
DELETE /api/v1/reviews/:id
```

---

## 📂 File Documentation

### Client Files

1. **`src/components/TripPostCard.jsx`**

    - **Description**: Displays a card for a trip post with details like cover image, title, and navigation to trip details.
    - **Example Usage**:
        ```jsx
        <TripPostCard tripItem={tripData} />
        ```
    - **Key Functions**:
        - `handleUserClick(tripId)`: Navigates to the trip details page.

2. **`src/features/locationSlice.js`**

    - **Description**: Redux slice for managing user location data.
    - **Example Usage**:
        ```js
        dispatch(setLocation({ lat: 40.7128, lng: -74.006 }));
        ```
    - **Reducers**:
        - `setLocation`: Updates latitude and longitude.
        - `setLocationError`: Sets an error message.

3. **`src/pages/users/ViewOtherUserDetails.jsx`**
    - **Description**: Displays details of another user, including their trips and reviews.
    - **Example Usage**:
        ```jsx
        <ViewOtherUserDetails />
        ```
    - **Key Features**:
        - Fetches user data by username.
        - Displays user profile, trips, and reviews.

### Server Files

1. **`src/controllers/user.controller.js`**

    - **Description**: Handles user-related operations like registration, login, and profile updates.
    - **Example Usage**:
        ```js
        router.post("/register", registerUser);
        ```
    - **Key Functions**:
        - `registerUser`: Registers a new user.
        - `updateUserAvatar`: Updates the user's avatar.

2. **`src/models/user.model.js`**

    - **Description**: Defines the schema for the `User` collection in MongoDB.
    - **Example Schema**:
        ```js
        const userSchema = new Schema({
            username: { type: String, required: true, unique: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
        });
        ```

3. **`src/routes/user.routes.js`**

    - **Description**: Defines API routes for user-related operations.
    - **Example Routes**:
        ```js
        router.post("/register", registerUser);
        router.post("/login", loginUser);
        ```

4. **`src/utils/cloudinary.js`**
    - **Description**: Utility functions for uploading and managing images on Cloudinary.
    - **Example Usage**:
        ```js
        const imageUrl = await uploadOnCloudinary(localFilePath);
        ```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

-   Your Name - Initial work

---

## 🙏 Acknowledgments

-   Hat tip to anyone whose code was used
-   Inspiration
-   etc
