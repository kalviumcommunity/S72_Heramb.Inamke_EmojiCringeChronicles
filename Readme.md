# Emoji Cringe Chronicles

A MERN stack application that allows users to create and share emoji combinations with descriptions. The application now supports both MongoDB and MySQL databases.

## Features

- User registration and authentication with JWT
- Create, read, update, and delete emoji combinations
- Filter emoji combinations by user
- REST API with Express.js
- React.js frontend with Tailwind CSS
- Dual database support (MongoDB and MySQL)

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB instance
- MySQL server (v8 or higher)

### Environment Variables

Create a `.env` file in the backend directory with the following content:

```
# MongoDB Configuration
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000

# MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=emoji_cringe_chronicles
DB_PORT=3306
```

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

### Database Setup

#### MySQL Setup

Run the following command to set up the MySQL database:

```
cd backend
npm run setup-db
```

This will:
- Create the database if it doesn't exist
- Create all required tables
- Seed the database with sample users and emoji combinations

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm run dev
   ```

3. Access the application at http://localhost:5173

## API Endpoints

### MongoDB Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/emoji-combos` - Get all emoji combinations
- `POST /api/emoji-combos` - Create a new emoji combination
- `GET /api/emoji-combos/:id` - Get a single emoji combination
- `PUT /api/emoji-combos/:id` - Update an emoji combination
- `DELETE /api/emoji-combos/:id` - Delete an emoji combination
- `GET /api/my-emoji-combos` - Get current user's emoji combinations

### MySQL Endpoints

- `POST /api/sql/auth/register` - Register a new user
- `POST /api/sql/auth/login` - Login user
- `POST /api/sql/auth/logout` - Logout user
- `GET /api/sql/emoji-combos` - Get all emoji combinations
- `POST /api/sql/emoji-combos` - Create a new emoji combination
- `GET /api/sql/emoji-combos/:id` - Get a single emoji combination
- `PUT /api/sql/emoji-combos/:id` - Update an emoji combination
- `DELETE /api/sql/emoji-combos/:id` - Delete an emoji combination
- `GET /api/sql/my-emoji-combos` - Get current user's emoji combinations
- `GET /api/sql/users` - Get all users
- `GET /api/sql/user/:userId/emoji-combos` - Get emoji combinations by user

## Technologies Used

- **Frontend**: React, React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express
- **Databases**: MongoDB, MySQL
- **ORM/ODM**: Mongoose, Sequelize
- **Authentication**: JWT, bcrypt

## Entity Relationships

- User (id, username, email, password, createdAt, updatedAt)
- EmojiCombo (id, emojis, description, created_by, username, createdAt, updatedAt)

The `created_by` field in EmojiCombo is a foreign key reference to the User's id, establishing a relationship between users and their emoji combinations.

---

#### *Why I Chose This Project*  
"What I love about this project is its quirky nature—it's lighthearted, fun, and encourages creativity. But beyond that, it's a powerful learning opportunity.  
- I'll be building a full-stack application that integrates user-specific data, which is a key concept in web development.  
- It's also a chance to work on real-time interactions, from user authentication to dynamic community rankings.  
- Plus, designing an engaging user experience with a clean UI aligns perfectly with my learning goals.  

This project combines technical mastery with a dash of humor, making it an enjoyable yet challenging endeavor."

---

#### *Conclusion*  
"In summary, 'Emoji Cringe Chronicles' isn't just about bad emoji combos—it's about exploring creativity, building technical skills, and creating something that brings people together through humor. I'm thrilled about the potential this project has to help me grow as a developer while providing some good laughs along the way.  


 ---

 ### Render Link :- 
  - https://emojicringechronicles.onrender.com
  -

 ### CloudFlare :- 
 - https://s72-heramb-inamke-emojicringechronicles.pages.dev
