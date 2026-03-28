# ESO Addon Tracker

A full-stack web application for tracking and managing Elder Scrolls Online (ESO) addons with custom code modifications. Built as a school project demonstrating modern web development practices with FastAPI and React.

## 🎯 Features

### Core Functionality
- **User Authentication** - JWT-based authentication with secure HTTP-only cookies
- **CRUD Operations** - Create, read, update, and delete addon entries
- **Code Modification Tracking** - Track custom changes made to addon code with side-by-side comparison
- **Advanced Filtering** - Search by name/author, filter by category, status, and modification state
- **Sorting** - Sort addons by name, rating, or category
- **ESO-Themed UI** - Custom Elder Scrolls Online inspired design with gold/tan color scheme

### Additional Features
- Form validation with error handling
- Responsive design
- Session persistence
- Expandable code comparison view
- Category-specific icons (Swords, Map, Hammer, etc.)

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Pydantic** - Data validation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Context API** - State management

### Testing
- **Cypress** - End-to-end testing framework

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **npm** or **yarn**

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/eso-addon-tracker.git
cd eso-addon-tracker
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

## 🎮 Running the Application

### Start Backend Server
```bash
cd backend
# Make sure virtual environment is activated
uvicorn app:app --reload --host localhost
```

Backend will run on: `http://localhost:8000`

### Start Frontend Dev Server
```bash
cd frontend
npm run dev
```

Frontend will run on: `http://127.0.0.1:5173`

### Access the Application

Open your browser and navigate to: `http://127.0.0.1:5173`

## 🧪 Running Tests

### Cypress E2E Tests
```bash
cd frontend

# Interactive mode (Cypress UI)
npm run test:e2e

# Headless mode (CLI)
npm run test:e2e:headless
```

**Note:** Both frontend and backend servers must be running for tests to pass.

### Test Coverage

- Authentication flow (register, login, logout)
- Navigation between pages
- Protected routes
- Form validation
- Session persistence

## 📁 Project Structure
```
eso-addon-tracker/
├── backend/
│   ├── config/
│   │   └── database.py          # Database configuration
│   ├── models/
│   │   ├── addon.py             # Addon model
│   │   └── user.py              # User model
│   ├── routes/
│   │   ├── addons.py            # Addon CRUD endpoints
│   │   └── auth.py              # Authentication endpoints
│   ├── schemas/
│   │   ├── addon.py             # Pydantic schemas for addons
│   │   └── auth.py              # Pydantic schemas for auth
│   ├── utils/
│   │   ├── auth.py              # JWT utilities
│   │   └── password.py          # Password hashing
│   ├── app.py                   # FastAPI application
│   └── requirements.txt         # Python dependencies
│
├── frontend/
│   ├── cypress/
│   │   ├── e2e/                 # E2E test files
│   │   └── support/             # Cypress support files
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── context/             # React context (AuthContext)
│   │   ├── services/            # API service layer
│   │   ├── types/               # TypeScript types
│   │   ├── config/              # Axios configuration
│   │   └── App.tsx              # Main app component
│   ├── cypress.config.ts        # Cypress configuration
│   ├── vite.config.ts           # Vite configuration
│   └── package.json             # Node dependencies
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user

### Addons (Protected)
- `GET /addons/` - Get all user's addons
- `POST /addons/` - Create new addon
- `PUT /addons/{id}` - Update addon
- `DELETE /addons/{id}` - Delete addon

## 🎨 Design Choices

### Color Scheme
- **Primary Gold**: `#c5a572` - ESO tan/gold
- **Secondary Gold**: `#d4a554` - Orange gold
- **Background**: `#000000` - Black
- **Borders**: Square, ESO-style

### Authentication
- JWT tokens stored in HTTP-only cookies for security
- 30-minute token expiration
- Automatic login after registration

### Code Modification Feature
- Line range tracking
- Original vs. modified code comparison
- Visual indicators (red for original, green for modified)
- Monospace font preserves formatting

## 🔒 Security Features

- Password hashing with bcrypt
- HTTP-only cookies prevent XSS attacks
- CORS configured for specific origins
- JWT token validation on protected routes
- SQL injection protection via SQLAlchemy ORM

## 🚧 Future Enhancements

- [ ] Add addon version history tracking
- [ ] Export addon list to CSV/JSON
- [ ] Dark/light theme toggle
- [ ] Addon update notifications
- [ ] Batch operations (bulk delete, bulk update)
- [ ] Addon dependency tracking
- [ ] Integration with ESOUI.com API
- [ ] User profile customization

## 📝 License

This project is created for educational purposes as part of an AI Developer program.

## 👤 Author

**Constantine** - AI Developer Student, Sweden

## 🙏 Acknowledgments

- Elder Scrolls Online for inspiration
- Course instructors and materials
- FastAPI and React communities