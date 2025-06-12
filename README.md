# EventEase - Event Management System

A modern, full-stack event management application built with Next.js 15+, TypeScript, Prisma, and Firebase Authentication.

Check the walthrough here : `https://drive.google.com/file/d/14afycmK3vOLIRwksFsKkFOz8IkkuYK2g/view?usp=drive_link`

Deployed link : ```https://event-ease-two.vercel.app/```

if signup not working , try with these credentials-

## Admin - remoramu120@gmail.com , password - 123456
## Event owner - remo@gmail.com , password - 123456
## staff - remor12@gmail.com , password - 123456

## Features

### Authentication & Authorization
- 🔐 Secure authentication using Firebase Auth
- 📧 Email/password and social login support
- 🔒 Protected routes and API endpoints
- 👥 Role-based access control (Admin, Event Owner, Staff)
- 🔑 Session management with secure cookies

### Role-Based Access Control (RBAC)

#### Admin Role
- 👑 Full system access and control
- 📊 Access to admin dashboard
- 👥 Manage all users and their roles
- 🔧 System configuration management
- 📝 View and manage audit logs
- 🎭 Modify any event regardless of ownership
- 🛡️ Override moderation decisions
- 📈 Access system-wide analytics

#### Event Owner Role
- 📅 Create unlimited events
- ✏️ Edit own events:
  - Update event details
  - Modify event capacity
  - Set ticket prices
- ❌ Delete own events
- 📊 View event analytics
- 👥 Manage event attendees
- 💰 Handle ticket sales
- 📬 Send communications to attendees
- 📝 Respond to event comments

#### Staff Role
- 🛡️ Access moderation dashboard
- 🚫 Review and moderate events:
  - Hide inappropriate events
  - Flag suspicious content
  - Review reported events
- 🚩 Handle user reports
- ⚡ Execute quick moderation actions
- ❌ Cannot create or edit events

#### Regular User Role
- 👀 View public events
- 🎟️ RSVP to events
- 🔍 Search and filter events

### Permission Matrix

| Action                    | Admin | Event Owner | Staff | User |
|--------------------------|-------|-------------|--------|------|
| Create Events            | ✅    | ✅         | ❌    | ❌   |
| Edit Any Event           | ✅    | ❌         | ❌    | ❌   |
| Edit Own Events          | ✅    | ✅         | ❌    | ❌   |
| Delete Any Event         | ✅    | ❌         | ❌    | ❌   |
| Delete Own Events        | ✅    | ✅         | ❌    | ❌   |
| Moderate Content         | ✅    | ❌         | ✅    | ❌   |
| View Admin Dashboard     | ✅    | ❌         | ❌    | ❌   |
| View Staff Dashboard     | ✅    | ❌         | ✅    | ❌   |
| Manage Users             | ✅    | ❌         | ❌    | ❌   |
| View Events              | ✅    | ✅         | ✅    | ✅   |
| RSVP to Events           | ✅    | ✅         | ✅    | ✅   |
| Comment on Events        | ✅    | ✅         | ✅    | ✅   |
| Report Content           | ✅    | ✅         | ✅    | ✅   |
| View Analytics           | ✅    | Own Only    | ❌    | ❌   |
| Handle Ticket Sales      | ✅    | Own Only    | ❌    | ❌   |


### Event Management
- 📅 Create, read, update, and delete events
- 💰 Support for free and paid events
- 💲 Event pricing and ticket management
- 🎟️ RSVP functionality
- 📊 Event capacity management
- 📍 Event location and details
- 📱 Responsive design for all devices
- 🔗 Shareable event links
- 📋 Attendee management

### Event Owner Features
- 🎭 Dedicated event owner role
- 📝 Create and manage multiple events
- 💼 Full control over own events
- 📈 Event analytics and insights
- 📊 Capacity adjustment
- 📅 Event scheduling

### Moderation System
- 🛡️ Content moderation tools for staff
- 🚫 Event moderation capabilities
- 👮 Staff dashboard
- ⚡ Quick actions for moderators

### User Experience
- ⚡ Fast page loads with Next.js 15 App Router
- 🎨 Modern UI with Tailwind CSS
- 💫 Smooth animations and transitions
- 🔍 Search and filter events
- 📱 Mobile-first responsive design

### Administrative Features
- 📊 Admin dashboard
- 👥 User management
- 📈 System statistics
- 🎭 Role management

## Tech Stack

- **Frontend**
  - Next.js 15+ with App Router
  - React with TypeScript
  - Tailwind CSS for styling
  - shadcn/ui components
  - React Hook Form for form handling
  - Zod for validation

- **Backend**
  - Next.js API Routes
  - Prisma ORM for database access
  - Firebase Admin SDK
  - Model-View-Controller (MVC) architecture

- **Database**
  - PostgreSQL

- **Authentication & Authorization**
  - Firebase Authentication
  - Custom session management
  - Role-based access control (RBAC)
  - Secure cookie handling

- **Security**
  - Secure password hashing
  - Input validation
  - Secure headers

- **Development & Deployment**
  - TypeScript for type safety
  - ESLint for code quality
  - Prettier for code formatting
  - Vercel for deployment
  - Environment variable management


## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 22.13.0+ 
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
npm install
```

3. Set up your database:
```bash
npm prisma generate
npm prisma migrate dev
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/                  # Next.js 15 App Router pages
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

### Admin Routes (Admin Only)
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/:id` - Update user role/status
- `DELETE /api/admin/users/:id` - Delete user account
- `GET /api/admin/audit-logs` - View system audit logs
- `GET /api/admin/analytics` - System-wide analytics

### Event Owner Routes (Event Owners & Admin)
- `POST /api/events` - Create new event
- `GET /api/events/owned` - List owned events
- `PUT /api/events/:id` - Update own event
- `DELETE /api/events/:id` - Delete own event
- `GET /api/events/:id/analytics` - Get event analytics
- `POST /api/events/:id/announcements` - Send event announcements
- `GET /api/events/:id/attendees` - List event attendees

### Staff Routes (Staff & Admin)
- `GET /api/staff/moderation-queue` - Get items needing moderation
- `PUT /api/staff/events/:eventId/moderate` - Moderate an event
- `PUT /api/staff/comments/:commentId/hide` - Hide inappropriate comment
- `GET /api/staff/reports` - List reported content
- `PUT /api/staff/reports/:reportId` - Handle report
- `POST /api/staff/moderation-logs` - Create moderation log

### Public Routes (All Authenticated Users)
- `GET /api/events` - List all public events
- `GET /api/events/:id` - Get event details
- `POST /api/events/:id/rsvp` - RSVP to event
- `GET /api/events/:id/rsvp/:rsvpId` - Get RSVP status
- `POST /api/events/:id/comments` - Comment on event
- `POST /api/reports` - Report inappropriate content
- `GET /api/users/profile` - Get own profile
- `PUT /api/users/profile` - Update own profile

## Key Features Explained

### Authentication Flow
1. Users can sign up/sign in using email/password
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

## Testing

### API Testing
The project includes REST API test files that can be used with REST Client (VS Code extension) or similar tools:

1. Event Owner Testing (`test-event-owner.http`):
   - Test event owner signup
   - Test event creation
   - Test event editing
   - Test event deletion

### Manual Testing Steps

1. Create different types of users:
   ```bash
   # Event Owner
   curl -X POST http://localhost:3000/api/auth/signup -H "Content-Type: application/json" -d '{"name":"Test Owner","email":"owner@test.com","password":"password123","role":"EVENT_OWNER"}'

   # Staff Member
   curl -X POST http://localhost:3000/api/auth/signup -H "Content-Type: application/json" -d '{"name":"Test Staff","email":"staff@test.com","password":"password123","role":"STAFF"}'
   ```

2. Test Event Operations:
   - Create events as an event owner
   - Try moderating events as staff
   - Test paid event creation and management
   - Verify role-based permissions

3. Test Moderation:
   - Create test reports
   - Test comment moderation
   - Verify staff actions
   - Check moderation logs


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
