# SmartSpend - HackKnight 2025

## 🏆 Finance Track Project

**Team Members:**
- Ali
- Kyoshi  
- Shashi
- Nirav

**Event:** HackKnight 2025 - Finance Track

---

## 📋 Project Overview

SmartSpend is a modern full-stack personal finance management application built with cutting-edge technologies. The application helps users track expenses, manage budgets, and gain insights into their spending habits.

## 🛠️ Tech Stack

### Backend
- **Framework:** NestJS (Node.js)
- **Language:** TypeScript
- **Database:** PostgreSQL with TypeORM
- **Authentication:** bcrypt for password hashing
- **Validation:** class-validator & class-transformer

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Routing:** React Router DOM
- **State Management:** TanStack React Query
- **Forms:** React Hook Form with Zod validation

## 🚀 Getting Started

### Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (version 18.x or higher recommended)
- **npm** (comes with Node.js)
- **PostgreSQL** (for database)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartSpend
   ```

2. **Backend Setup**
   ```bash
   cd SmartSpend/backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd SmartSpend/frontend
   npm install
   ```

4. **Database Setup**
   - Install PostgreSQL on your machine
   - Create a database for the project
   - Update database configuration in `backend/src/app.module.ts` (if needed)

### Running the Application

#### Backend Server
```bash
cd SmartSpend/backend
npm run start:dev
```
The backend server will start on `http://localhost:3000`

#### Frontend Development Server
```bash
cd SmartSpend/frontend
npm run dev
```
The frontend application will start on `http://localhost:5173`

## 📁 Project Structure

```
SmartSpend/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── main.ts         # Application entry point
│   │   ├── app.module.ts   # Root module
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   └── users/          # User feature module
│   │       ├── dto/        # Data Transfer Objects
│   │       ├── entities/   # Database entities
│   │       ├── users.controller.ts
│   │       ├── users.service.ts
│   │       └── users.module.ts
│   ├── package.json
│   └── README.md
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── main.tsx       # React entry point
│   │   ├── App.tsx        # Main App component
│   │   ├── pages/         # Route components
│   │   ├── components/    # Reusable components
│   │   │   ├── ui/       # UI component library
│   │   │   └── Landing/  # Feature components
│   │   └── lib/          # Utility functions
│   ├── package.json
│   └── README.md
└── README.md              # This file
```

## 🔧 Available Scripts

### Backend Scripts
```bash
npm run start:dev      # Start development server with hot reload
npm run start          # Start production server
npm run build          # Build the application
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run lint           # Run ESLint
```

### Frontend Scripts
```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Run ESLint
```

## 🌐 API Endpoints

The backend provides RESTful API endpoints for:

- **Users Management**
  - `POST /users` - Create new user
  - `GET /users` - Get all users
  - `GET /users/:id` - Get user by ID
  - `PUT /users/:id` - Update user
  - `DELETE /users/:id` - Delete user

## 🔒 Environment Variables

Create a `.env` file in the backend directory with:

```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/smartspend_db
JWT_SECRET=your_jwt_secret_here
```

## 📱 Features

- **User Authentication & Authorization**
- **Expense Tracking**
- **Budget Management**
- **Financial Analytics & Insights**
- **Responsive Design**
- **Modern UI/UX**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏅 HackKnight 2025

This project was created for **HackKnight 2025** in the **Finance Track**. 

**Team Members:**
- **Ali** - [Role/Contribution]
- **Kyoshi** - [Role/Contribution]  
- **Shashi** - [Role/Contribution]
- **Nirav** - [Role/Contribution]

## 🆘 Troubleshooting

### Common Issues

1. **Node.js Version Issues**
   - Ensure you're using Node.js 18.x or higher
   - Use `nvm` to manage Node.js versions if needed

2. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check database credentials in environment variables
   - Ensure the database exists

3. **Port Already in Use**
   - Change the port in the respective configuration files
   - Kill processes using the ports: `lsof -ti:3000 | xargs kill -9`

### Getting Help

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all dependencies are installed correctly
3. Ensure all required services (PostgreSQL) are running
4. Check the troubleshooting section above

---

**Happy Coding! 🚀**

*Built with ❤️ by Team SmartSpend for HackKnight 2025*
