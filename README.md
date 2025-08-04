# LinkedClone - Mini LinkedIn Community Platform

A full-stack professional networking platform built with Next.js, MongoDB, and NextAuth.js. This application provides core LinkedIn-like functionality including user authentication, post creation, and profile management.

## 🚀 Tech Stack

- **Framework**: Next.js (App Router)
- **Authentication**: NextAuth.js with Credentials Provider
- **Database**: MongoDB with MongoDB Atlas
- **Styling**: Tailwind CSS + shadcn/ui
- **Type Safety**: TypeScript
- **Deployment**: Vercel

## ✨ Features

### User Authentication

- Email/password registration and login
- Secure password hashing with bcryptjs
- JWT-based session management
- Protected routes and API endpoints

### Post Management

- Create, read, update, and delete posts
- Rich text posts with title and description
- Real-time post feed
- User-specific post management

### Profile System

- Public user profiles
- Customizable bio and profile information
- User post history
- Profile editing for authenticated users

### Modern UI/UX

- Responsive design optimized for all devices
- Professional LinkedIn-inspired interface
- Smooth animations and micro-interactions
- Accessible components with proper contrast ratios

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier available)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd linkedclone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb_uri_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here
```

**Important**: Replace the MongoDB URI with your actual MongoDB Atlas connection string.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔐 Demo Credentials

For testing purposes, you can create an account or use these demo credentials:

- **Email**: demo@example.com
- **Password**: 123456

_Note: These credentials need to be created through the registration process._

## 📁 Project Structure

```
├── app/                    # App Router pages and API routes
│   ├── api/               # API endpoints
│   │   ├── auth/          # Authentication routes
│   │   ├── posts/         # Post management
│   │   └── users/         # User management
│   ├── auth/              # Authentication pages
│   ├── profile/           # Profile pages
│   └── settings/          # Settings page
├── components/            # Reusable UI components
├── lib/                   # Utility functions and database
│   ├── models/            # Data models
│   └── db.ts             # Database operations
└── types/                 # TypeScript type definitions
```

## 🚀 Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET`
4. Deploy!

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and add it to `.env.local`

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Posts

- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post

### Users

- `GET /api/users/[id]` - Get user profile and posts
- `PUT /api/users/[id]` - Update user profile

## 🎯 Core Features Implemented

- ✅ User registration and authentication
- ✅ Create, read, update, delete posts
- ✅ Public post feed
- ✅ User profiles with bio and post history
- ✅ Responsive design
- ✅ Professional UI with shadcn components

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**

   - Ensure your IP is whitelisted in MongoDB Atlas
   - Check your connection string format
   - Verify database user credentials

2. **Authentication Issues**

   - Make sure `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches your domain

3. **Build Issues**
   - Clear `.next` folder and `node_modules`
   - Run `npm install` again

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

If you have any questions or need help, please open an issue in the GitHub repository.
