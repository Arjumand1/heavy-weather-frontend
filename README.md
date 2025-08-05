# Heavy Weather Frontend

A TodoMVC application frontend built with Vue3 and Quasar Framework.

## Features

- **Complete TodoMVC Interface** - Add, edit, complete, delete tasks
- **User Authentication** - Signup, login, logout with JWT
- **Password Reset** - Email-based password recovery
- **User Profile Management** - Edit user name
- **Professional UI** - Clean, responsive design with Quasar components
- **Task Details** - View full task information in dedicated dialogs
- **Advanced Filtering** - Filter tasks by status (all/active/completed)
- **Real-time Updates** - Optimistic UI updates with error handling
- **Mobile Responsive** - Works perfectly on all device sizes

## Tech Stack

- **Framework:** Vue 3 with Composition API
- **UI Library:** Quasar Framework
- **State Management:** Pinia stores
- **HTTP Client:** Axios with interceptors
- **Router:** Vue Router 4
- **Build Tool:** Vite
- **Authentication:** JWT-based with auto-refresh

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Heavy Weather Backend running on `http://localhost:5000`

### 1. Clone and Setup
```bash
git clone https://github.com/Arjumand1/heavy-weather-frontend.git
cd heavy-weather-frontend
npm install
```

### 2. Start Development Server
```bash
quasar dev
```

The application will be available at: `http://localhost:8080`

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── AppHeader.vue   # Main header with user menu
│   └── EssentialLink.vue
├── layouts/            # Application layouts
│   └── MainLayout.vue  # Main app layout
├── pages/              # Route components
│   ├── IndexPage.vue   # TodoMVC main interface
│   ├── LoginPage.vue   # User login
│   ├── SignupPage.vue  # User registration
│   ├── ForgotPasswordPage.vue  # Password reset request
│   └── SetPasswordPage.vue     # Password reset form
├── stores/             # Pinia state stores
│   ├── auth.js         # Authentication state
│   └── tasks.js        # Task management state
├── router/             # Vue Router configuration
├── config/             # App configuration
└── utils/              # Utility functions
```

## Key Features

### Task Management
- **Add Tasks** - Professional dialog with title and description
- **Edit Tasks** - In-line editing with validation  
- **Task Details** - Click any task to view full information
- **Mark Complete** - Toggle completion status with timestamps
- **Delete Tasks** - Individual or bulk deletion
- **Smart Filtering** - All/Active/Completed views

### Authentication Flow
- **User Registration** - Account creation with email verification
- **Secure Login** - JWT-based authentication
- **Password Reset** - Email-based recovery system
- **Profile Management** - Edit user information
- **Auto Logout** - Token expiration handling

### User Experience
- **Responsive Design** - Mobile-first approach
- **Loading States** - Visual feedback for all operations
- **Error Handling** - User-friendly error messages
- **Optimistic Updates** - Immediate UI updates with rollback
- **Help System** - Built-in user guidance

## Development

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
quasar dev
```

### Lint Code
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

### Build for Production
```bash
quasar build
```

## Environment Configuration

The app connects to the Heavy Weather Backend API. Update API base URL in:
```javascript
// src/config/axios.js
const API_BASE_URL = 'http://localhost:5000'
```

## State Management

### Auth Store (`stores/auth.js`)
- User authentication state
- Login/logout functionality  
- Profile management
- Token handling

### Tasks Store (`stores/tasks.js`)
- Task CRUD operations
- Filtering and sorting
- Optimistic updates
- Error handling

## API Integration

All API calls are centralized in Pinia stores:
- **Authentication:** Login, logout, signup, password reset
- **Profile:** Get/update user information
- **Tasks:** Full CRUD operations with filtering

## Routing

- `/` - TodoMVC main interface (protected)
- `/login` - User login
- `/signup` - User registration  
- `/forgot-password` - Password reset request
- `/set-password/:token/:uidb64` - Password reset form

## Production Deployment

1. **Build the application:**
```bash
quasar build
```

2. **Deploy `dist/spa` folder** to your web server

3. **Configure API URL** for production environment

4. **Set up HTTPS** for secure authentication

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

This is a TodoMVC demonstration project showcasing Vue3 + Quasar best practices with the rococo backend framework.

## License

Built as a demonstration of modern Vue3 application architecture.
