
# YourViews - Admin Access Protection

## Current Implementation

The application now has a placeholder authentication system that:
- Manages user state in a context
- Protects admin routes
- Shows/hides admin UI elements based on user role
- Includes login/logout functionality

However, **this is only a front-end implementation** and is not secure for production use.

## Supabase Integration Instructions

To make this application production-ready with proper authentication and database functionality, follow these steps to integrate Supabase:

### 1. Connect Your Project to Supabase

1. Click on the green Supabase button in the top right of the Lovable interface
2. Follow the connection steps to link your Lovable project with Supabase

### 2. Set Up Authentication

In your Supabase project:
1. Navigate to Authentication → Settings
2. Configure Email authentication
3. Set up any additional auth providers (Google, GitHub, etc.)

### 3. Create Database Tables

Create these essential tables:
- `users` (will be created automatically by Supabase Auth)
- `user_profiles` (for demographic information)
- `topics` (for discussion topics)
- `polls` (for storing poll questions)
- `poll_options` (for poll choices)
- `votes` (to record user votes)

### 4. Modify the Auth Context

Update the `AuthContext.tsx` file to use Supabase auth:
- Replace the mock login/logout with Supabase auth methods
- Use Supabase's auth listener for real-time auth state updates

### 5. Add Row-Level Security

Configure RLS policies to:
- Allow all users to view topics and polls
- Only allow authenticated users to vote
- Only allow admin users to access admin functionality

### 6. Update API Calls

Replace the mock data with real Supabase database queries:
- Use Supabase client for all database operations
- Update components to handle loading states and errors

## Testing Admin Access

For testing the current implementation:
- Use email: `admin@example.com` (any email with "admin" in it will be treated as admin)
- Password: any 6+ character password
- Regular user: use any email without "admin" in it

Once Supabase is integrated, you'll need to update the admin role assignment in the database.
