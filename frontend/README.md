# BlogApp Frontend

A modern React-based frontend for the BlogApp platform built with TypeScript. This frontend provides a complete user interface for all the backend functionality including authentication, blog management, real-time notifications, and more.

![Frontend Home](https://github.com/user-attachments/assets/7b849c1c-9a4a-4324-a8a9-f880a68c9ccf)
![Login Page](https://github.com/user-attachments/assets/a364e2f6-d2b7-4bae-bc85-113a6b2e0158)
![Signup Page](https://github.com/user-attachments/assets/6c7e808c-996c-4535-9871-2bf43239e49a)

## 🚀 Features

### Authentication System
- **Local Authentication**: Email/password signup and login
- **Google OAuth**: Single-click Google authentication
- **Token Management**: Automatic JWT token handling with refresh
- **Protected Routes**: Role-based route protection
- **Persistent Sessions**: Automatic session restoration

### Blog Management
- **View Posts**: Clean, responsive blog post feed
- **Create Posts** (Admin only): Rich post creation form
- **Edit Posts** (Admin only): In-place post editing
- **Delete Posts** (Admin only): Secure post deletion
- **Like System**: Like/unlike posts with real-time counts

### Real-time Features
- **Live Notifications**: WebSocket-based real-time notifications
- **User Signup Alerts**: Admins get instant notifications of new user signups
- **Connection Management**: Automatic WebSocket connection handling

### User Experience
- **Responsive Design**: Mobile-first responsive layout
- **Loading States**: Smooth loading indicators
- **Error Handling**: Comprehensive error messages
- **Form Validation**: Client-side form validation
- **Character Limits**: Visual character count indicators

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Routing**: React Router DOM
- **HTTP Client**: Axios with interceptors
- **WebSockets**: Socket.IO client
- **Styling**: Custom CSS with modern design
- **State Management**: React Context + useReducer
- **Build Tool**: Create React App

## 📦 Installation & Setup

### Prerequisites
- Node.js (>= 16.x)
- npm or yarn
- Running BlogApp backend (see main README)

### Quick Start

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   # Edit .env file and set:
   REACT_APP_API_URL=http://localhost:3000
   REACT_APP_NAME=BlogApp
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

5. **Open your browser:**
   ```
   http://localhost:3000
   ```

## 🔧 Available Scripts

```bash
# Development
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## 🌐 API Integration

The frontend integrates with the BlogApp backend API:

- **Authentication**: `/auth/*` endpoints
- **Posts**: `/post/*` endpoints  
- **Likes**: `/like/*` endpoints
- **Users**: `/user/*` endpoints
- **WebSocket**: Real-time event handling

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
```env
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_NAME=BlogApp
```

## 🤝 Integration with Backend

This frontend is designed to work seamlessly with the BlogApp NestJS backend:

1. **Start the backend server** (see main README)
2. **Ensure database is running** (PostgreSQL + Redis)
3. **Start the frontend development server**
4. **Access the application** at `http://localhost:3000`

## 📖 Usage Guide

### For Regular Users
1. **Sign up/Login**: Create account or sign in
2. **Browse Posts**: View all published blog posts
3. **Like Posts**: Like or unlike posts
4. **Real-time Updates**: See live post updates

### For Admins
1. **All User Features**: Plus admin capabilities
2. **Create Posts**: Write and publish new blog posts
3. **Edit Posts**: Modify existing posts
4. **Delete Posts**: Remove posts
5. **View Notifications**: Get real-time user signup alerts

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure backend server is running on port 3000
   - Check REACT_APP_API_URL in .env file

2. **WebSocket Connection Issues**
   - Verify backend WebSocket server is enabled
   - Check browser console for connection errors

3. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check for TypeScript errors: `npm run build`