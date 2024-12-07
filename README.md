# ShareCircle

**ShareCircle** is a community-driven platform designed for sharing and exchanging items, promoting sustainability and fostering a sense of community.

---

## Features

- **User Authentication**: Secure registration and login with JWT.
- **Avatar Upload**: Personalized profiles with user-uploaded avatars.
- **Item Management**:
  - Post, edit, and delete items.
  - Upload and display item images.
- **Recent Items Display**: Showcasing the latest shared items on the landing page.
- **Search Functionality**: Search items by keywords.
- **Chatroom**: Real-time communication between users using Socket.IO.
- **Geolocation**: Items categorized based on user proximity.

---

## Tech Stack

- **Frontend**: React, Axios, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT for secure API access
- **File Upload**: Multer for handling avatar and item image uploads
- **Real-time Communication**: Socket.IO for chat functionality
- **Deployment**: Node.js and MongoDB on a cloud server

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/sharecircle.git
   cd sharecircle
   
2.Install dependencies for backend:
  ```bash
  cd sharecircle-backend
  npm install




## Usage

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

