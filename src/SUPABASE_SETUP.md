
# Supabase Setup Instructions

Follow these steps to set up your Supabase database for this application:

## Step 1: Run the SQL Scripts

1. Go to the Supabase Dashboard
2. Open the SQL Editor
3. Copy the contents of `src/sql/create_tables.sql`
4. Paste it into the SQL Editor and run it

This will create all the necessary tables:
- `professionals` - For storing information about healthcare professionals
- `patients` - For storing patient information
- `visits` - For storing visit records
- `vital_signs` - For storing vital signs associated with visits

## Step 2: Set Up Authentication

1. Go to Authentication > Settings
2. Under "Site URL", set it to the URL of your application (e.g., the Lovable deployment URL)
3. Under "Redirect URLs", add your application URL plus `/callback` (e.g., `https://your-app-url.com/callback`)

## Step 3: Update the Application

The application is already configured to use your Supabase credentials from `src/lib/supabase.ts`.
If you need to change the Supabase URL or anon key, update them in that file.

## Step 4: Migrating Existing Data

If you have existing data in localStorage that you want to migrate to Supabase:

1. Make sure you're logged in to the application
2. Go to System Management page
3. You'll see an option to migrate your existing data to Supabase
4. This will take all your current localStorage data and insert it into Supabase tables

## Step 5: Testing

After setup, test the following functionality:
- User registration and login
- Adding new professionals
- Adding new visits
- Viewing visits list
- Viewing patient history

If you encounter any issues, check the browser console for error messages.
