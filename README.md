# ShareCircle

**ShareCircle** is a community-driven platform designed for sharing and exchanging items, promoting sustainability, and fostering a sense of community.

---

## Features

```plaintext
- **User Authentication**: Secure registration and login with JWT.
- **Avatar Upload**: Personalized profiles with user-uploaded avatars.
- **Item Management**:
  - Post, edit, and delete items.
  - Upload and display item images.
- **Recent Items Display**: Showcasing the latest shared items on the landing page.
- **Search Functionality**: Search items by keywords.
- **Chatroom**: Real-time communication between users using Socket.IO.
- **Geolocation**: Items categorized based on user proximity.
```

---

## Tech Stack

```plaintext
- **Frontend**: React, Axios, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT for secure API access
- **File Upload**: Multer for handling avatar and item image uploads
- **Real-time Communication**: Socket.IO for chat functionality
- **Deployment**: Node.js and MongoDB on a cloud server
```

---

## Installation

```bash
# 1. Clone the repository:
git clone https://github.com/your-username/sharecircle.git
cd sharecircle

# 2. Install dependencies for backend:
cd sharecircle-backend
npm install

# 3. Install dependencies for frontend:
cd ../sharecircle-frontend
npm install

# 4. Create a `.env` file in the backend with the following:
# MONGO_URI=your_mongo_connection_string
# JWT_SECRET=your_jwt_secret

# 5. Start the backend server:
cd ../sharecircle-backend
node server.js

# 6. Start the frontend development server:
cd ../sharecircle-frontend
npm start
```

---

## Usage

```plaintext
1. **Register and Login**
   - Users can sign up and log in securely using their email and password.
   - Users can upload a personalized avatar during profile setup.

2. **Post Items**
   - Create a new post by providing details such as item name, description, category, and location.
   - Upload up to 5 images for each item to showcase it effectively.

3. **Browse Items**
   - Explore the most recently shared items on the landing page.
   - Use the search bar to find specific items by keywords.

4. **Chat**
   - Engage in real-time conversations with other users in a dedicated chat room.
   - Connect with item owners for more details.

5. **Explore Nearby Towns**
   - View and browse items available in nearby communities.
   - Discover local sharing opportunities in towns close to your location.
```

---

## API Endpoints

### User Endpoints

```plaintext
POST /users/register - Register a new user
POST /users/login - Login and get a JWT token
GET /users/profile - Fetch the profile of the logged-in user
POST /users/:id/upload-avatar - Upload an avatar for the user
```

### Item Endpoints

```plaintext
POST /items - Create a new item
GET /items/recent - Fetch the most recent items
GET /items/:id - Fetch details of a specific item
GET /items/search?query= - Search items by name or description
```

### Chat Endpoints

```plaintext
Connect to chat rooms via WebSocket using the `/chat` namespace
```

---

## Contributions

```plaintext
Contributions are welcome! Please fork the repository and submit a pull request.
```

---

## License

```plaintext
This project is licensed under the MIT License.
```
```
