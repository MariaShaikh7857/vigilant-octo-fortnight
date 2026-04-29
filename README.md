# React Native + MySQL Application

A complete full-stack React Native application connected to MySQL with Express.js backend. This application includes user management and task management with real-time database synchronization.

## 📱 Features

- **User Management**: Create, read, update, and delete users
- **Task Management**: Create, read, update, and delete tasks with status tracking
- **Real-time Sync**: Instant database updates reflected in the UI
- **Tab Navigation**: Easy switching between Users and Tasks sections
- **Error Handling**: Comprehensive error handling and user feedback
- **MySQL Integration**: Complete database setup with connection pooling
- **RESTful API**: Clean and organized backend API endpoints

## 🗂️ Project Structure

```
├── App.js                          # Main app component with navigation
├── package.json                    # Dependencies configuration
├── .env.example                    # Environment variables template
├── server/
│   └── index.js                    # Express server with MySQL
├── src/
│   ├── components/
│   │   ├── UserCard.js            # User list item component
│   │   ├── TaskCard.js            # Task list item component
│   │   ├── AddUserModal.js        # User add/edit modal
│   │   └── AddTaskModal.js        # Task add/edit modal
│   ├── screens/
│   │   ├── UsersScreen.js         # Users management screen
│   │   └── TasksScreen.js         # Tasks management screen
│   ├── context/
│   │   ├── UserContext.js         # User state management
│   │   └── TaskContext.js         # Task state management
│   └── services/
│       └── api.js                  # API service layer
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MySQL (v5.7+)
- Expo CLI (for running React Native app)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vigilant-octo-fortnight
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=react_native_app
   PORT=3000
   EXPO_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. **Create MySQL database**
   ```sql
   CREATE DATABASE react_native_app;
   ```

### Running the Application

#### Option 1: Development Mode (Both Server & App)
```bash
npm run dev
```

#### Option 2: Separate Commands
```bash
# Terminal 1: Start Express server
npm run server

# Terminal 2: Start React Native app
npm start
```

#### Option 3: Run on Specific Platform
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📚 API Documentation

### Users Endpoints

- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID
- **POST** `/api/users` - Create new user
- **PUT** `/api/users/:id` - Update user
- **DELETE** `/api/users/:id` - Delete user

### Tasks Endpoints

- **GET** `/api/tasks` - Get all tasks
- **GET** `/api/tasks/:id` - Get task by ID
- **POST** `/api/tasks` - Create new task
- **PUT** `/api/tasks/:id` - Update task
- **DELETE** `/api/tasks/:id` - Delete task

### Health Check
- **GET** `/api/health` - Server status

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('pending', 'in-progress', 'completed') DEFAULT 'pending',
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🎨 UI Components

### UserCard
Displays user information with Edit and Delete buttons.

### TaskCard
Displays task information with status badge and Edit/Delete buttons.

### AddUserModal
Form modal for creating or editing users with fields:
- Name (required)
- Email (required)
- Phone (optional)

### AddTaskModal
Form modal for creating or editing tasks with fields:
- Title (required)
- Description (optional)
- Status (pending, in-progress, completed)

## 🔄 State Management

### UserContext
Manages all user-related state and operations:
- `users`: Array of user objects
- `loading`: Loading state
- `error`: Error messages
- `fetchUsers()`: Fetch all users
- `addUser()`: Create new user
- `updateUser()`: Update user
- `deleteUser()`: Delete user

### TaskContext
Manages all task-related state and operations:
- `tasks`: Array of task objects
- `loading`: Loading state
- `error`: Error messages
- `fetchTasks()`: Fetch all tasks
- `addTask()`: Create new task
- `updateTask()`: Update task
- `deleteTask()`: Delete task

## 🛠️ Technologies Used

- **Frontend**: React Native, Expo, React Navigation
- **Backend**: Express.js, Node.js
- **Database**: MySQL
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Icons**: Expo Vector Icons (Ionicons)

## 📝 Example Usage

### Creating a User
```javascript
const { addUser } = useContext(UserContext);

const newUser = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '555-1234'
};

await addUser(newUser);
```

### Creating a Task
```javascript
const { addTask } = useContext(TaskContext);

const newTask = {
  title: 'Complete project',
  description: 'Finish the React Native app',
  status: 'in-progress',
  user_id: 1
};

await addTask(newTask);
```

## 🐛 Troubleshooting

### MySQL Connection Error
- Ensure MySQL server is running
- Verify credentials in `.env` file
- Check if database exists

### API Connection Issues
- Verify server is running on correct port
- Check `EXPO_PUBLIC_API_URL` in `.env`
- Ensure firewall allows connections

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Feel free to open issues and pull requests.

## 📧 Support

For issues and questions, please open an issue on GitHub.
