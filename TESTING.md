
# Testing Guide

This guide provides instructions on how to test the login functionality for both public (regular) users and admin users.

## Prerequisites

Before you begin, you will need the following:

- A running instance of the application.
- Access to the Supabase project associated with this application.

## Testing Public User Login

1.  **Navigate to the registration page:** Open your browser and go to `/register`.
2.  **Create a new user:** Fill out the registration form with a valid email and password and submit the form.
3.  **Verify redirection:** After successful registration, you should be redirected to the home page.
4.  **Log out:** Click the "Logout" button in the navigation bar.
5.  **Navigate to the login page:** Go to `/login`.
6.  **Log in with the new user:** Enter the email and password you used to register.
7.  **Verify successful login:** You should be redirected to the home page and see the user's email in the navigation bar.

## Testing Admin User Login

### 1. Make a User an Admin

To test the admin functionality, you first need to grant admin privileges to a user. This must be done directly in the Supabase database.

1.  **Sign up a new user:** Follow the steps in the "Testing Public User Login" section to create a new user.
2.  **Open your Supabase project:** Go to the Supabase dashboard.
3.  **Navigate to the `profiles` table:** In the Supabase dashboard, go to the "Table Editor" and select the `profiles` table.
4.  **Find the user:** Locate the row corresponding to the user you want to make an admin.
5.  **Set `is_admin` to `true`:** Find the `is_admin` column and change its value from `false` to `true`.

### 2. Test Admin Access

1.  **Log out:** If you are currently logged in, log out of the application.
2.  **Log in as the admin user:** Navigate to the `/login` page and log in with the user you just promoted to admin.
3.  **Access the admin dashboard:** After logging in, navigate to `/admin`.
4.  **Verify access:** You should be able to see the admin dashboard. If you are redirected to the home page or see a "not authorized" message, there is an issue with the admin role or the protected route.

### 3. Test Non-Admin Access to Admin Routes

1.  **Log in as a non-admin user:** Log in with a user that does not have admin privileges.
2.  **Attempt to access the admin dashboard:** Navigate to `/admin`.
3.  **Verify redirection:** You should be redirected to the home page. You should not be able to see the admin dashboard.
