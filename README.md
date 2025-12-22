# 🏥 Doctor Management System

A comprehensive healthcare platform that connects patients with doctors through secure video consultations, appointment scheduling, and credit-based payment system.

## ✨ Features

### 🎯 Core Functionality
- **User Management**: Multi-role system (Patients, Doctors, Admins)
- **Appointment Scheduling**: Easy booking system with availability management
- **Video Consultations**: Integrated Vonage Video API for secure telehealth
- **Credit System**: Pay-per-consultation model with credit packages
- **Doctor Verification**: Admin-controlled verification process
- **Payout System**: Automated payment processing for doctors

### 👥 User Roles

#### Patient
- Browse and book appointments with verified doctors
- Video consultations via secure platform
- Credit-based payment system
- Appointment history and management

#### Doctor
- Profile creation with specialty and experience
- Availability management and scheduling
- Video consultation capabilities
- Earnings tracking and payout requests
- Verification status management

#### Admin
- Doctor verification and approval
- Payout processing and management
- Platform oversight and user management

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Clerk
- **Video**: Vonage Video API
- **Styling**: Radix UI components, Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **State Management**: React hooks and server actions

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account for authentication
- Vonage account for video services

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Doctor--management--main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/doctor_management"
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # Vonage Video API
   VONAGE_API_KEY=your_vonage_api_key
   VONAGE_API_SECRET=your_vonage_api_secret
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # Seed database (if applicable)
   npx prisma db seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
Doctor--management--main/
├── actions/                 # Server actions for data operations
├── app/                     # Next.js app router pages
│   ├── (auth)/             # Authentication routes
│   ├── (main)/             # Main application routes
│   │   ├── admin/          # Admin dashboard
│   │   ├── doctor/         # Doctor portal
│   │   ├── doctors/        # Doctor listing and profiles
│   │   ├── appointments/    # Appointment management
│   │   └── video-call/     # Video consultation interface
│   └── api/                # API endpoints
├── components/              # Reusable UI components
├── lib/                     # Utility functions and configurations
├── prisma/                  # Database schema and migrations
└── public/                  # Static assets
```

## 🔐 Key Features Explained

### Credit System
- Patients start with 2 free credits
- Credits are consumed per appointment
- Credit packages available for purchase
- Admin can adjust credits manually

### Video Consultations
- Secure Vonage Video API integration
- Session management and token handling
- Real-time video communication
- Appointment-based session creation

### Doctor Verification
- Multi-step verification process
- Document upload and review
- Admin approval workflow
- Status tracking (Pending/Verified/Rejected)

### Payout System
- Automated credit-to-cash conversion
- Platform fee calculation (2 USD per credit)
- PayPal integration for payments
- Admin processing and approval

## 🚀 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma database browser

## 🌐 API Endpoints

- `POST /api/user/create` - User creation
- `GET /api/user/current` - Current user info
- `POST /api/contact` - Contact form submission
- Various server actions for CRUD operations

## 🔒 Security Features

- Role-based access control
- Route protection middleware
- Secure video session management
- Environment variable protection
- Input validation with Zod

## 🎨 UI Components

Built with modern design principles using:
- Radix UI primitives for accessibility
- Tailwind CSS for styling
- Responsive design for all devices
- Dark/light theme support
- Custom component library

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interfaces
- Adaptive layouts for all screen sizes

## 🚧 Development Guidelines

1. **Code Style**: Follow ESLint configuration
2. **Components**: Use existing UI component library
3. **Database**: Always use Prisma for database operations
4. **Authentication**: Implement proper route protection
5. **Forms**: Use React Hook Form with Zod validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support and questions, please contact the development team.

---

**Built with ❤️ using Next.js and modern web technologies**
