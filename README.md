# Event Management System

A modern, full-stack event management application built with Next.js 13+, TypeScript, Prisma, and Firebase Authentication.

## Features

### Authentication & Authorization
- 🔐 Secure authentication using Firebase Auth
- 📧 Email/password and social login support
- 🔒 Protected routes and API endpoints
- 👥 Role-based access control (Admin, Staff, User)
- 🔑 Session management with secure cookies

### Event Management
- 📅 Create, read, update, and delete events
- 🌍 Public/private event visibility
- 🎟️ RSVP functionality
- 📊 Event capacity management
- 📍 Event location and details
- 📱 Responsive design for all devices
- 🔗 Shareable event links
- 📋 Attendee management

### User Experience
- ⚡ Fast page loads with Next.js 13 App Router
- 🎨 Modern UI with Tailwind CSS
- 💫 Smooth animations and transitions
- 🔍 Search and filter events
- 📱 Mobile-first responsive design
- 🌙 Dark/light mode support
- 🔔 Real-time updates (coming soon)

## Tech Stack

- **Frontend**: Next.js 13+, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Firebase Auth
- **Deployment**: Vercel
- **State Management**: React Context
- **Form Handling**: React Hook Form
- **Styling**: Tailwind CSS, shadcn/ui components
- **Email**: SendGrid (optional)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm or pnpm
- PostgreSQL database
- Firebase project

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/eventdb?schema=public"

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key

# Optional: Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd event
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up your database:
```bash
pnpm prisma generate
pnpm prisma migrate dev
```

4. Run the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/                  # Next.js 13 App Router pages
│   ├── api/             # API routes
│   ├── auth/            # Authentication pages
│   └── events/          # Event pages
├── components/          # Reusable React components
├── lib/                 # Utility functions and configurations
└── types/              # TypeScript type definitions
```

## API Routes

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/session` - Get session data

### Events
- `GET /api/events` - List all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/rsvp` - RSVP to event
- `GET /api/events/:id/rsvp/:rsvpId` - Get RSVP status

## Key Features Explained

### Authentication Flow
1. Users can sign up/sign in using email/password or social providers
2. Firebase handles the authentication
3. Session cookies are used for persistent auth
4. Protected routes check auth status via middleware

### Event Management
1. Create events with title, description, date, location, capacity
2. Set event visibility (public/private)
3. Manage RSVPs and attendee list
4. Edit and delete events (owner only)
5. Share event links with anyone

### RSVP System
1. Users can RSVP to public events
2. Capacity limits are enforced
3. RSVP status tracking
4. Email notifications (optional)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

1. Build the application:
```bash
pnpm build
```

2. Start the production server:
```bash
pnpm start
```

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for the deployment platform
- shadcn/ui for beautiful components
- Prisma team for the great ORM
- Firebase team for authentication
